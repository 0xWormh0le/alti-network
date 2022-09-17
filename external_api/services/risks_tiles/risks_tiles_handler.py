from pathlib import Path
from typing import Any, Dict

from tools.catalogs import Platform
from tools.class_tools import cached_property
from tools.dynamo.risks_table.risk_metrics_manager import RiskMetricRecord, RiskMetricsManager
from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase

from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class RisksTilesHandler(ExternalApiHandlerTemplate):
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
        return "risks_tiles"

    @cached_property
    def risk_metrics_manager(self) -> RiskMetricsManager:
        return RiskMetricsManager(env=self.configs.env, aws_region=self.configs.aws_region)

    def normalize_file_record(self, file_data: RiskMetricRecord) -> Dict[str, Any]:
        """
        Build risk tiles file
        """
        self.logger.info(f"File Data: {file_data} - {self.event.project_id}\n")
        platform = Platform(file_data.get("platform") or "gsuite").value

        file_details = dict()
        if file_data:
            file_details_list = self.run_read_query(
                file_path=self.sql_path / platform / "risk_tile_file_info.sql",
                query_params={"file_id": file_data.get("file_id"), "platform": platform},
            )
            file_details = file_details_list[0] if file_details_list else {}

        return self.get_file_record(file_details)

    def get_tile_metric(self, metric_name: str) -> RiskMetricRecord:  # type: ignore
        """
        Gets current metric or checks from previous day
        """
        self.logger.info(f"metric_name: {metric_name}")
        return self.risk_metrics_manager.get_most_recent(  # type: ignore
            project_id=self.configs.project_name, metric_id=metric_name  # type: ignore
        )

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Builds the risk tiles object response mapping to api specs

        :param event:
        :return response:
        """
        # get raw metrics from Dynamo
        most_risks_metric = self.get_tile_metric(metric_name="most_risks_created")
        highest_file_metric = self.get_tile_metric(metric_name="highest_risk_file")
        most_at_risk_file_metric = self.get_tile_metric(metric_name="most_at_risk_files_owned")
        most_ext_access_metric = self.get_tile_metric(metric_name="most_external_access")

        return {
            "mostRisksCreated": {
                "person": self.get_user_record(
                    platform=self.platform.value, email=most_risks_metric["person_id"]
                ),
                "count": most_risks_metric["metric_value"],
            },
            "highestRiskFile": {
                "file": self.normalize_file_record(highest_file_metric),
                "count": highest_file_metric["metric_value"],
            },
            "mostAtRiskFilesOwned": {
                "person": self.get_user_record(
                    platform=self.platform.value, email=most_at_risk_file_metric["person_id"]
                ),
                "count": most_at_risk_file_metric["metric_value"],
            },
            "mostExternalAccess": {
                "person": self.get_user_record(
                    platform=self.platform.value, email=most_ext_access_metric["person_id"]
                ),
                "count": most_ext_access_metric["metric_value"],
            },
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    # Logger.main(formatter=Logger.JSONFormatter())
    return RisksTilesHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    context = get_dummy_context()
    context.function_name = "risks-tiles"
    test_event = {
        "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
        "queryStringParameters": {},
    }
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
