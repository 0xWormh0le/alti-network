#!/usr/bin/env python
# coding: utf-8
from typing import Any, Dict, Optional

from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.segment_connector import SegmentConnector

from external_api.exceptions import BadRequest, InternalServerError
from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class AltimeterHandler(ExternalApiHandlerTemplate):
    name = __name__
    event: LambdaEvent

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self._segment_conn: Optional[SegmentConnector] = None

    @property
    def job_name(self) -> str:
        return "altimeter"

    @property
    def user_info(self) -> Dict[str, Any]:
        assert isinstance(self.event, LambdaEvent)
        user_info = self.event.get("requestContext", {}).get("authorizer", {})
        user_info["sourceIp"] = (
            self.event.get("requestContext", {}).get("identity", {}).get("sourceIp")
        )
        user_info["useragent"] = (
            self.event.get("requestContext", {}).get("identity", {}).get("userAgent")
        )

        return user_info

    @property
    def segment_conn(self) -> SegmentConnector:
        if self._segment_conn:
            return self._segment_conn

        if not self.event:
            raise InternalServerError("SegmentConnector cannot be invoked before AltimeterHandler")

        self._segment_conn = SegmentConnector(self.configs.segment_key)
        return self._segment_conn

    def _call_segment_identify(self) -> None:
        return self.segment_conn.identify(
            user_id=self.event.body.get("userId", ""), traits=self.user_info
        )

    def _call_segment_track(self) -> None:
        return self.segment_conn.track(
            user_id=self.event.body.get("userId", ""),
            event_name=self.event.body.get("eventName", ""),
            properties=self.user_info,
        )

    def _call_segment_page(self) -> None:
        return self.segment_conn.page(
            user_id=self.event.body.get("userId", ""),
            category=self.event.body.get("eventName", ""),
            properties=self.user_info,
        )

    def _call_segment_group(self) -> None:
        return self.segment_conn.group(
            user_id=self.event.body.get("userId", ""),
            group_id=self.event.body.get("eventName", ""),
            traits=self.user_info,
        )

    def _call_segment_alias(self) -> None:
        new_user_id = self.event.body.get("newUserId")
        if not new_user_id:
            raise BadRequest("No value for newUserId provided when calling alias")

        return self.segment_conn.alias(
            user_id=new_user_id, previous_id=self.event.body.get("userId", "")
        )

    def call_segment(self) -> Any:
        """
        Invokes segment method
        """
        method_name = self.event.body.get("altimeterMethod")
        method_map = {
            "identify": self._call_segment_identify,
            "track": self._call_segment_track,
            "page": self._call_segment_page,
            "group": self._call_segment_group,
            "alias": self._call_segment_alias,
        }

        if method_name not in method_map:
            raise BadRequest("Invalid value for altimeterMethod")

        return method_map[method_name]()

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        return self.call_segment()


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return AltimeterHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_altimeter.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "altimeter"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
