"""
NOTES:
Lambda Authorizer links:
- https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
- https://docs.aws.amazon.com/apigateway/latest/developerguide/
  api-gateway-lambda-authorizer-output.html
- https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints
- https://aws.amazon.com/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/
- https://github.com/awslabs/aws-support-tools/blob/master/cognito/decode-verify-jwt/
Cognito links:
- https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-identity.html
- https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-idp.html
Lambda integration links:
- https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
"""
from typing import Any, Dict

from tools import json_tools
from tools.lambda_handler import (
    LambdaEvent,
    LambdaEventError,
    LambdaResponse,
    LambdaResponseData,
    get_dummy_context,
)
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.cognito_token_verifier import CognitoTokenVerifier
from external_api.utils.external_api_handler_template import (
    CloudWatchMetric,
    ExternalApiHandlerTemplate,
)
from external_api.utils.policy_generator import PolicyGenerator


# TODO: Instead of picking the group with the highest precedence, allow a user to
#       access more than one project (for customers with more than one account)
#       to access multiple APIs by adding them to multiple User Groups.
class ApiGatewayAuthorizerHandler(ExternalApiHandlerTemplate):
    name = "lambda_authorizer"
    event: LambdaEvent

    @property
    def job_name(self) -> str:
        return "apigateway_authorizer"

    @property
    def policy_generator(self) -> PolicyGenerator:
        return PolicyGenerator()

    @property
    def cognito_verifier(self) -> CognitoTokenVerifier:
        return CognitoTokenVerifier(self.configs)

    def get_endpoint_name(self) -> str:
        """
        Fetches endpoint name from methodArn request parameter
        """
        endpoint_name_list = self.event["methodArn"].split("/")[3:]

        return "_".join(endpoint_name_list).lower()

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        auth_token = self.event.get("authorizationToken")
        method_arn = self.event.get("methodArn")

        # verifies id_token is provided by cognito and has a matching
        # user profile, hence returns a valid claims object.
        # fetch principal_id and project_id from claims object
        claims, res = self.cognito_verifier.get_verified_claims(token=auth_token)
        principal_id: str = claims.get("email", claims.get("sub"))
        self.generate_emf_logs(
            endpoint_name=self.get_endpoint_name(),
            user_id=principal_id,
            metric_name=CloudWatchMetric.VIEW_COUNT,
            metric_value=1,
        )
        if not res:
            self.logger.error("ID Token is not verified. Request is DENIED.")
            integration_response = self.policy_generator.generate_policy(
                principal_id=principal_id,
                effect="Deny",
                method_arn=method_arn,
                project_id="",
            )
            self.logger.debug(str(integration_response))
            return integration_response

        # TODO: remove after FLAVIUS release=1.0.11
        # support access_token and id_token use(backward compatibility)
        if claims.get("token_use") == "id":
            project_id = claims.get("custom:project_id", "")
        else:
            user_groups = claims.get("cognito:groups")
            project_id = user_groups[0].split("-")[0] if user_groups else ""
        if not project_id:
            self.logger.error("ID Token claims does not include project_id. Request is DENIED.")
            integration_response = self.policy_generator.generate_policy(
                principal_id=principal_id,
                effect="Deny",
                method_arn=method_arn,
                project_id=project_id,
            )
            self.logger.debug(str(integration_response))
            return integration_response

        self.logger.debug(f"Project ID: {project_id}")

        # Generate allow access policy and append user attributes to it
        self.logger.info("ID Token is verified. Request is ALLOWED.")
        integration_response = self.policy_generator.generate_policy(
            principal_id=principal_id,
            effect="Allow",
            method_arn=method_arn,
            project_id=project_id,
        )
        self.logger.info(str(integration_response))
        return integration_response

    def _get_response_or_error(self) -> LambdaResponse:
        """
        Get response data from `get_response`.
        If `LambdaEventError` is raised during the process, result
        response has the error message.
        TODO: Remove after https://altitudenetworks.atlassian.net/browse/TOOLS-34
        Returns:
            AWS Lambda response.
        """
        try:
            response = self.get_response(self.event)
        except LambdaEventError as e:
            response = dict(message=f"{e}")

        self.logger.info("Integration response:")
        self.logger.json(response, level=Logger.INFO)

        return response


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return ApiGatewayAuthorizerHandler(enable_sentry=True, raise_errors=False).handle(
        event, context
    )


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    test_event = json_tools.loads(resources.read_text(payloads, "test_event_authorizer.json"))

    context = get_dummy_context()
    context.function_name = "apigateway-authorizer"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
