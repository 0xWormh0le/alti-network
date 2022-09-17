from pathlib import Path
from typing import Any, Dict

from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.exceptions import BadRequest
from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class FileIdEventsHandler(
    ExternalApiHandlerTemplate,
    orderable_by={"datetime"},
):
    name = __name__

    @property
    def job_name(self) -> str:
        return "file_id_events"

    @property
    def sql_path(self) -> Path:
        return Path(__file__).resolve().parent / "sql" / self.platform.value

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get files details

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict with a list of files and file metadata.
        """
        if not self.file_id:
            raise BadRequest("Invalid FileId path parameter")

        if not self.platform_is_supported(self.platform):
            return {}

        # run base query
        rendered_query_string = self.render_jinja_template(
            file_path=self.sql_path / "file_id_events_base_query.sql",
            query_fragments={
                "order": self.order_by,
                "sort": self.sort,
            },
        )

        count_query = self.render_jinja_template(
            file_path=self.sql_path / "file_id_events_count_query.sql",
            query_fragments={"order": self.order_by, "sort": self.sort},
        )
        self._query_response = self.run_read_query(
            query_string=rendered_query_string,
            count_query_string=count_query,
            query_params={
                "offset": (self.page_number - 1) * self.page_size,
                "limit": self.page_size,
                "file_id": self.file_id,
                "platform": self.platform.value,
            },
        )

        file_response = [self.get_event_record(row) for row in self._query_response]
        return {
            "events": file_response,
            "orderBy": self.order_by,
            "pageCount": self.page_count,
            "pageCountCacheTTL": self.page_count_cache_ttl,
            "pageCountLastUpdated": self.page_count_last_updated,
            "pageNumber": self.page_number,
            "pageSize": self.page_size,
            "platformId": self.platform.value,
            "sort": self.sort,
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return FileIdEventsHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_file_id_events.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "file-id-events"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
