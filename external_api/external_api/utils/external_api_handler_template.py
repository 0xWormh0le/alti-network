import ast
from abc import ABC, abstractmethod
from datetime import date, datetime, timedelta, timezone
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Dict, List, Optional, Set

import jinja2
from tools import datetime_tools
from tools.catalogs import Platform
from tools.class_tools import cached_property
from tools.cw_embedded_metrics.metric_manager import MetricUnit
from tools.dynamo.users_table.users_manager import UsersManager
from tools.lambda_handler import LambdaEvent, LambdaHandler, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.sql.sql_connect import QueryParams
from tools.string_tools import StringTools

from external_api.exceptions import BadRequest, InternalServerError, TooLargePayloadError
from external_api.models.event import Event
from external_api.models.file import File
from external_api.models.user import User
from external_api.user.user_generator import UserGenerator
from external_api.utils.constants import (
    DEFAULT_CACHE_TTL_SEC,
    MAX_PAGE_SIZE,
    SQL_SLOW_THRESHOLD_MED,
)
from external_api.utils.sql_paginator import SQLPaginator


class CloudWatchMetric(Enum):
    DATABASE_ERROR = "database_error"
    DELETE_PERMISSION_COUNT = "file_permissions_count_removed"
    MISSING_ACTOR_INFO = "missing_actor_information"
    MISSING_ROOT_DRIVE_INFO = "missing_root_drive_information"
    MISSING_METRIC_ID = "missing_metric_id"
    MISSING_METRIC_VALUE = "missing_metric_value"
    VIEW_COUNT = "view_count"
    DAILY_RISKS_SUMMARY = "daily_risks_summary"


class ExternalApiHandlerTemplate(LambdaHandler, ABC):
    name = __name__
    cloudwatch_namespace = "altitude/external_api"
    orderable_by: Set[str]
    event: LambdaEvent

    def __init_subclass__(cls, orderable_by: Optional[Set[str]] = None) -> None:
        cls.orderable_by = orderable_by or set()

    def __init__(
        self,
        enable_sentry: bool = True,
        raise_errors: bool = False,
        log_level: Optional[int] = None,
    ) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
            log_level=log_level,
        )
        self._app_id: Optional[str] = None
        self._at_risk: Optional[str] = None
        self._email: Optional[str] = None
        self._file_id: Optional[str] = None
        self._folder_id: Optional[str] = None
        self._parent_id: Optional[str] = None
        self._order_by: Optional[str] = None
        self._page_count: int = 0
        self._page_count_cache_ttl: int = DEFAULT_CACHE_TTL_SEC
        self._page_count_last_updated: Optional[int] = None
        self._permission_id: Optional[str] = None
        self._person_id: Optional[str] = None
        self._query_response: List[Dict[str, Any]] = []
        self._query_stats: Dict[str, int] = {}
        self._risk_id: Optional[str] = None
        self._risk_type_ids: Set[int] = set()
        self._sensitive_content_only: bool = False

    @property
    def job_name(self) -> str:
        return "external_api_template"

    @property
    def app_id(self) -> Optional[str]:
        self._app_id = self.event.get_path_parameter("applicationId")
        if not self._app_id:
            self._app_id = self.event.get_query_parameter("application-id")
        return self._app_id

    @property
    def event_category(self) -> str:
        # There is an unfortunate naming overlap between the `event-type` API request parameter and
        # the corresponding `admin_reports_v1_drive.event_type` DB column. They mean different
        # things: the former coarsely classifies events into `downloads`, `sharedBy`, `sharedWith`,
        # `added` categories, whereas the latter is part of a two-level taxonomy of events per
        # <https://developers.google.com/admin-sdk/reports/v1/appendix/activity/drive>, with the
        # `event_type` column referring to the *first* level and the `event_name` column referring
        # to the *second* level.
        # TODO: Rename the `event-type` API request parameter to `event-category` to avoid this
        # naming overlap. <https://altitudenetworks.atlassian.net/browse/API-79>
        return self.event.get_query_parameter("event-type", "")

    @property
    def metrics(self) -> List[str]:
        raw_metrics = self.event.get_query_parameter("metrics")
        if not raw_metrics:
            raw_metrics = [
                "allActivity",
                "appDownloads",
                "atRiskFilesOwned",
                "collaborators",
                "filesSharedBy",
                "filesSharedWith",
                "personDownloads",
                "risks",
                "risksCreated",
            ]
        return [item.lower() for item in raw_metrics]

    @property
    def order_by(self) -> str:
        if self._order_by:
            return self._order_by

        order_by = self.event.get_query_parameter("order-by") or "datetime"
        order_by = order_by.lower().replace("-", "_")
        if order_by == "date_time":
            order_by = "datetime"
        if order_by == "sev":
            order_by = "severity"
        if order_by == "permissions-emailaddress":
            order_by = "permissions_emailaddress"
        if order_by == "permissions-id":
            order_by = "permissions_id"
        if any(order_by == expr for expr in self.orderable_by):
            self._order_by = order_by
            return self._order_by
        raise BadRequest(f"Invalid order expression (order-by): {order_by}")

    @property
    def sort(self) -> str:
        order_direction = self.event.get_query_parameter("sort") or "DESC"
        order_direction = order_direction.upper()
        if order_direction in ("ASC", "DESC"):
            return order_direction
        raise BadRequest(f"Invalid order direction (sort): {order_direction}")

    @property
    def page_number(self) -> int:
        page_number = self.event.get_query_parameter("page-number", 1)
        try:
            page_number = max(1, int(page_number))
            return page_number
        except ValueError as exp:
            raise BadRequest(f"Invalid page_number parameter: {page_number}") from exp

    @property
    def page_count_cache_ttl(self) -> int:
        """
        pageCountCacheTTL allows the API to handle caching the `pageCount` field.
        It could be shorter in the future now, it defaults to 3600 millseconds
        """
        if self._page_count_cache_ttl:
            return self._page_count_cache_ttl

        self._page_count_cache_ttl = (
            int(self.event.get_query_parameter("page-count-cache-ttl")) or DEFAULT_CACHE_TTL_SEC
        )
        return self._page_count_cache_ttl

    @property
    def page_count_last_updated(self) -> int:
        if self._page_count_last_updated:
            return self._page_count_last_updated

        curr_time = datetime_tools.get_current_utc_datetime().replace(tzinfo=timezone.utc)
        updated_now = datetime_tools.convert_datetime_to_epoch(curr_time)
        self._page_count_last_updated = int(
            self.event.get_path_parameter("page-count-last-updated") or updated_now
        )
        return self._page_count_last_updated

    @cached_property(ttl=DEFAULT_CACHE_TTL_SEC)
    def page_count(self) -> int:
        return self._page_count

    @property
    def page_size(self) -> int:
        page_size = self.event.get_query_parameter("page-size", 10)
        try:
            page_size = max(1, int(page_size))
            if page_size > MAX_PAGE_SIZE:
                raise TooLargePayloadError(
                    f"Request page_size parameter: {page_size} exceeds "
                    f"maximum allowed page_size({MAX_PAGE_SIZE})"
                )
            return page_size
        except ValueError as exp:
            raise BadRequest(f"Invalid page_size parameter: {page_size}") from exp

    @property
    def permission_id(self) -> Optional[str]:
        if self._permission_id:
            return self._permission_id

        self._permission_id = self.event.get_path_parameter("permissionId")
        if not self._permission_id:
            self._permission_id = self.event.get_query_parameter("permission-id")

        return self._permission_id

    @cached_property
    def platform(self) -> Platform:
        platform_str = self.event.get_query_parameter("platform-id", "gsuite")
        try:
            platform = Platform(platform_str)
        except ValueError:
            raise BadRequest(f"Invalid platform value: {platform_str}") from None
        if platform not in self.configs.platforms_as_enum:
            raise BadRequest(f"Unconfigured platform: {platform_str}")
        return platform

    @cached_property
    def platforms(self) -> List[Platform]:
        """
        Gets the list of platform ids and defaults to currently supported platforms for customer.
        """
        raw_platforms = self.event.get_query_parameter("platform-ids")
        platforms_str = set(ast.literal_eval(raw_platforms)) if raw_platforms else []

        try:
            platforms = {Platform(p) for p in platforms_str}
        except ValueError as exp:
            raise BadRequest(f"Invalid platforms value: {exp}") from None

        unconfigured_platforms = platforms - set(self.configs.platforms_as_enum)
        if unconfigured_platforms:
            # Platform IDs were specified that are not configured for the customer.
            unconfigured_platforms_str = sorted(p.value for p in unconfigured_platforms)
            raise BadRequest(f"Unconfigured platforms: {', '.join(unconfigured_platforms_str)}")

        if not platforms:
            platforms = self.configs.platforms_as_enum

        # TODO: Sort by occurrence in `Platform` enum instead:
        return sorted(platforms, key=lambda p: p.value)

    @cached_property
    def platform_ids_map(self) -> Dict[str, Any]:
        """Build a {`symbolic_name`: `id`} map from platform SQL table."""
        with self.sql_connect().transaction():
            return {
                platform["symbolic_name"]: platform["id"]
                for platform in self.sql_connect().get_dict_query_results("SELECT * FROM platform")
            }

    @property
    def file_id(self) -> Optional[str]:
        if self._file_id:
            return self._file_id

        self._file_id = self.event.get_path_parameter("fileId")
        if not self._file_id:
            self._file_id = self.event.get_query_parameter("file-id")

        return self._file_id

    @property
    def parent_id(self) -> Optional[str]:
        if self._parent_id:
            return self._parent_id

        self._parent_id = self.event.get_path_parameter("parentId")
        if self._parent_id.startswith(("1", "0")):
            return self._parent_id
        raise BadRequest(f"Invalid parent_id value: {self._parent_id}")

    @property
    def folder_id(self) -> Optional[str]:
        if self._folder_id:
            return self._folder_id

        self._folder_id = self.event.get_path_parameter("folderId")
        if self._folder_id.startswith(("1", "0")):
            return self._folder_id
        raise BadRequest(f"Invalid folder_id value: {self._folder_id}")

    @property
    def risk_id(self) -> Optional[str]:
        if self._risk_id:
            return self._risk_id

        self._risk_id = self.event.get_path_parameter("riskId")
        if not self._risk_id:
            self._risk_id = self.event.get_query_parameter("risk-id")

        return self._risk_id

    @property
    def email(self) -> Optional[str]:
        if self._email:
            return self._email

        self._email = self.event.get_query_parameter("email")
        return self._email

    @property
    def at_risk(self) -> Optional[str]:
        if self._at_risk:
            return self._at_risk

        self._at_risk = self.event.get_query_parameter("at-risk")
        self._at_risk = self._at_risk.lower() if self._at_risk else "false"
        if self._at_risk in ("true", "false"):
            return self._at_risk
        raise BadRequest(f"Invalid at_risk value: {self._at_risk}")

    @property
    def creator_id(self) -> Optional[str]:
        return self.event.get_query_parameter("creator-id")

    @property
    def person_id(self) -> Optional[str]:
        self._person_id = self.event.get_path_parameter("personId")
        if not self._person_id:
            self._person_id = self.event.get_query_parameter("person-id")
        if self._person_id:
            self._person_id = self._person_id.lower()
        return self._person_id

    @property
    def severity(self) -> int:
        severity = self.event.get_query_parameter("severity-threshold", 0)
        try:
            severity = int(severity)
            return severity
        except ValueError as exp:
            raise BadRequest(f"Invalid severity parameter: {severity}") from exp

    @property
    def risk_type_ids(self) -> Set[int]:
        raw_risk_types = self.event.get_query_parameter("risk-type-ids")
        try:
            risk_types = set(ast.literal_eval(raw_risk_types)) if raw_risk_types else set()
            self._risk_type_ids = {int(num) for num in risk_types}
            return self._risk_type_ids
        except ValueError as exp:
            raise BadRequest(f"Invalid risk_type_ids parameter: {self._risk_type_ids}") from exp

    @property
    def owner_id(self) -> str:
        return self.event.get_query_parameter("owner-id") or ""

    @property
    def domain(self) -> Optional[str]:
        return self.event.get_query_parameter("domain", "external")

    @cached_property
    def sensitive_content_only(self) -> bool:
        value = self.event.get_query_parameter("sensitive-content-only", "false").lower()
        if value not in ("true", "false"):
            raise BadRequest(
                f"Invalid sensitive-content-only value: {self._sensitive_content_only}"
            )
        return StringTools.str_to_bool(value)

    @property
    def query_response(self) -> List:
        if self._query_response:
            return self._query_response

        raise InternalServerError("query response property cannot be used before run_query method")

    @property
    def query_stats(self) -> Dict[str, int]:
        if self._query_stats:
            return self._query_stats

        raise InternalServerError("query_stats property cannot be used before run_query method")

    @cached_property
    def users_manager(self) -> UsersManager:
        return UsersManager(config=self.configs)

    @abstractmethod
    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Override in sub class
        """

    @staticmethod
    def platform_is_supported(platform: Platform) -> bool:
        """Verifies if platform is currently implemented"""
        return platform.value in ("gsuite", "o365")

    def generate_emf_logs(
        self, endpoint_name: str, user_id: str, metric_name: CloudWatchMetric, metric_value: int
    ) -> None:
        """
        Generate EMF logs for cloudwatch.

        Arguments:
            endpoint_name   -- endpoint name
            user_id         -- user id
            metric_name     -- metric name
            metric_value    -- metric value

        Response:
            None
        """
        # TODO: https://altitudenetworks.atlassian.net/browse/API-228
        self.metric_manager.add_dimension(name="endpoint_name", value=endpoint_name)
        self.metric_manager.add_metadata(key="user_id", value=user_id)
        self.metric_manager.add_metric(
            name=metric_name.value, unit=MetricUnit.Count, value=metric_value
        )

    def log_emf(self, name: str, value: float = 1.0, unit: MetricUnit = MetricUnit.Count) -> None:
        self.metric_manager.add_metric(name=name, value=value, unit=unit)

    def cache_has_expired(self) -> bool:
        """
        Checks if  pageCountLastUpdated + pageCountCacheTTL < current_timestamp
        """
        return self.page_count_cache_ttl + int(
            self.page_count_last_updated
        ) < datetime_tools.convert_datetime_to_epoch(
            datetime_tools.get_current_utc_datetime().replace(tzinfo=timezone.utc)
        )

    def is_internal(self, email: str) -> bool:
        """
        Verifies user email is part of the company
        """
        internal = False
        if email:
            email_domain = email.split("@")[-1]
            internal = email_domain in self.configs.domains

        return internal

    @staticmethod
    def convert_date_to_epoch(dt: date) -> int:
        """
        Convert date to UNIX_TIMESTAMP

        Arguments:
            date_str -- date string
        Returns:
            UNIX TIMESTAMP integer.
        """
        dt = datetime.combine(dt, datetime.min.time()).replace(tzinfo=timezone.utc)
        return int(dt.timestamp())

    @staticmethod
    def get_previous_month(month: date) -> date:
        """
        Get previous month
        """
        return (month.replace(day=1) - timedelta(days=1)).replace(day=1)

    @staticmethod
    def render_jinja_template(
        file_path: Optional[Path] = None,
        query_string: Optional[str] = None,
        query_fragments: Optional[Dict[str, Any]] = None,
    ) -> str:
        """Renders sql query from template string using column args.
        Only one of `file_path` or `query_string` may be specified.

        Arguments:
            file_path: read query template from file with the given path.
            query_string: If provided, use directly as query template.
            query_fragments: sql query parameters to be replaced
        Returns:
            string representing rendered SQL query statement.
        """
        if not query_string and file_path:
            query_string = file_path.read_text()
        assert query_string is not None

        return jinja2.Template(query_string).render(query_fragments)

    def run_read_query(
        self,
        file_path: Optional[Path] = None,
        query_string: str = "",
        query_params: Optional[QueryParams] = None,
        response_mapper: Optional[Callable] = None,
        count_query_string: Optional[str] = None,
    ) -> List[Dict[str, Any]]:
        """Runs read sql queries on the RDS DB and returns
        raw or parsed query results

        Arguments:
            file_path: If provided, read query template from file with the given path.
            query_string: If provided, use directly as query template.
            query_params: sql params to be replaced.
            response_mapper: If provided, used to parse the raw DB query results.
            count_query_string: if provided, computes the total number of found rows.
        Returns:
            Raw or parsed DB query results
        """
        if file_path and query_string:
            raise BadRequest("Only one of file_path or query_string could be passed")

        with self.sql_connect(use_writer=False).open() as sql_connect:
            if file_path:
                query_string = sql_connect.get_query_string(file_path)

            sql_paginator = SQLPaginator(  # type: ignore
                sql_connect=sql_connect,
                query_string=query_string,
                count_query_string=count_query_string,
                query_params=query_params,
                client_page_size=self.page_size,
                client_page_number=self.page_number,
            )
            self._query_response = (
                list(map(response_mapper, sql_paginator.page_of_results))
                if response_mapper
                else sql_paginator.page_of_results
            )

            if not self._page_count:
                self._page_count = sql_paginator.page_count

            if not self._query_stats:
                self._query_stats = {"found_rows": sql_paginator.row_count}

            self.logger.debug(
                f"page_count: {self._page_count}, row_count: {sql_paginator.row_count}"
            )
        return self._query_response

    def run_write_query(
        self,
        table_name: str,
        file_path: Optional[Path] = None,
        query_string: str = "",
        query_params: Optional[QueryParams] = None,
        slow_threshold: Optional[float] = SQL_SLOW_THRESHOLD_MED,
    ) -> Dict[str, Any]:
        """
        Runs write sql queries on the RDS DB and returns raw query results

        Arguments:
            table_name: the name of the SQL table
            file_path: If provided, read query template from file with the given path.
            query_string: If provided, use directly as query template.
            query_params: sql params to be replaced.
            slow_threshold: if provided, provides the query running time threshold.
        Returns:
            Raw or parsed DB query results
        """
        if file_path and query_string:
            raise BadRequest("Only one of file_path or query_string could be passed")

        with self.sql_connect(use_writer=True).open() as sql_connect:
            if file_path:
                query_string = sql_connect.get_query_string(file_path)

            upsert_report = sql_connect.execute_insert_update_query(
                table_name=table_name,
                query_string=query_string,
                query_params=query_params,
                slow_threshold=slow_threshold,
            )

        return upsert_report

    def get_file_record(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Gets the DB response and builds a file response
        """
        return File.to_api_sdk_dm(
            config=self.configs,
            platform=attrs["platform"],
            attrs=attrs,
        )

    def get_event_record(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Gets the DB response and builds an Event response
        """
        base_event = Event.from_sql_dm(
            config=self.configs,
            platform=Platform(attrs["platform"]),
            attrs=attrs,
        ).to_api_dm()

        # TODO: https://altitudenetworks.atlassian.net/browse/API-228
        if not base_event.get("actor"):
            self.generate_emf_logs(
                endpoint_name=CloudWatchMetric.MISSING_ACTOR_INFO.value,
                user_id=f"{self.person_id}",
                metric_name=CloudWatchMetric.DATABASE_ERROR,
                metric_value=1,
            )

        return base_event

    def get_user_record(self, platform: str, email: str) -> Dict[str, Any]:
        """Fetch user record from Dynamo"""
        user_record = UserGenerator(
            config=self.configs,
            platform=platform,
        ).get_user_record(email=email)

        return User.to_api_sdk_dm(user_record) if user_record else user_record


#######################################
def main() -> None:
    class TestExternalApiHandler(ExternalApiHandlerTemplate):
        name = __name__
        event: LambdaEvent

        def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
            self.logger.info(f"event: {self.event}")
            self.logger.info(f"env: {self.configs.env}")
            return {}

    context = get_dummy_context()
    context.function_name = "test_handler"

    event = {"Records": [{"body": {"project_id": "thoughtlabs"}}]}
    TestExternalApiHandler(enable_sentry=False, raise_errors=True).handle(event, context)


if __name__ == "__main__":
    main()
