#!/usr/bin/env python
from pathlib import Path
from typing import Any, Dict

from tools import json_tools
from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.sqs_connect import SqsConnect
from tools.sqs_resource import SqsResource

from external_api.utils.constants import RISK_PENDING_STATUS, RISK_REMOVE_STATUS, RISK_STATUS_QUEUE
from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate

RISK_STATUSES = [RISK_PENDING_STATUS, RISK_REMOVE_STATUS]


class UpdateRiskStatusHandler(ExternalApiHandlerTemplate):
    name = __name__
    event: LambdaEvent
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "update_risk_status"

    @staticmethod
    def is_valid_risk_status(status: str) -> bool:
        return status in RISK_STATUSES

    def retrigger_sqs_queue(
        self, risk_id: str, new_status: str, msg_delay: int = 60
    ) -> Dict[str, Any]:
        """
        Sends an SQS message to `update-risk-status` queue, which is
        the queue that triggers this same lambda function.
        The goal from sending a message back to `update-risk-status`
        queue is to retrigger this lambda after `msg_delay` time elapsed.

        Arguments:
            risk_id     -- risk Id
            msg_delay   -- message delay

        Returns:
            `SQSResponse` object.
        """
        sqs_connect = SqsConnect()
        sqs_resource = SqsResource(self.configs.project_name)

        risk_q_url = sqs_resource.get_q_url(f"{RISK_STATUS_QUEUE}-{self.configs.suffix}")
        update_risk_status_resp = sqs_connect.send_msg(
            queue_url=risk_q_url,
            msg_body=json_tools.dumps(
                {
                    "project_id": self.configs.project_name,
                    "risk_id": risk_id,
                    "action": "update_status",
                    "new_status": new_status,
                }
            ),
            delay_seconds=msg_delay,
        )
        self.logger.json(update_risk_status_resp, name="update_risk_status_resp")

        return update_risk_status_resp

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Update Risk ID status on Top Risks table

        Arguments:
            event - LambdaEvent body

        Returns:
            A LambdaResponseData object
        """
        risk_id = self.event.body.get("risk_id")
        new_status = self.event.body.get("new_status", "")
        response: Any = None

        if not risk_id:
            raise ValueError("You must provide a valid risk_id")

        if not self.is_valid_risk_status(new_status):
            raise ValueError(f"new_status must be one of {RISK_STATUSES}")

        if new_status == RISK_PENDING_STATUS:
            response = self.run_write_query(
                table_name="top_risks",
                file_path=self.sql_path / "update_status_query.sql",
                query_params={"risk_id": risk_id, "new_status": new_status},
            )
        elif new_status == RISK_REMOVE_STATUS:
            active_risks = self.run_read_query(
                file_path=self.sql_path / "get_pending_permissions.sql",
                query_params={"risk_id": risk_id},
            )
            if not active_risks:
                response = self.run_write_query(
                    table_name="top_risks",
                    file_path=self.sql_path / "update_status_query.sql",
                    query_params={"risk_id": risk_id, "new_status": new_status},
                )
            else:
                response = self.retrigger_sqs_queue(
                    risk_id=risk_id, new_status=new_status, msg_delay=60
                )

        return response


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return UpdateRiskStatusHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = ""
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_update_risk_status.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
