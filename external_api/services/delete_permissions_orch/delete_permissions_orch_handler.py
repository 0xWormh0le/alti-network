#!/usr/bin/env python

from pathlib import Path
from typing import Any, Dict, List

from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.sqs_resource import SqsResource

from external_api.utils.constants import (
    DELETE_PERM_QUEUE,
    RISK_PENDING_STATUS,
    GoogleTableNames,
    MicrosoftTableNames,
)
from external_api.utils.external_api_handler_template import (
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)


class DeletePermissionsOrchHandler(ExternalApiHandlerTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "delete_permissions_orch"

    def get_permission_table_name(self, platform: Platform) -> str:
        return {
            Platform.GSUITE: GoogleTableNames.FILESMETA.value,
            Platform.O365: MicrosoftTableNames.MS_DRIVES_PERMISSIONS.value,
        }[platform]

    def update_permissions_status(
        self, platform: Platform, permissions_list: List[Dict[str, Any]]
    ) -> None:
        """Updates permissions status to `PENDING` in permissions table.
        Arguments:
            platform: Platform name.
            permissions_list: List containing permissions info.
        Returns:
            None
        """
        self.run_write_query(
            table_name=self.get_permission_table_name(platform),
            file_path=self.sql_path / platform.value / "update_permissions_query.sql",
            query_params={
                "status": RISK_PENDING_STATUS,
                "file_ids": {perm["file_id"] for perm in permissions_list},
                "permission_ids": {perm["permissions_id"] for perm in permissions_list},
            },
        )

    def update_risk_status(self, risk_id: str) -> None:
        """Updates `top_risks` table `status` to `PENDING`.
        Arguments:
            risk_id: Platform name.
        Returns:
            None
        """
        self.run_write_query(
            table_name=GoogleTableNames.TOP_RISKS.value,
            file_path=self.sql_path / "update_risk_status_query.sql",
            query_params={"status": RISK_PENDING_STATUS, "risk_id": risk_id},
        )

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Orchestrate permission deletion

        Arguments:
            event - LambdaEvent body
        Returns:
            A `LambdaResponse` object
        """
        platform = Platform[event.body["platform"].upper()]
        email = event.body.get("email")
        risk_id = event.body.get("risk_id")
        permissions_details = event.body.get("permission_details_list", [])

        sqs_resource = SqsResource(self.configs.project_name)

        if risk_id:
            # risk id is present in event when we are deleting by risk id.
            self.update_risk_status(risk_id)

        self.update_permissions_status(platform, permissions_details)

        for permission_details in permissions_details:
            sqs_resp = self.sqs_connect.send_msg(
                queue_url=sqs_resource.get_q_url(f"{DELETE_PERM_QUEUE}-{self.configs.suffix}"),
                msg_body=json_tools.dumps(
                    {
                        "project_id": self.configs.project_name,
                        "permission_details": permission_details,
                        "platform": platform.value,
                    }
                ),
            )
            self.logger.json(sqs_resp, name="sqs_response")

        self.generate_emf_logs(
            endpoint_name=self.job_name,
            user_id=f"{email}_{risk_id}",
            metric_name=CloudWatchMetric.DELETE_PERMISSION_COUNT,
            metric_value=len(permissions_details),
        )
        return permissions_details


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return DeletePermissionsOrchHandler(enable_sentry=True, raise_errors=False).handle(
        event, context
    )


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = ""
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_delete_permission_orch.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
