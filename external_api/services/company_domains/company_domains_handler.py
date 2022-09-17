#!/usr/bin/env python
# coding: utf-8
from typing import Any, Dict

from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class CompanyDomainsHandler(ExternalApiHandlerTemplate):
    name = __name__
    event: LambdaEvent

    @property
    def job_name(self) -> str:
        return "company_domains"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        method = self.event.get("httpMethod")
        if method.lower() != "get":
            raise BadRequest(f"API '{method}' is currently not supported")

        return list(self.configs.domains)  # type: ignore


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return CompanyDomainsHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_company_domains.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "company-domains"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
