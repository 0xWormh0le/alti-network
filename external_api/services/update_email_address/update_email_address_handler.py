#!/usr/bin/env python
from pathlib import Path
from typing import Any, Dict

from tools import json_tools
from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.sqs_connect import SqsConnect
from tools.sqs_resource import SqsResource

from external_api.utils.constants import (
    EMAIL_ACTIVE_STATUS,
    EMAIL_PENDING_STATUS,
    EMAIL_REMOVE_STATUS,
    UPDATE_EMAIL_QUEUE,
)
from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate

EMAIL_STATUSES = [EMAIL_PENDING_STATUS, EMAIL_REMOVE_STATUS]


class UpdateEmailAddressHandler(ExternalApiHandlerTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"
    event: LambdaEvent

    @property
    def job_name(self) -> str:
        return "update_email_address"

    @staticmethod
    def is_valid_email_status(status: str) -> bool:
        return status in EMAIL_STATUSES

    def retrigger_sqs_queue(
        self, email: str, new_status: str, msg_delay: int = 60
    ) -> Dict[str, Any]:
        """
        Sends an SQS message to `update_email` queue, which is
        the queue that triggers this same lambda function.
        The goal from sending a message back to `update_email`
        queue is to retrigger this lambda after `msg_delay` time elapsed.

        Arguments:
            email       -- email address
            msg_delay   -- message delay

        Returns:
            `SQSResponse` object
        """
        sqs_connect = SqsConnect()
        sqs_resource = SqsResource(self.configs.project_name)

        email_q_url = sqs_resource.get_q_url(f"{UPDATE_EMAIL_QUEUE}-{self.configs.suffix}")
        update_email_resp = sqs_connect.send_msg(
            queue_url=email_q_url,
            msg_body=json_tools.dumps(
                {
                    "project_id": self.configs.project_name,
                    "email": email,
                    "action": "update_status",
                    "new_status": new_status,
                }
            ),
            delay_seconds=msg_delay,
        )
        self.logger.json(update_email_resp, name="email_delete_response")

        return update_email_resp

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Update Risk ID status on Risks table

        Arguments:
            event - LambdaEvent body

        Returns:
            A response dict from SQS.
        """
        email = self.event.body.get("email")
        new_status = self.event.body.get("new_status", "")
        response: Any = None

        if not email:
            raise BadRequest("You must provide a valid email address")

        if not self.is_valid_email_status(new_status):
            raise BadRequest(f"new_status must be one of {EMAIL_STATUSES}")

        if new_status == EMAIL_PENDING_STATUS:
            response = self.run_write_query(
                table_name="email_identification",
                file_path=self.sql_path / "update_email_query.sql",
                query_params={"email": email, "new_status": new_status},
            )
        elif new_status == EMAIL_REMOVE_STATUS:
            active_risks = self.run_read_query(
                file_path=self.sql_path / "get_pending_permissions.sql",
                query_params={
                    "email": email,
                    "active": EMAIL_ACTIVE_STATUS,
                    "pending": EMAIL_PENDING_STATUS,
                },
            )
            if not active_risks:
                response = self.run_write_query(
                    table_name="email_identification",
                    file_path=self.sql_path / "update_email_query.sql",
                    query_params={"email": email, "new_status": new_status},
                )
                self.logger.json(response, name="email identification status")

                response = self.run_write_query(
                    table_name="admin_directory_v1_usersmeta",
                    file_path=self.sql_path / "update_usersmeta_status.sql",
                    query_params={"email": email, "new_status": new_status},
                )
                self.logger.json(response, name="admin directory status")
            else:
                response = self.retrigger_sqs_queue(
                    email=email, new_status=new_status, msg_delay=60
                )

        return response


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return UpdateEmailAddressHandler(enable_sentry=True, raise_errors=True).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = ""
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_update_email_address.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
