import os
from pathlib import Path
from typing import Any, Dict, Optional

from tools import json_tools
from tools.gsuite.permissions_connector import PermissionsConnector
from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.sqs_connect import SqsConnect
from tools.sqs_resource import SqsResource

from external_api.exceptions import (
    BadRequest,
    ForbiddenError,
    InternalServerError,
    NotFoundError,
    UnauthorizedError,
)
from external_api.utils.api_scopes_helper import ApiScopesHelper
from external_api.utils.constants import INGESTION_QUEUE, RISK_ERROR_STATUS, RISK_REMOVE_STATUS
from external_api.utils.external_api_handler_template import (
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)

GSUITE_FILE_NOT_FOUND_ERROR_MSG = "Permission not found:"
GSUITE_SUCCESS_MSG = "Permission delete success"


class DeletePermissionIdHandler(ExternalApiHandlerTemplate):
    name = __name__

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self._permissions_connector: Optional[PermissionsConnector] = None
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"
        self.error_msg: Optional[Exception] = None
        self._api_scopes_helper: Optional[ApiScopesHelper] = None

    @property
    def job_name(self) -> str:
        return "delete_permission_id"

    @property
    def api_scopes_helper(self) -> ApiScopesHelper:
        if self._api_scopes_helper:
            return self._api_scopes_helper

        self._api_scopes_helper = ApiScopesHelper(configs=self.configs)
        return self._api_scopes_helper

    def get_permissions_connector(self, service_email: str) -> PermissionsConnector:
        self._permissions_connector = PermissionsConnector(
            configs=self.configs, service_email=service_email
        )

        return self._permissions_connector

    @staticmethod
    def get_lambda_event_error(error: Dict[str, Any]) -> Any:
        """
        Handle GSuite Exception and return proper frontend response

        Arguments:
            error -- Exception

        Returns
            `LambdaEventError`
        """
        try:
            error_code = error["code"]
            error_message = error["message"]
        except (IndexError, ValueError, KeyError):
            return InternalServerError(error)

        if error_code == 404:
            return NotFoundError(error_message)
        if error_code == 401:
            return UnauthorizedError(error_message)
        if error_code == 403:
            return ForbiddenError(error_message)
        if error_code == 500:
            return InternalServerError(error_message)

        return InternalServerError(error_message)

    def send_msg_to_ingestion_queue(
        self, msg_body: Dict[str, Any], msg_delay: int = 30
    ) -> Dict[str, Any]:
        """
        Send SQS message

        Arguments:
            msg_body -- sqs message body

        Returns:
            `SQSResponse` object.
        """
        sqs_connect = SqsConnect()
        sqs_resource = SqsResource(self.configs.project_name)
        suffix = os.environ["SUFFIX"]

        # update ingestion queue info
        ingestion_q_url = sqs_resource.get_q_url(f"{INGESTION_QUEUE}-{suffix}")

        # send message to ingestion queue
        sqs_resp = sqs_connect.send_msg(
            queue_url=ingestion_q_url, msg_body=json_tools.dumps(msg_body), delay_seconds=msg_delay
        )
        self.logger.json(sqs_resp, name="sqs_response")

        return sqs_resp

    def _delete_permission(self, service_email: str) -> Dict[str, Any]:
        ok_response = {"status_code": 200}
        error = {}
        if not self.file_id:
            raise BadRequest("Invalid file-id parameter")

        if not self.permission_id:
            raise BadRequest("Invalid permission-id parameter")

        try:
            response = self.get_permissions_connector(service_email).delete_permission(
                file_id=self.file_id or "", permission_id=self.permission_id or ""
            )
            self.generate_emf_logs(
                endpoint_name=self.job_name,
                user_id=service_email,
                metric_name=CloudWatchMetric.DELETE_PERMISSION_COUNT,
                metric_value=1,
            )
            self.logger.json(response, name="perm delete response")
        except Exception as e:
            self.logger.error(f"{e}")
            if len(e.args) < 2:
                error = vars(InternalServerError(f"Unexpected error: {e}"))
            if "error" not in json_tools.loads(e.args[1]):
                error = vars(InternalServerError(f"Unexpected error: {e}"))
            else:
                error = json_tools.loads(e.args[1])["error"]

        response = ok_response if not error else error
        return response

    def delete_permission(self, service_email: str, owner_email: str) -> Dict[str, Any]:
        """
        Call GSuite API and delete permission id and send sqs message

        Arguments:
            file_id         -- file id
            permission_id   -- Permission Id
            service_email   -- service email for GSuite
        Returns:
            API response dict
        Raises:
            HttpError -- If errors occurs on GSuite api
        """
        response = self._delete_permission(service_email)
        if response.get("code") == 404 and GSUITE_FILE_NOT_FOUND_ERROR_MSG not in response.get(
            "message", ""
        ):
            response = self._delete_permission(owner_email)

        if response.get("status_code") == 200:
            return response

        self.error_msg = self.get_lambda_event_error(response)
        return vars(self.error_msg)

    def update_permission_status(self, status: str) -> None:
        """
        Update permission status for unresolved permissions

        Arguments:
            permission_id   -- Permission Id

        Returns:
            None
        """
        update_response = self.run_write_query(
            table_name="drive_v3_filesmeta",
            file_path=self.sql_path / "update_permissions_query.sql",
            query_params={
                "permission_id": self.permission_id,
                "file_id": self.file_id,
                "status": status,
            },
        )
        self.logger.json(update_response, name="sql response for permission update")

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Delete Permission Id

        Arguments:
            event - LambdaEvent body
        Returns:
            A response dict from SQS.
        """
        if self.permission_id and self.file_id:
            # Handles a direct call from APIGW.
            file_info = self.run_read_query(
                file_path=self.sql_path / "get_file_owner_info_query.sql",
                query_params={"file_id": self.file_id},
            )
            owner_email = file_info[0]["owner_email"]
        else:
            # Handles a message from SQS.
            permission_details = event.body.get("permission_details", {})
            self._permission_id = permission_details.get("permissions_id", "")
            self._file_id = permission_details.get("file_id", "")
            owner_email = permission_details.get("owner_email", "")

        # delete file permission
        if (  # pylint: disable=no-else-raise
            not self.api_scopes_helper.has_valid_permission_scopes()
        ):
            self.update_permission_status(status=RISK_ERROR_STATUS)
            raise UnauthorizedError("The customer has not granted Altitude 'drive' scope.")
        else:
            res = self.delete_permission(
                service_email=self.configs.gs_admin_user_email,
                owner_email=owner_email,
            )
            self.logger.json(res, name="res")

        if res.get("status_code") == 200:
            res["message"] = GSUITE_SUCCESS_MSG
            msg_body = {
                "project_id": self.configs.project_name,
                "job_name": "drive_v3_file_details",
                "file_id": [self.file_id],
                "uid": [owner_email],
            }
            self.send_msg_to_ingestion_queue(msg_body=msg_body, msg_delay=30)
            self.update_permission_status(status=RISK_REMOVE_STATUS)
        else:
            self.update_permission_status(status=RISK_ERROR_STATUS)
            raise self.error_msg  # type: ignore

        return res


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return DeletePermissionIdHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = ""
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_delete_permission_id.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
