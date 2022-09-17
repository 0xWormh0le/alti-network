#!/usr/bin/env python
# coding: utf-8
from pathlib import Path
from typing import Any, Dict

from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class RiskStatsHandler(ExternalApiHandlerTemplate):
    name = __name__
    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "risks_stats"

    @staticmethod
    def _build_api_response(results: Dict[str, Any]) -> Dict[str, Any]:
        """
        Build api response
        """
        return {
            "count": results.get("risk_count", 0),
            "severity": results.get("severity", ""),
            "riskTypeId": results.get("risk_type_id", ""),
        }

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        resp = self.run_read_query(
            file_path=self.sql_path / "risk_stats_base_query.sql",
            response_mapper=self._build_api_response,
        )

        return {"stats": resp or {}}


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return RiskStatsHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_risk_stats.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "risk-stats"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
