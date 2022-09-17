#!/usr/bin/env python
# coding: utf-8
from datetime import date, datetime, timezone
from typing import Any, Dict, Optional

from dateutil.relativedelta import relativedelta
from tools import datetime_tools
from tools.dynamo.applications_table.application_metrics_manager import ApplicationMetricsManager
from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.exceptions import BadRequest, InternalServerError
from external_api.utils.external_api_handler_template import (
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)


class AuthorizedAppIdStatsHandler(ExternalApiHandlerTemplate):
    # TODO: https://altitudenetworks.atlassian.net/browse/API-223
    DEFAULT_METRIC_VALUE = 0

    name = __name__

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self._applications_manager: Optional[ApplicationMetricsManager] = None

    @property
    def job_name(self) -> str:
        return "authorized_app_id_stats"

    @property
    def applications_manager(self) -> ApplicationMetricsManager:
        if self._applications_manager:
            return self._applications_manager

        self._applications_manager = ApplicationMetricsManager(
            env=self.configs.env, aws_region=self.configs.aws_region
        )
        return self._applications_manager

    @staticmethod
    def get_epoch_months_ago(months: int) -> int:
        """
        Get unix datetime in epoch for months ago

        Arguments:
            months - Number of months ago

        Returns:
            A unix datetime.
        """
        curr_date = date.today().replace(day=1) + relativedelta(months=-months)
        curr_time = datetime.combine(curr_date, datetime.min.time()).replace(tzinfo=timezone.utc)

        return int(datetime_tools.convert_datetime_to_epoch(curr_time))

    def get_app_metric(self, metric_id: str, date_str: int) -> int:
        """
        Fetches the app metrics for a given month

        Arguments:
            app_id - Application Id
            metric_id: Authorization application metric Id
            date_str: Months ago timestamp in unix

        Returns:
            A string of given metric value.
        """
        app_metric = self.applications_manager.get(
            project_id=self.configs.project_name,
            client_id=self.app_id or "",
            metric_id=metric_id,
            metric_label=date_str,
        )

        self.logger.json(app_metric, name=f"app_{metric_id}_{date_str}_ago")

        if not app_metric:
            self.generate_emf_logs(
                endpoint_name=self.job_name,
                user_id=f"{self.app_id}_{metric_id}",
                metric_name=CloudWatchMetric.MISSING_METRIC_ID,
                metric_value=1,
            )
            return self.DEFAULT_METRIC_VALUE
        if app_metric and not app_metric.get("metric_value"):
            self.generate_emf_logs(
                endpoint_name=self.job_name,
                user_id=f"{self.app_id}_{metric_id}",
                metric_name=CloudWatchMetric.MISSING_METRIC_VALUE,
                metric_value=1,
            )
            return self.DEFAULT_METRIC_VALUE
        return int(app_metric["metric_value"])

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get files details

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict with a list of files and file metadata.
        """
        # check path param
        if not self.app_id:
            raise BadRequest("NoneType application ID path parameter")

        # get authorized app metrics from Dynamo
        # list needs to be reversed since it gets the date from now() moving backwards
        labels = [self.get_epoch_months_ago(month) for month in range(11)]
        labels.reverse()

        authorized_by = [
            self.get_app_metric(metric_id="count_people_who_authorized_app", date_str=label)
            for label in labels
        ]

        file_downloads = [
            self.get_app_metric(metric_id="count_files_downloaded_by_app", date_str=label)
            for label in labels
        ]

        associated_risks = [
            self.get_app_metric(metric_id="count_risks_by_app", date_str=label) for label in labels
        ]

        total_authorized = self.get_app_metric(
            metric_id="count_people_who_authorized_app_current", date_str=labels[-1]
        )

        total_risks = self.get_app_metric(
            metric_id="count_risks_by_app_current", date_str=labels[-1]
        )

        total_sensitive = self.get_app_metric(
            metric_id="count_total_sensitive_files", date_str=labels[-1]
        )

        total_employees = self.get_app_metric(
            metric_id="count_total_employees", date_str=labels[-1]
        )

        if total_employees == 0:
            raise InternalServerError("Total employees information not found")

        # build api_response
        return {
            "labels": labels,
            "series": {
                "authorizedBy": authorized_by,
                "fileDownloads": file_downloads,
                "associatedRisks": associated_risks,
            },
            "tileInfo": {
                "currentAuthorizedBy": total_authorized,
                "currentRisks": total_risks,
                "totalEmails": total_employees,
                "totalSensitive": total_sensitive,
            },
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return AuthorizedAppIdStatsHandler(enable_sentry=True, raise_errors=False).handle(
        event, context
    )


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = "authorized-app-id-stats"
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_authorized_app_id.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
