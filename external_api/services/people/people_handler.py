from pathlib import Path
from typing import Any, Dict

from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class PeopleHandler(ExternalApiHandlerTemplate):
    name = __name__
    event: LambdaEvent
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "people"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Fetch People response
        """
        if not self.platform_is_supported(self.platform):
            return {}

        query_fragments = {
            "domain": self.domain,
            "sort": self.sort,
            "offset": (self.page_number - 1) * self.page_size,
            "limit": self.page_size,
        }
        query_params = {
            "app_id": self.app_id,
            "file_id": self.file_id,
            "platform": self.platform.value,
            "risk_id": self.risk_id,
            "domains": tuple(self.configs.domains),
        }

        raw_response = None
        if not event.get("queryStringParameters"):
            people = [
                self.get_user_record(platform=self.platform.value, email=row["user_email"])
                for row in self.users_manager.list()
            ]
            return {
                "people": people,
                "pageCount": self.page_count,
                "pageCountCacheTTL": self.page_count_cache_ttl,
                "pageCountLastUpdated": self.page_count_last_updated,
                "pageNumber": self.page_number,
                "pageSize": self.page_size,
                "platformId": self.platform.value,
                "domain": self.domain,
                "applicationId": self.app_id,
                "riskId": self.risk_id,
                "sort": self.sort,
            }

        if self.app_id:
            query_string = self.render_jinja_template(
                file_path=self.sql_path / self.platform.value / "people_by_app_id_query.sql",
                query_fragments=query_fragments,
            )
            count_query = self.render_jinja_template(
                file_path=self.sql_path / self.platform.value / "people_by_app_id_count_query.sql",
                query_fragments=query_fragments,
            )
        elif self.file_id:
            query_string = self.render_jinja_template(
                file_path=self.sql_path / self.platform.value / "people_by_file_id_query.sql",
                query_fragments=query_fragments,
            )
            count_query = self.render_jinja_template(
                file_path=self.sql_path / self.platform.value / "people_by_file_id_count_query.sql",
                query_fragments=query_fragments,
            )
        else:
            query_string = self.render_jinja_template(
                file_path=self.sql_path / self.platform.value / "people_base_query.sql",
                query_fragments=query_fragments,
            )
            count_query = self.render_jinja_template(
                file_path=self.sql_path / self.platform.value / "people_base_count_query.sql",
                query_fragments=query_fragments,
            )

        # fetches list of incomplete user information from SQL
        raw_response = self.run_read_query(
            query_string=query_string,
            count_query_string=count_query,
            query_params=query_params,
        )

        people = [
            self.get_user_record(platform=self.platform.value, email=row["user_email"])
            for row in raw_response
        ]
        return {
            "people": people,
            "pageCount": self.page_count,
            "pageCountCacheTTL": self.page_count_cache_ttl,
            "pageCountLastUpdated": self.page_count_last_updated,
            "pageNumber": self.page_number,
            "pageSize": self.page_size,
            "platformId": self.platform.value,
            "domain": self.domain,
            "applicationId": self.app_id,
            "riskId": self.risk_id,
            "sort": self.sort,
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return PeopleHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_people.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "people"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
