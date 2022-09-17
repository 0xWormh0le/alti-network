#!/usr/bin/env python
from abc import abstractmethod
from typing import Any, Dict, List

import requests
from botocore.exceptions import ClientError
from requests import Response
from requests.exceptions import HTTPError
from tools.apigateway_connect import ApiGatewayConnect
from tools.class_tools import cached_property
from tools.lambda_handler import LambdaEvent, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.param_store import ParamStore
from tools.slack_notifications import SlackNotifications

from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class ApiGatewayTestResources(ExternalApiHandlerTemplate):
    name = __name__
    SLACK_ERROR = "error"
    SLACK_SUCCESS = "success"
    event: LambdaEvent

    @abstractmethod
    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Override in sub class
        """

    @cached_property
    def apigateway_connect(self) -> ApiGatewayConnect:
        return ApiGatewayConnect(boto3_session=self.configs.boto3_session)

    @cached_property
    def api_url(self) -> str:
        api_sub = "api" if self.configs.env == "prod" else f"api-{self.configs.env}"
        return f"https://{api_sub}.altitudenetworks.com/{self.configs.env}-{self.configs.suffix}"

    @cached_property
    def origin(self) -> str:
        app = (
            "app"
            if self.configs.env == "prod"
            else "app-staging"
            if self.configs.env == "staging"
            else "app-dev"
        )
        return f"https://{app}.altitudenetworks.com/{self.configs.env}-{self.configs.suffix}"

    @property
    def user(self) -> str:
        return "int.test@thoughtlabs.io"

    @cached_property
    def user_passwd(self) -> str:
        return ParamStore(self.configs.aws_region).get_param("thoughtlabs_user_pass", True)

    @cached_property
    def apigateway_id(self) -> str:
        """Get apigateway Id"""
        api_sub = "api" if self.configs.env == "prod" else f"api-{self.configs.env}"
        base_path = self.apigateway_connect.get_base_path_mapping(
            domain_name=f"{api_sub}.altitudenetworks.com",
            base_path=f"{self.configs.env}-{self.configs.suffix}",
        )
        return base_path["restApiId"]

    @property
    def auth_token(self) -> str:
        return (
            self.configs.boto3_session.client("cognito-idp")
            .admin_initiate_auth(
                UserPoolId=self.configs.cognito_user_pool_id,
                ClientId=self.configs.cognito_user_pool_client_id,
                AuthFlow="ADMIN_NO_SRP_AUTH",
                AuthParameters={"USERNAME": self.user, "PASSWORD": self.user_passwd},
            )
            .get("AuthenticationResult")
            .get("AccessToken")
        )

    @cached_property
    def api_header(self) -> Dict[str, Any]:
        return {
            "authority": self.api_url,
            "content-length": "0",
            "accept": "application/json, text/plain, */*",
            "origin": self.origin,
            "authorization": self.auth_token,
            "content-type": "application/x-www-form-urlencoded",
            "sec-fetch-site": "same-site",
            "sec-fetch-mode": "cors",
            "referer": self.origin,
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en-US,en;q=0.9",
        }

    def slack_alert(self, error: bool = False) -> SlackNotifications:
        if error and self.configs.env == "prod":
            slack_channel = "alerts"
        else:
            slack_channel = "integration-tests"

        return SlackNotifications(self.configs.slack_webhook, slack_channel)

    def send_slack_message(
        self, path: str, method: str, payload: Dict[str, Any], response: Response
    ) -> None:
        """
        Sends a slack notification
        """
        status = response.status_code
        msg = response.reason
        msg_code = self.SLACK_SUCCESS

        if response.ok:
            message = (
                f":zap: Normal operations for {path} on *{method}*"
                f"\n with params: ```{payload}```\n"
            )
        elif status in (401, 403):
            message = (
                f":warning: *{status} - {msg}*  on operations for {path} on *{method}*"
                f"\n with params: ```{payload}```\n"
            )
        else:
            message = (
                f":warning: <!here> Failure operations for {path} on "
                f"*{method}* with error `{status}: {msg}`"
                f"\n with params: ```{payload}```\n for `"
                f"{self.configs.project_name}` in *{self.env}*"
            )
            msg_code = self.SLACK_ERROR

        if msg_code == self.SLACK_ERROR:
            self.slack_alert(True).send_notification(message, msg_code)
        else:
            self.slack_alert().send_notification(message, msg_code)

    @staticmethod
    def _validate_methods(resource: Dict[str, Any]) -> List[str]:
        """
        Helper to validate methods
        """
        if resource:
            methods = [
                mthd
                for mthd in resource.keys()
                if (mthd.lower() != "options" and mthd.lower() != "delete")
            ]
        else:
            methods = []

        return methods

    def get_resources(
        self,
        app_id: str,
        file_id: str,
        person_id: str,
        perm_id: str,
        risk_id: str,
        folder_id: str,
    ) -> List[Dict[str, Any]]:
        """
        Fetches api endpoint resources
        """
        api_resources = []
        try:
            resources = self.apigateway_connect.get_resources(api_id=self.apigateway_id)
            items = resources.get("items")
            api_resources = [
                {
                    "path": item.get("path").format(
                        applicationId=app_id,
                        fileId=file_id,
                        folderId=folder_id,
                        parentId=folder_id,
                        personId=person_id,
                        permissionId=perm_id,
                        riskId=risk_id,
                    ),
                    "methods": self._validate_methods(item.get("resourceMethods")),
                }
                for item in items
            ]
        except ClientError as exp:
            if exp.response["Error"]["Code"] == "NotFoundException":
                self.logger.warning(f"{self.apigateway_id} does not exist: {exp}")
        return api_resources

    def invoke_endpoint(
        self, resource: Dict[str, Any], query_payload: Dict[str, Any]
    ) -> List[Response]:
        """
        Invokes API Endpoint
        """
        api_path = resource.get("path")
        methods = resource.get("methods")
        responses = []
        if methods:
            for method in methods:
                try:
                    if method.lower() == "post":
                        self.logger.info(f"{self.api_url}{api_path}")
                        resp = requests.post(
                            url=f"{self.api_url}{api_path}",
                            params=query_payload,
                            json=query_payload,
                            headers=self.api_header,
                        )
                    elif method.lower() == "delete":
                        resp = requests.delete(
                            url=f"{self.api_url}{api_path}",
                            params=query_payload,
                            headers=self.api_header,
                        )
                    elif method.lower() == "put":
                        resp = requests.put(
                            url=f"{self.api_url}{api_path}",
                            params=query_payload,
                            headers=self.api_header,
                        )
                    else:
                        resp = requests.get(
                            url=f"{self.api_url}{api_path}",
                            params=query_payload,
                            headers=self.api_header,
                        )
                    self.send_slack_message(
                        path=str(api_path), method=method, payload=query_payload, response=resp
                    )
                    responses.append(resp)
                except HTTPError as ex:
                    self.slack_alert(True).send_notification(
                        f":warning: <!here> Error invoking `{method}` on *{api_path}", "error"
                    )
                    self.logger.error(f"Error invoking endpoint {api_path}: {ex}")

        self.logger.json(responses, name="invoke-api-response")
        return responses


def main() -> None:
    class TestResources(ApiGatewayTestResources):
        name = __name__
        event: LambdaEvent

        def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
            self.logger.info(f"event: {self.event}")
            job_name = self.event.body.get("job_name")
            self.logger.info(f"env: {self.configs.env}")
            self.logger.info(f"job-name: {job_name}")
            return {}

    context = get_dummy_context()
    context.function_name = "test_handler"

    event = {"Records": [{"body": {"job_name": "test-apigateway", "project_id": "thoughtlabs"}}]}
    TestResources(enable_sentry=True, raise_errors=True).handle(event, context)


if __name__ == "__main__":
    main()
