from pathlib import Path
from typing import Any, Dict

from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_email_template import ExternalEmailTemplate


class SummaryEmailsHandler(ExternalEmailTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"
    event: LambdaEvent

    @property
    def job_name(self) -> str:
        return "risk_summary_emails"

    def compute_risk_metrics(self) -> Dict[str, Any]:
        """Compute risk metrics for project"""
        summary_query = """
        SELECT
            risk_type_id,
            COUNT(DISTINCT risk_id) AS risk_count,
            SUBSTRING_INDEX(
                GROUP_CONCAT(
                    DISTINCT risk_description
                    ORDER BY risk_incident_date DESC
                    SEPARATOR '|'
                ), '|', 1
            ) AS risk_desc,
            MAX(severity) AS severity
        FROM
            top_risks
        WHERE
            (dt_created > %(yesterday)s)
            AND (status IS NULL OR status = 'active')
        ORDER BY 1
        """
        daily_risks = self.run_read_query(
            query_string=summary_query,
            query_params={
                "yesterday": self.yesterday.date(),
            },
        )

        risk_metrics = self.run_read_query(
            file_path=self.sql_path / "risks_summary_base.sql",
            query_params={
                "yesterday": self.yesterday.date(),
            },
        )

        return {"risk_metrics": risk_metrics, "daily_risks": daily_risks}

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        if self.configs.status == "active":
            self.send_user_emails(self.compute_risk_metrics())

        return {}


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return SummaryEmailsHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    context = get_dummy_context()
    context.function_name = "risks-summary-emails"
    test_event = {
        "project_id": "thoughtlabs",
    }
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
