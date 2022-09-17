import math
from collections import defaultdict
from pathlib import Path
from typing import Any, Dict, List, Optional

from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.sqs_resource import SqsResource

from external_api.exceptions import BadRequest, UnauthorizedError
from external_api.utils.api_scopes_helper import ApiScopesHelper
from external_api.utils.constants import (
    DELETE_ORCH_QUEUE,
    EMAIL_ACTIVE_STATUS,
    EMAIL_PENDING_STATUS,
    EMAIL_REMOVE_STATUS,
    UPDATE_EMAIL_QUEUE,
)
from external_api.utils.external_api_handler_template import (
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)


class DeletePermissionsByEmailHandler(ExternalApiHandlerTemplate):
    name = __name__
    GET_PERMISSIONS_BY_EMAIL_QUERY = "get_permissions_by_email_query.sql"
    MAX_PERMISSION_SIZE = 1000

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"
        self._api_scopes_helper: Optional[ApiScopesHelper] = None
        self.sqs_resource = SqsResource(self.configs.project_name)

    @property
    def job_name(self) -> str:
        return "delete_permissions_by_email"

    @property
    def api_scopes_helper(self) -> ApiScopesHelper:
        if self._api_scopes_helper:
            return self._api_scopes_helper

        self._api_scopes_helper = ApiScopesHelper(configs=self.configs)
        return self._api_scopes_helper

    def send_message_to_update_email(self, email_status: str) -> None:
        """Sends message to `update_email_address` service.
        Args:
            email_status: Email status to be set.
        Returns:
            None.
        """
        update_email_q_url = self.sqs_resource.get_q_url(
            f"{UPDATE_EMAIL_QUEUE}-{self.configs.suffix}"
        )
        self.sqs_connect.send_msg(
            queue_url=update_email_q_url,
            msg_body=json_tools.dumps(
                {
                    "project_id": self.configs.project_name,
                    "email": self.email,
                    "action": "update_status",
                    "new_status": email_status,
                }
            ),
        )

    def send_message_to_permission_orch(
        self, platform: Platform, permission_details: List[Dict[str, Any]]
    ) -> None:
        """Send message to delete permissions orchestrator.
        Args:
            permission_ids: List of of permissions ids.
            platform: Platform enum.
        Returns:
        """
        delete_orch_q_url = self.sqs_resource.get_q_url(
            f"{DELETE_ORCH_QUEUE}-{self.configs.suffix}"
        )

        message_count = math.ceil(len(permission_details) / self.MAX_PERMISSION_SIZE)
        for i in range(message_count):
            self.sqs_connect.send_msg(
                queue_url=delete_orch_q_url,
                msg_body=json_tools.dumps(
                    {
                        "project_id": self.configs.project_name,
                        "permission_details_list": (
                            permission_details[
                                i * self.MAX_PERMISSION_SIZE : (i + 1) * self.MAX_PERMISSION_SIZE
                            ]
                        ),
                        "email": self.email,
                        "message_number": i + 1,
                        "message_count": message_count,
                        "platform": platform.value,
                    }
                ),
            )

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Remove permission id by email

        Arguments:
            event - LambdaEvent body
        Returns:
            A `LambdaResponse` object
        """
        if not self.email:
            raise BadRequest("email is a required string parameter")

        if not self.api_scopes_helper.has_valid_permission_scopes():
            raise UnauthorizedError("The customer has not granted Altitude 'drive' scope.")

        permissions_queue_for_deletion: defaultdict = defaultdict(list)
        for platform in self.platforms:
            permission_details = self.run_read_query(
                file_path=self.sql_path / platform.value / self.GET_PERMISSIONS_BY_EMAIL_QUERY,
                query_params={"email": self.email, "active": EMAIL_ACTIVE_STATUS},
            )
            email_status = EMAIL_REMOVE_STATUS
            if permission_details:
                email_status = EMAIL_PENDING_STATUS
                self.send_message_to_permission_orch(platform, permission_details)
                permissions_queue_for_deletion[platform.value] = permission_details

            if platform == Platform.GSUITE:
                # Legacy call to track permissions, status only applies for GSUITE
                self.send_message_to_update_email(email_status)

            self.generate_emf_logs(
                endpoint_name=self.job_name,
                user_id=self.email or "",
                metric_name=CloudWatchMetric.DELETE_PERMISSION_COUNT,
                metric_value=len(permission_details),
            )

        return {
            "count_of_permissions_removed": sum(
                [len(permissions) for permissions in permissions_queue_for_deletion.values()]
            ),
            "message": (
                "Permissions queued for deletion"
                if permissions_queue_for_deletion
                else "No permission id for email provided were found"
            ),
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return DeletePermissionsByEmailHandler(enable_sentry=True, raise_errors=False).handle(
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
