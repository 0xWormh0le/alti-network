import importlib.resources as pkg_resources
from unittest.mock import MagicMock, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context

from external_api.utils.cognito_token_verifier import CognitoTokenVerifier
from services.apigateway_authorizer.apigateway_authorizer_handler import ApiGatewayAuthorizerHandler
from tests import payloads


class TestApiGatewayAuthorizerHandler:
    @pytest.fixture
    def handler_failure(self):
        failure_return_value = {}, False
        with patch.object(
            CognitoTokenVerifier, "get_verified_claims", return_value=failure_return_value
        ):
            handler = ApiGatewayAuthorizerHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def handler_success(self, verified_claims):
        success_return_value = verified_claims, True
        with patch.object(
            CognitoTokenVerifier, "get_verified_claims", return_value=success_return_value
        ):
            handler = ApiGatewayAuthorizerHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "apigateway-authorizer"
        return lambda_context

    @pytest.fixture()
    def lambda_event(self, method_arn):
        return {
            "authorizationToken": "1234",
            "body": {"authorizationToken": "1234", "methodArn": method_arn, "type": "TOKEN"},
            "methodArn": method_arn,
            "type": "TOKEN",
        }

    @pytest.fixture()
    def method_arn(self):
        return "arn:aws:execute-api:region:accntno:apigwid/apigwstage/method/endpoint"

    @pytest.fixture()
    def verified_claims(self):
        return {
            "sub": "username",
            "cognito:groups": ["thoughtlabs-dev-usergroup-low"],
            "event_id": "123456789",
            "token_use": "access",
            "scope": "aws.cognito.signin.user.admin",
            "auth_time": 1607704386,
            "iss": "https://cognito-idp.region.amazonaws.com/region_cognito_up_id",
            "exp": 1607707986,
            "iat": 1607704386,
            "jti": "987654321",
            "client_id": "client_id",
            "username": "username",
        }

    @pytest.fixture()
    def cognito_token_verifier_failure(self, mock_config):
        failure_return_value = {}, False
        with patch.object(CognitoTokenVerifier, "get_verified_claims", failure_return_value):
            cognito_token_verifier = CognitoTokenVerifier(configs=mock_config)
            yield cognito_token_verifier

    @pytest.fixture()
    def cognito_token_verifier_success(self, verified_claims, mock_config):
        success_return_value = verified_claims, True
        with patch.object(CognitoTokenVerifier, "get_verified_claims", success_return_value):
            cognito_token_verifier = CognitoTokenVerifier(configs=mock_config)
            yield cognito_token_verifier

    def test_apigateway_authorizer_handler_failure(
        self, lambda_event, lambda_context, handler_failure, method_arn
    ):
        response = handler_failure.handle(lambda_event, lambda_context)
        assert response["policyDocument"] == {
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": "Deny",
                    "Resource": method_arn,
                    "Sid": "FirstStatement",
                }
            ],
            "Version": "2012-10-17",
        }

    def test_apigateway_authorizer_handler_success(
        self, lambda_event, lambda_context, handler_success, method_arn
    ):
        response = handler_success.handle(lambda_event, lambda_context)
        assert response["policyDocument"] == {
            "Statement": [
                {
                    "Action": "execute-api:Invoke",
                    "Effect": "Allow",
                    "Resource": method_arn,
                    "Sid": "FirstStatement",
                }
            ],
            "Version": "2012-10-17",
        }

    def test_get_endpoint_name(self, lambda_event, lambda_context, handler_success):
        handler_success.handle(lambda_event, lambda_context)
        endpoint_name = handler_success.get_endpoint_name()
        assert endpoint_name == "endpoint"
