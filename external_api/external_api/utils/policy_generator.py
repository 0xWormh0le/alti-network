from typing import Any, Dict, Optional

from tools.logger import Logger


class PolicyGenerator:
    def __init__(self) -> None:
        self.logger = Logger.for_object(self)
        self.attr: Optional[str] = None

    def generate_policy(
        self, principal_id: str, effect: str, method_arn: str, project_id: str
    ) -> Dict[str, Any]:
        """
        Creates an IAM Policy with "Allow" or "Deny" permissions to act on
        the lambda backend function.

        You can use the 'context' mapping to return cached credentials
        from the authorizer to the backend, using an integration request mapping template.
        This enables the backend to provide an improved user experience
        by using the cached credentials to reduce the need
        to access the secret keys and open the authorization tokens for every request.
        For the Lambda proxy integration, API Gateway passes
        the 'context' object from a Lambda authorizer directly
        to the backend Lambda function as part of the input event.
        You can retrieve the context key-value pairs
        in the Lambda function by calling $event.requestContext.authorizer.<key>

        Other parameters that are passed to the backend lambda via $context object:
        https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-
        template-reference.html#context-variable-reference

        :param principal_id: the id of the requester
        :param effect: API method effect
        :param method_arn: AWS Resource Number for the API methods called
        :param project_id: customer project id
        :return: auth_response : a mapping with the following entries:
            policyDocument : a mapping containing IAM Policy
            context: a mapping containing additional information that can be passed into
                    the integration backend
            principalId : the id of the original user making the call to API GW.

        https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
        https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-lambda-authorizer-output.html
        https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-
        policies-to-invoke-api.html#api-gateway-calling-api-permissions
        https://docs.aws.amazon.com/apigateway/latest/developerguide/integrating-api-with-aws-services
        -lambda.html#api-as-lambda-proxy-setup-iam-role-policies
        https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control
        -access-using-iam-policies-to-invoke-api.html#api-gateway-calling-api-permissions
        """
        if "person" in method_arn:
            method_arn = method_arn.split("person")[0] + "person/*"
            self.logger.debug(f"Updated Method ARN: {method_arn}")

        if "file" in method_arn:
            method_arn = method_arn.split("file")[0] + "file*"
            self.logger.debug(f"Updated Method ARN: {method_arn}")

        policy_document = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Sid": "FirstStatement",
                    "Action": "execute-api:Invoke",
                    "Effect": effect,
                    "Resource": method_arn,
                }
            ],
        }

        context = {
            "project_id": project_id,
        }

        auth_response = {
            "principalId": principal_id,
            "policyDocument": policy_document,
            "context": context,
        }

        return auth_response
