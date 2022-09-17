#!/usr/bin/env python
from pathlib import Path
from typing import Any, Dict

from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class FileIdHandler(ExternalApiHandlerTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "file_id"

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

        raw_response = self.run_read_query(
            file_path=self.sql_path / self.platform.value / "file_id_base_query.sql",
            query_params={
                "file_id": self.file_id,
                "domains": tuple(self.configs.domains),
                "platform": self.platform.value,
            },
        )
        self.logger.json(raw_response, name="raw-file-id-response")
        if not raw_response:
            return {}

        return self.get_file_record(raw_response[0])


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return FileIdHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_file_id.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "file-id"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
