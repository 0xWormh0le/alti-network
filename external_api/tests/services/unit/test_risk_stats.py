import importlib.resources as pkg_resources
from unittest.mock import MagicMock, patch

import pytest
from tools import json_tools
from tools.lambda_handler import LambdaEvent, LambdaHandlerError, get_dummy_context
from tools.logger import Logger

from services.risk_stats.risk_stats_handler import RiskStatsHandler
from tests import payloads


@patch.object(RiskStatsHandler, "run_read_query")
@pytest.mark.usefixtures("mock_config")
class TestRiskStatsHandler:
    @pytest.fixture(scope="function")
    def handler(self, mock_config):
        configs_p = patch.object(RiskStatsHandler, "configs", mock_config)
        with configs_p:
            handler = RiskStatsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def test_event(self):
        return json_tools.loads(pkg_resources.read_text(payloads, "test_event_risk_stats.json"))

    @pytest.fixture(scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "risk-stats"

        return test_context

    @pytest.fixture(autouse=True, scope="class")
    def mock_run_read_query(self):
        query_runner = MagicMock()
        query_runner.return_value = [{"severity": 5, "risk_type_id": 0, "risk_count": 11}]

        return query_runner

    def test_risk_stats_handler(
        self,
        mock_run_read_query_func,
        test_event,
        test_context,
        handler,
        mock_run_read_query,
    ):
        mock_run_read_query_func.return_value = mock_run_read_query()

        resp = handler.handle(test_event, test_context)
        body = json_tools.loads(resp["body"])

        handler.run_read_query.assert_any_call(
            file_path=handler.sql_path / "risk_stats_base_query.sql",
            response_mapper=handler._build_api_response,
        )
        assert resp["statusCode"] == 200
