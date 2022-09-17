from pathlib import Path
from typing import Any, Dict

from flavius_client_sdk.model.folder_model import FolderModel
from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import (
    BadRequest,
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)


class FolderIdHandler(ExternalApiHandlerTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "folder_id"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Fetch Folder information

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict with folder metadata.
        """
        if not self.folder_id:
            raise BadRequest("Invalid FolderId path parameter")

        if not self.platform_is_supported(self.platform):
            return {}

        raw_response = self.run_read_query(
            file_path=self.sql_path / self.platform.value / "folder_id_base_query.sql",
            query_params={"folder_id": self.folder_id, "platform": self.platform.value},
        )

        if not raw_response:
            return {}

        raw_folder_response = raw_response[0]
        raw_folder_response["parent_folder"] = {
            "folder_id": raw_folder_response.get("parent_folder_id") or "",
            "folder_name": raw_folder_response.get("parent_folder_name") or "",
        }
        folder_response = FolderModel(**raw_folder_response).to_dict(serialize=True)

        # Add EMF log for missing root drive metadata in SQL
        # TODO: https://altitudenetworks.atlassian.net/browse/API-228
        if folder_response and not folder_response["folderName"]:
            self.generate_emf_logs(
                endpoint_name=CloudWatchMetric.MISSING_ROOT_DRIVE_INFO.value,
                user_id=f"{self.folder_id}",
                metric_name=CloudWatchMetric.DATABASE_ERROR,
                metric_value=1,
            )

        return folder_response


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return FolderIdHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_folder_id.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "folder-id"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
