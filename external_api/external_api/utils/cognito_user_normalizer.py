"""
=====
NOTES
=====

- https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-use-lambda-authorizer.html
- https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints
- https://aws.amazon.com/blogs/compute/introducing-custom-authorizers-in-amazon-api-gateway/
- https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-identity.html
- https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/cognito-idp.html
"""
from typing import Any, Dict

from tools.logger import Logger


class CognitoUserNormalizer:
    def __init__(self, user: Dict[str, Any]) -> None:
        self.logger = Logger.for_object(self)
        self.user: Dict[str, Any] = user
        self.user_attributes: Dict[str, Any] = {}

    def normalize_user_attributes(self) -> Dict[str, Any]:
        attrs = self.user.get("UserAttributes", [])
        for attr in attrs:
            self.user_attributes[attr["Name"]] = attr["Value"]
        self.logger.debug(f"USER ATTRIBUTES: {self.user_attributes}")

        return self.user_attributes
