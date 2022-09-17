#!/usr/bin/env python
# coding: utf-8
from pathlib import Path
from typing import Any, Dict, List, Optional

from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class AuthorizedAppIdHandler(ExternalApiHandlerTemplate):
    name = __name__

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"
        self._raw_response: Optional[List[Dict]] = None

    @property
    def job_name(self) -> str:
        return "authorized_app_id"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get files details

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict with a list of files and file metadata.
        """
        if not self.app_id:
            raise BadRequest("NoneType application ID path parameter")

        # run base query
        self._raw_response = self.run_read_query(
            file_path=self.sql_path / "authorized_app_id_base_query.sql",
            query_params={"app_id": self.app_id},
        )

        # build api_response
        resp = self._raw_response
        return {
            "name": resp[0]["name"] if resp else "",
            "id": self.app_id,
            "marketplaceURI": resp[0]["marketplace_uri"] if resp else "",
            "imageURI": resp[0]["marketplace_icon"] if resp else "",
            "grants": list({grant["scope"] for grant in resp if grant["app_id"] == self.app_id}),
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return AuthorizedAppIdHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    context = get_dummy_context()
    context.function_name = "authorized-app-id"
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_authorized_app_id.json")
    )
    logger.json(test_event, name="test_event")

    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
