from pathlib import Path
from typing import Any, Dict, List

from tools.catalogs import Platform
from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class AuthorizedAppIdEventsHandler(
    ExternalApiHandlerTemplate,
    orderable_by={"datetime"},
):
    name = __name__
    event: LambdaEvent
    sql_path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "authorized_app_id_events"

    def get_events_by_platform(self, platform: Platform) -> List[Dict[str, Any]]:
        """Select and run base queries by platform.

        Arguments:
            platform -- Platform

        Returns:
            List of Application related `Events`
        """
        query_file_path = self.sql_path / platform.value / "authorized_app_events_base_query.sql"
        count_file_path = self.sql_path / platform.value / "app_events_count_query.sql"

        query_params = {
            "offset": (self.page_number - 1) * self.page_size,
            "limit": self.page_size,
            "platform": platform.value,
            "app_id": self.app_id,
            "event_category": self.event_category,
        }

        query_fragments = {
            "order": self.order_by,
            "sort": self.sort,
            "event_category": self.event_category,
        }

        query_string = self.render_jinja_template(
            file_path=self.sql_path / query_file_path,
            query_fragments=query_fragments,
        )
        count_query_string = self.render_jinja_template(
            file_path=self.sql_path / count_file_path,
            query_fragments=query_fragments,
        )
        event_response = self.run_read_query(
            query_string=query_string,
            query_params=query_params,
            count_query_string=count_query_string,
            response_mapper=self.get_event_record,
        )

        return event_response

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get files details

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict with a list of files and file metadata.
        """
        if not self.app_id:
            raise BadRequest("NoneType application ID path parameter")

        if not self.platform_is_supported(self.platform):
            return {}

        event_count = 0
        for platform in self.platforms:
            if self.platform_is_supported(platform):
                self._query_response.extend(self.get_events_by_platform(platform))
                event_count += self._query_stats.get("found_rows", 0)
                self._query_stats = {}

        self._page_count = event_count // self.page_size
        return {
            "events": self._query_response,
            "eventType": self.event_category,
            "_eventName": self.event_category,
            "orderBy": self.order_by,
            "pageCount": self.page_count,
            "pageCountCacheTTL": self.page_count_cache_ttl,
            "pageCountLastUpdated": self.page_count_last_updated,
            "pageNumber": self.page_number,
            "pageSize": self.page_size,
            "platformIds": [plt.value for plt in self.platforms],
            "sort": self.sort,
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return AuthorizedAppIdEventsHandler(enable_sentry=True, raise_errors=False).handle(
        event, context
    )


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = "authorized-app-id-events"
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_authorized_app_id.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
