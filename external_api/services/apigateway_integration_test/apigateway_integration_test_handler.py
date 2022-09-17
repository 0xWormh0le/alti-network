#!/usr/bin/env python
from typing import Any, Dict, List

import requests
from tools.lambda_handler import LambdaEvent, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.apigateway_test_resources import ApiGatewayTestResources


class ApigatewayHandler(ApiGatewayTestResources):
    name = __name__
    event: LambdaEvent

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self._file_id: str = "1b31TNGTuwRIWWpU9NSdWNGuUtBQupk2U"
        self._person_id: str = "bobbie@thoughtlabs.io"
        self._risk_id: str = "ed83d6a126c0cd7b4f414d677eb2c611a841bae7"
        self._app_id: str = "261251194779"
        self._perm_id: str = "anyoneWithLink"
        self._folder_id: str = "0AHJv11VuYBNnUk9PVA"
        self._resources: List[Dict[str, Any]] = []

    @property
    def job_name(self) -> str:
        return "apigateway_integration_test"

    @property
    def resources(self) -> List[Dict[str, Any]]:
        if self._resources:
            return self._resources

        self._resources = self.get_resources(
            app_id=self._app_id,
            file_id=self._file_id,
            person_id=self._person_id,
            perm_id=self._perm_id,
            risk_id=self._risk_id,
            folder_id=self._folder_id,
        )
        return self._resources

    def create_risks_test_events(self) -> List[Dict[str, Any]]:
        """
        Generate list of test events for risks endpoint
        """
        return [
            {"severity-threshold": "0"},
            {"person-id": self._person_id, "order-by": "date_time"},
            {"sort": "asc", "creator-id": self._person_id},
            {"at-risk": "True", "creator-id": self._person_id},
            {"order-by": "severity", "risk-type-ids": "[3010]"},
            {"application-id": self._app_id},
        ]

    @staticmethod
    def create_auth_app_id_test_events() -> List[Dict[str, Any]]:
        """
        Generate list of test events for authorized app id
        """
        return [{"event-type": "download"}, {"page-size": "10", "page-number": "01"}]

    def create_files_test_events(self) -> List[Dict[str, Any]]:
        """
        Create test events for the files endpoint
        """
        return [
            {"owner-id": self._person_id, "at-risk": "false", "sort": "asc"},
            {"owner-id": self._person_id, "at-risk": "true"},
            {"person-id": self._person_id, "order-by": "date_time", "sort": "desc"},
            {"risk-id": self._risk_id, "order-by": "severity"},
        ]

    def create_people_test_events(self) -> List[Dict[str, Any]]:
        """
        People endpoint test events
        """
        return [
            {"risk-id": self._risk_id, "domain": "internal"},
            {"risk-id": self._risk_id},
            {"domain": "internal"},
            {"application-id": self._app_id},
        ]

    def create_permissions_test_events(self) -> List[Dict[str, Any]]:
        """
        Permissions endpoint test events
        """
        return [
            {
                "file-id": self._file_id,
                "email": self._person_id,
                "order-by": "permissions-emailaddress",
            },
            {
                "risk-id": self._risk_id,
                "file-id": self._file_id,
                "email": self._person_id,
                "order-by": "permissions-emailaddress",
            },
        ]

    def _create_test_event(self) -> Dict[str, Any]:
        """
        Generates test event
        """
        base_param = {
            "page-number": "1",
            "page-size": "10",
            "order-by": "datetime",
            "sort": "desc",
            "risk-type-ids": "[3010]",
        }
        resp = requests.get(url=f"{self.api_url}/risks", params=base_param, headers=self.api_header)
        response = resp.json()
        self.logger.json(response, name="base-test-response")

        risk = response.get("risks")[0]
        risk_id = risk["riskId"]
        if risk_id and risk_id != "NULL":
            self._risk_id = risk_id

        person_id = risk["owner"]["email"]
        if person_id and person_id != "NULL":
            self._person_id = person_id

        file_id = risk["fileId"]
        if file_id and file_id != "NULL":
            self._file_id = file_id

        app_id = risk["plugin"]["id"]
        if app_id and app_id != "NULL":
            self._app_id = app_id

        resp = requests.get(url=f"{self.api_url}/sensitive-phrases", headers=self.api_header)
        raw_phrase = resp.json()
        self.logger.json(raw_phrase, name="sensitive-phrases")
        phrase = raw_phrase[len(raw_phrase) - 1] if raw_phrase else {}

        return {
            "risk-id": self._risk_id,
            "parent-id": self._folder_id,
            "folder-id": self._folder_id,
            "permission-id": self._perm_id,
            "id": phrase.get("id", "test-phrase-id"),
            "altimeterMethod": "track",
            "eventName": "test",
            "userId": "testing_user",
            "metadata": {"testing": "testing"},
            "event-type": "sharedWith",
            "phrase": phrase.get("phrase", "test-phrase"),
            "exact": phrase.get("exact", False),
        }

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        self.logger.debug(f"message: {self.event}")
        self.logger.debug(f"body: {self.event.body}")

        start = f":zap: Begin tests for API Gateway operations in *{self.configs.env}* :zap:"
        self.slack_alert().send_notification(start, "info")
        payload = self._create_test_event()
        for res in self.resources:
            self.logger.json(res, name="resource-name")
            if res.get("path") == "/risks":
                events = self.create_risks_test_events()
                for t_ev in events:
                    self.invoke_endpoint(resource=res, query_payload=t_ev)
            elif res.get("path") == "/files":
                events = self.create_files_test_events()
                for t_ev in events:
                    self.invoke_endpoint(resource=res, query_payload=t_ev)
            elif res.get("path") == "/people":
                events = self.create_people_test_events()
                for t_ev in events:
                    self.invoke_endpoint(resource=res, query_payload=t_ev)
            elif "/application" in str(res.get("path")):
                events = self.create_auth_app_id_test_events()
                for t_ev in events:
                    self.invoke_endpoint(resource=res, query_payload=t_ev)
            elif (
                res.get("path")
                in (
                    "/permissions",
                    "risk/risk-id/permissions",
                )
                or "/permission" in str(res.get("path"))
            ):
                events = self.create_permissions_test_events()
                for t_ev in events:
                    self.invoke_endpoint(resource=res, query_payload=t_ev)
            else:
                self.invoke_endpoint(resource=res, query_payload=payload)

        stop = (
            f":green_check_mark: Completed tests"
            f" for API Gateway operations in "
            f" *{self.configs.env}* :green_check_mark:"
        )
        self.slack_alert().send_notification(stop, "success")
        return {}


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponseData:
    Logger.main(formatter=Logger.JSONFormatter())
    return ApigatewayHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    context = get_dummy_context()
    context.function_name = "apigateway-integration-tests"
    test_event = {
        "project_id": "thoughtlabs",
        "env": "dev",
        "job_name": "apigateway-integration-tests",
    }

    ApigatewayHandler(enable_sentry=False, raise_errors=True).handle(test_event, context)


##########################
if __name__ == "__main__":
    main()
