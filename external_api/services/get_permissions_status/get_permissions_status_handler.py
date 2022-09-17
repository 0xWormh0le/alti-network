from pathlib import Path
from typing import Any, Dict, List

from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.constants import (
    RISK_ACTIVE_STATUS,
    RISK_ERROR_STATUS,
    RISK_PENDING_STATUS,
    RISK_REMOVE_STATUS,
)
from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class GetPermissionsStatusHandler(ExternalApiHandlerTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "get_permissions_status"

    @staticmethod
    def get_count_by_status_key(results: List[Dict[str, int]], status_key: str) -> int:
        """
        Gets the count result for a permission status key

        Arguments:
            results     -- raw mysql Query results
            status_key  -- risk status name

        Returns:
            status count
        """
        status_count = 0
        for item in results:
            if item.get("status") == status_key:
                status_count += item.get("total_count", 0)
            if status_key == RISK_ACTIVE_STATUS and not item.get("status"):
                status_count += item.get("total_count", 0)

        return status_count

    def deleted_recently(self, email: str) -> bool:
        """
        Verifies if permissions were recently deleted for this email.

        Returns:
            boolean
        """
        raw_result = self.run_read_query(
            file_path=self.sql_path / self.platform.value / "last_email_deleted_query.sql",
            query_params={"email": email},
        )

        response = raw_result[0]["deleted"] if raw_result else False
        return bool(response)

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get permission status response

        Arguments:
            event - LambdaEvent body
        Returns:
            A `LambdaResponse` object
        """
        if not self.platform_is_supported(self.platform):
            return {}

        results = []
        # fetch all permissions statuses
        if self.email and self.deleted_recently(self.email):
            # Note: If an email was passed to the API endpoint connected to this lambda,
            # we check the permissions_last_deleted column in the email_identification
            # table to see if this email was removed in the last 24 hours.
            # If the email was last removed in the last 24 hours
            # (as indicated by the permissions_last_deleted timestamp)
            # it returns the permissions status for this email.
            # If the email was last removed more than 24 hours ago, we no longer care
            # about the status of the last deletion,
            # and return 0's for all counts in the status response.
            results = self.run_read_query(
                file_path=self.sql_path
                / self.platform.value
                / "permissions_status_by_email_query.sql",
                query_params={"email": self.email},
            )
        elif self.risk_id:
            # Note: If a risk_id was passed to the API endpoint connected to this service,
            # we check if this risk_id is active in the top_risks table. If the risk_id
            # is active then we longer care about the status of this risk, then return 0's
            # otherwise return the status of this risk.
            results = self.run_read_query(
                file_path=self.sql_path
                / self.platform.value
                / "permissions_status_by_risk_query.sql",
                query_params={"risk_id": self.risk_id},
            )

        self.logger.json(results, name="permssions_status")
        return {
            "active": self.get_count_by_status_key(results, RISK_ACTIVE_STATUS),
            "completed": self.get_count_by_status_key(results, RISK_REMOVE_STATUS),
            "failed": self.get_count_by_status_key(results, RISK_ERROR_STATUS),
            "pending": self.get_count_by_status_key(results, RISK_PENDING_STATUS),
            "totalCount": sum([item.get("total_count", 0) for item in results]),
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return GetPermissionsStatusHandler(enable_sentry=True, raise_errors=False).handle(
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
        resources.read_text(payloads, "test_event_get_permissions_status.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
