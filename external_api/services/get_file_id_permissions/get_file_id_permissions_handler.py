#!/usr/bin/env python
from pathlib import Path
from typing import Any, Dict

from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.constants import RISK_ACTIVE_STATUS
from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class GetFileIdPermissionsHandler(
    ExternalApiHandlerTemplate,
    orderable_by={"permissions_emailaddress", "permissions_id"},
):
    name = __name__
    event: LambdaEvent

    @property
    def job_name(self) -> str:
        return "get_file_permissions"

    @property
    def sql_path(self) -> Path:
        return Path(__file__).resolve().parent / "sql" / self.platform.value

    def build_permission(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Build Permission response.

        Arguments:
            results -- raw permission results

        Returns:
            `Permission` response object.
        """
        if not results["shared_meta"]:
            shared = None
        elif results["shared_meta"] in self.configs.domains:
            shared = "internal"
        else:
            shared = "external"

        return {
            "permissionId": results["permissions_id"],
            "platformId": results["platform"],
            "platformName": results["platform_name"],
            "type": results["type"],
            "permissionEmailAddress": results["permissions_emailaddress"],
            "role": "read" if results["permissions_role"] == "reader" else "write",
            "discoverable": bool(results["discoverable"]),
            "shared": shared,
        }

    def _validate_event(self) -> None:
        if not self.file_id:
            raise BadRequest("fileId path parameter is missing")

        if not self.event.get_query_parameter("order-by"):
            self._order_by = "permissions_id"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get permissions by file Id

        Arguments:
            event - LambdaEvent body
        Returns:
            A LambdaResponseData object.
        """
        self._validate_event()

        final_query = self.render_jinja_template(
            file_path=self.sql_path / "file_id_permissions_query.sql",
            query_fragments={
                "order": self.order_by,
                "sort": self.sort,
            },
        )
        count_query = self.render_jinja_template(
            file_path=self.sql_path / "file_permissions_count.sql", query_fragments={}
        )

        query_params = {
            "file_id": self.file_id,
            "platform": self.platform.value,
            "active": RISK_ACTIVE_STATUS,
            "offset": (self.page_number - 1) * self.page_size,
            "limit": self.page_size,
        }
        permissions = self.run_read_query(
            query_string=final_query,
            count_query_string=count_query,
            query_params=query_params,
            response_mapper=self.build_permission,
        )

        return {
            "permissions": permissions,
            "permissionsCount": self.query_stats["found_rows"],
            "pageCount": self.page_count,
            "pageCountCacheTTL": self.page_count_cache_ttl,
            "pageCountLastUpdated": self.page_count_last_updated,
            "pageNumber": self.page_number,
            "pageSize": self.page_size,
            "platformId": self.platform.value,
            "orderBy": self.order_by,
            "sort": self.sort,
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return GetFileIdPermissionsHandler(enable_sentry=True, raise_errors=False).handle(
        event, context
    )


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = ""
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_file_id_permissions.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
