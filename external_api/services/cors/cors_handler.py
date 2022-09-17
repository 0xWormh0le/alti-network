#!/usr/bin/env python
from typing import Any, Dict

from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.exceptions import UnauthorizedError
from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class CorsHandler(ExternalApiHandlerTemplate):
    name = __name__
    event: LambdaEvent
    cloudwatch_namespace = "altitude/cors"

    @property
    def job_name(self) -> str:
        return "cors"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Checks the origin is allowed for the current environment and updates the response headers.

        Arguments:
            event - LambdaEvent body

        Returns:
            A `LambdaResponse` object
        """
        origin = event.get_header("origin") or "*"
        self.logger.info(f"Origin: {origin!r}, CORS Domains: {self.configs.cors_domains!r}")
        if not {"*", origin} & set(self.configs.cors_domains):
            raise UnauthorizedError(f"Unauthorized request origin: {origin}")

        self.response_headers = {
            **self.response_headers,
            "X-Debug-Request-Origin": origin,
            "Access-Control-Allow-Headers": ("Content-Type, X-Amz-Date, Authorization, X-Api-Key"),
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
        }
        self.logger.json(self.response_headers, name="cors-response-header")

        return {}


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return CorsHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_cors.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "cors"
    CorsHandler(enable_sentry=False, raise_errors=True).handle(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
