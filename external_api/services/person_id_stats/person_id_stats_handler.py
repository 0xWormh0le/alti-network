from abc import ABC, abstractmethod
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any, Dict, List

from dateutil.parser import parse
from dateutil.relativedelta import relativedelta
from dynamo_query.data_table import DataTable
from tools.class_tools import cached_property
from tools.dynamo.user_stats_metrics_table.user_stats_metric_record import UserStatsMetricRecord
from tools.dynamo.user_stats_metrics_table.user_stats_metrics_manager import UserStatsMetricsManager
from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class PersonIdStatsBase(ABC):
    api_query_string: str = ""
    class_by_api_query_string: Dict[str, Any] = {}

    def __init_subclass__(cls: Any, **kwargs: str) -> None:
        super().__init_subclass__(**kwargs)  # type: ignore
        if not cls.api_query_string:
            raise ValueError("This class requires the class attribute api_query_string")

        cls.class_by_api_query_string[cls.api_query_string] = cls

    @property
    @abstractmethod
    def response_string(self) -> str:
        ...

    @property
    @abstractmethod
    def query_file_path(self) -> str:
        ...


class PersonIdStatsAtRiskFilesOwned(PersonIdStatsBase):
    api_query_string = "atriskfilesowned"

    @property
    def response_string(self) -> str:
        return "atRiskFilesOwned"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_with_risk.sql"


class PersonIdStatsAllActivity(PersonIdStatsBase):
    api_query_string = "allactivity"

    @property
    def response_string(self) -> str:
        return "allActivity"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_without_risk.sql"


class PersonIdStatsAppDownloads(PersonIdStatsBase):
    api_query_string = "appdownloads"

    @property
    def response_string(self) -> str:
        return "appDownloads"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_without_risk.sql"


class PersonIdStatsCollaborators(PersonIdStatsBase):
    api_query_string = "collaborators"

    @property
    def response_string(self) -> str:
        return "collaborators"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_without_risk.sql"


class PersonIdStatsFilesAccessible(PersonIdStatsBase):
    api_query_string = "filesaccessible"

    @property
    def response_string(self) -> str:
        return "filesAccessible"

    @property
    def query_file_path(self) -> str:
        return ""


class PersonIdStatsFilesSharedby(PersonIdStatsBase):
    api_query_string = "filessharedby"

    @property
    def response_string(self) -> str:
        return "filesSharedBy"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_without_risk.sql"


class PersonIdStatsFilesSharedWith(PersonIdStatsBase):
    api_query_string = "filessharedwith"

    @property
    def response_string(self) -> str:
        return "filesSharedWith"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_without_risk.sql"


class PersonIdStatsRisks(PersonIdStatsBase):
    api_query_string = "risks"

    @property
    def response_string(self) -> str:
        return "risks"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_with_risk.sql"


class PersonIdStatsPersonDownloads(PersonIdStatsBase):
    api_query_string = "persondownloads"

    @property
    def response_string(self) -> str:
        return "personDownloads"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_without_risk.sql"


class PersonIdStatsRisksCreated(PersonIdStatsBase):
    api_query_string = "riskscreated"

    @property
    def response_string(self) -> str:
        return "risksCreated"

    @property
    def query_file_path(self) -> str:
        return "person_id_stats_with_risk.sql"


class PersonStatsHandler(ExternalApiHandlerTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "person_stats"

    @cached_property
    def metrics_manager(self) -> UserStatsMetricsManager:
        return UserStatsMetricsManager(config=self.configs)

    def compute_person_stats_metrics_for_past_year(
        self, metric_class: PersonIdStatsBase
    ) -> List[Dict[str, Any]]:
        """
        Compute the metric value for a metric class.

        Arguments:
            metric_classname    -- PersonIDStatsBase derived class
        Returns:
            Raw MySQL DB results
        """
        first_of_month = date.today().replace(day=1)
        start_date = first_of_month - relativedelta(months=12)
        end_date = first_of_month + relativedelta(months=1)

        query_string = self.render_jinja_template(
            file_path=self.sql_path / metric_class.query_file_path,
            query_fragments={"metric": metric_class.api_query_string},
        )
        self.logger.json(query_string, name="query-string")

        metrics_found = self.run_read_query(
            query_string=query_string,
            query_params={
                "start_date": start_date,
                "end_date": end_date,
                "person_id": self.person_id,
            },
        )
        return metrics_found

    def write_metrics_to_dynamo(
        self,
        raw_results: List[Dict[str, Any]],
        metric_class: PersonIdStatsBase,
    ) -> DataTable[UserStatsMetricRecord]:
        """
        Write computed metric to Dynamo.

        Arguments:
            raw_results     -- raw mysql results.
            metric_class    -- metric class object.
        Returns:
            Updated record.
        """
        metric_records = DataTable(record_class=UserStatsMetricRecord)
        for result in raw_results:
            metric_records.add_record(
                UserStatsMetricRecord(
                    project_id=self.configs.project_name,
                    user_id=self.person_id,
                    metric_datetime=str(result["month"]),
                    metric_name=metric_class.response_string,
                    metric_value=result["count"],
                ),
            )

        return self.metrics_manager.batch_upsert(metric_records)

    def run_compute_metric_workflow(
        self,
        metric_object: PersonIdStatsBase,
        metric_results: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Run compute_metrics and write_to_dynamo workflow

        Arguments:
            metric_classname    -- PersonIdStatsBase derived class
            months              -- List of missing months
            metric_results      -- Metric results.
        Returns:
            Updated metric results list.
        """
        raw_result = self.compute_person_stats_metrics_for_past_year(metric_class=metric_object)
        self.write_metrics_to_dynamo(raw_results=raw_result, metric_class=metric_object)
        for result in raw_result:
            metric_results["label"].append(result["month"])
            metric_results[metric_object.response_string].append(result["count"])

        return metric_results

    def get_metrics(self, metric_name: str) -> Dict[str, Any]:
        """
        Fetch computed stats metrics from Dynamo, if not available run the SQL query

        Arguments:
            metric_name -- metric name
        Returns:
            User Stats record.
        """
        metrics: Dict[str, Any] = dict()
        metric_object = PersonIdStatsBase.class_by_api_query_string[metric_name]()

        # NOTE: checks if there exists metrics for the current month
        # if yes it reads all records from Dynamo
        # else it computes metrics for the past 12 months and write to Dynamo
        metrics["label"] = []
        metrics[metric_object.response_string] = []
        curr_month = date.today().replace(day=1)
        last_month = self.get_previous_month(curr_month)
        two_day_limit = self.convert_date_to_epoch(datetime.now() - timedelta(days=2))
        datetime_metric = self.convert_date_to_epoch(last_month)
        dt_time_int = two_day_limit

        # get metric for last month
        stats_record = self.metrics_manager.cached_get_record(
            UserStatsMetricRecord(
                project_id=self.configs.project_name,
                user_id=self.person_id,
                metric_datetime=str(datetime_metric),
                metric_name=metric_object.response_string,
            ),
        )

        # compute records every two days
        if stats_record:
            dt_time = parse(stats_record["dt_modified"])
            dt_time_int = self.convert_date_to_epoch(dt_time)

        if dt_time_int < two_day_limit:
            metrics = self.run_compute_metric_workflow(
                metric_object=metric_object,
                metric_results=metrics,
            )
        else:
            for _ in range(12):
                # get previous month info
                curr_month = self.get_previous_month(curr_month)
                datetime_metric = self.convert_date_to_epoch(curr_month)

                # get record from Dynamo
                stats_record = self.metrics_manager.cached_get_record(
                    UserStatsMetricRecord(
                        project_id=self.configs.project_name,
                        user_id=self.person_id,
                        metric_datetime=str(datetime_metric),
                        metric_name=metric_object.response_string,
                    ),
                )

                if stats_record:
                    metrics["label"].append(int(stats_record["metric_datetime"]))
                    metrics[metric_object.response_string].append(stats_record["metric_value"])

        final_metrics: Dict[str, Any] = dict()
        final_metrics["label"] = []
        final_metrics[metric_object.response_string] = []
        for label, count in sorted(zip(metrics["label"], metrics[metric_object.response_string])):
            final_metrics["label"].append(label)
            final_metrics[metric_object.response_string].append(int(count))

        return final_metrics

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get Person ID stats response

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict with an person id statistics.
        """
        if not self.person_id:
            raise BadRequest("NoneType personId path parameter")

        if not self.metrics:
            raise BadRequest("NoneType metric query parameter")

        series_response = {}
        for item in self.metrics:
            response = self.get_metrics(metric_name=item)
            label = response.pop("label")
            series_response.update(response)

        return {
            "labels": label,
            "series": series_response,
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return PersonStatsHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_person_id_stats.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "person-id-stats"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
