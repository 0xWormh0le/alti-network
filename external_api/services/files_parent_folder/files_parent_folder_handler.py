from pathlib import Path
from typing import Any, Dict

from tools.catalogs import Platform
from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class FilesParentFolderHandler(
    ExternalApiHandlerTemplate,
    orderable_by={"name", "datetime"},
):
    name = __name__
    event: LambdaEvent

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "files_parent_folder"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get File names associated with a Folder Id.

        Arguments:
            event - LambdaEvent body

        Returns:
            A list of files
        """
        if not self.parent_id:
            raise BadRequest("Invalid ParentId path parameter")

        if not self.platform_is_supported(self.platform):
            return {}

        count_query = ""
        if self.platform == Platform.GSUITE:
            count_query = f"""
            SELECT
                COUNT(DISTINCT file_id) AS found_rows
            FROM {GoogleTableNames.FILESMETA.value}
            WHERE parents_list = %(parent_id)s
            """

        if self.platform == Platform.O365:
            count_query = f"""
            SELECT
                COUNT(DISTINCT ms_id) AS found_rows
            FROM {MicrosoftTableNames.MS_DRIVES_DOCS.value}
            WHERE parent_id = %(parent_id)s
            """

        file_parent_query = self.render_jinja_template(
            file_path=self.sql_path / self.platform.value / "file_parent_base_query.sql",
            query_fragments={
                "order": "file_name" if self.order_by == "name" else "last_modified",
                "sort": self.sort,
            },
        )

        files_result = self.run_read_query(
            query_string=file_parent_query,
            count_query_string=count_query,
            query_params={
                "parent_id": self.parent_id,
                "platform": self.platform.value,
                "offset": (self.page_number - 1) * self.page_size,
                "limit": self.page_size,
            },
            response_mapper=self.get_file_record,
        )

        return {
            "files": files_result,
            "pageCount": self.page_count,
            "pageCountCacheTTL": self.page_count_cache_ttl,
            "pageCountLastUpdated": self.page_count_last_updated,
            "pageNumber": self.page_number,
            "pageSize": self.page_size,
            "parentId": self.parent_id,
            "platformId": self.platform.value,
            "sort": self.sort,
            "orderBy": self.order_by,
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return FilesParentFolderHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_files_parent_folder.json")
    )
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "files-parent-folder"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
