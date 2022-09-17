import math
from pathlib import Path
from typing import Any, Dict, List, Optional

from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.sqs_connect import SqsConnect
from tools.sqs_resource import SqsResource

from external_api.exceptions import BadRequest, NotFoundError, UnauthorizedError
from external_api.utils.api_scopes_helper import ApiScopesHelper
from external_api.utils.constants import DELETE_ORCH_QUEUE, MAX_PERMISSION_SIZE, RISK_ERROR_STATUS
from external_api.utils.external_api_handler_template import (
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)


class DeletePermissionsByRiskIdHandler(ExternalApiHandlerTemplate):
    name = __name__
    GET_PERMISSIONS_BY_RISK_ID = "get_permissions_by_risk_id.sql"

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"
        self._api_scopes_helper: Optional[ApiScopesHelper] = None
        self.sqs_conn = SqsConnect()
        self.action_resources = SqsResource(self.configs.project_name)

    @property
    def job_name(self) -> str:
        return "delete_permissions_by_risk_id"

    @property
    def api_scopes_helper(self) -> ApiScopesHelper:
        if self._api_scopes_helper:
            return self._api_scopes_helper

        self._api_scopes_helper = ApiScopesHelper(configs=self.configs)
        return self._api_scopes_helper

    def send_sqs_message(
        self,
        platform: Platform,
        permissions_details: List[Dict[str, Any]],
    ) -> None:
        """Sends message to delete permissions orchestrator.
        Arguments:
            permissions_details -- permission id list
            risk_id -- risk id
            platform -- platform enum.
        Returns:
            None
        """
        delete_orch_q_url = self.action_resources.get_q_url(
            f"{DELETE_ORCH_QUEUE}-{self.configs.suffix}"
        )
        message_count = math.ceil(len(permissions_details) / MAX_PERMISSION_SIZE)
        for i in range(message_count):
            self.sqs_conn.send_msg(
                queue_url=delete_orch_q_url,
                msg_body=json_tools.dumps(
                    {
                        "project_id": self.configs.project_name,
                        "permission_details_list": permissions_details[
                            i * MAX_PERMISSION_SIZE : (i + 1) * MAX_PERMISSION_SIZE
                        ],
                        "risk_id": self.risk_id,
                        "message_number": i + 1,
                        "message_count": message_count,
                        "platform": platform.value,
                    }
                ),
            )

    def get_platform(self, risk_id: str) -> Platform:
        """Gets platform from given Risk ID.
        Args:
            risk_id: Risk unique identifier.
        Returns:
            Platform enum.
        """
        platform = self.run_read_query(
            file_path=self.sql_path / "get_platform.sql", query_params={"risk_id": risk_id}
        )
        if not platform:
            raise NotFoundError(f"Risk ID: {self.risk_id} is not existing.")

        return Platform(platform[0]["symbolic_name"])

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        if not self.risk_id:
            raise BadRequest("Path Parameter: riskId  is required")

        platform = self.get_platform(self.risk_id)

        if not self.api_scopes_helper.has_valid_permission_scopes():
            raise UnauthorizedError("The customer has not granted Altitude 'drive' scope.")

        permissions_details = self.run_read_query(
            file_path=self.sql_path / platform.value / self.GET_PERMISSIONS_BY_RISK_ID,
            query_params={
                "risk_id": self.risk_id,
                "file_id": self.file_id,
                "status": RISK_ERROR_STATUS,
            },
        )

        self.send_sqs_message(platform, permissions_details)

        self.generate_emf_logs(
            endpoint_name=self.job_name,
            user_id=self.risk_id or "",
            metric_name=CloudWatchMetric.DELETE_PERMISSION_COUNT,
            metric_value=len(permissions_details),
        )

        return {
            "count_of_permissions_removed": len(permissions_details),
            "message": (
                "Permissions queued for deletion"
                if permissions_details
                else f"No permission id for risk id: {self.risk_id} were found"
            ),
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return DeletePermissionsByRiskIdHandler(enable_sentry=True, raise_errors=False).handle(
        event, context
    )


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = ""
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_permissions.json"))
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
