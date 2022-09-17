import importlib.resources as pkg_resources
from unittest.mock import patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context

from services.update_risk_status.update_risk_status_handler import UpdateRiskStatusHandler
from tests import payloads


@patch.object(UpdateRiskStatusHandler, "run_read_query")
class TestUpdateRiskStatusHandler:
    @pytest.fixture(scope="function")
    def handler(self, mock_config):
        configs_p = patch.object(UpdateRiskStatusHandler, "configs", mock_config)
        with configs_p:
            handler = UpdateRiskStatusHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def test_event(self):
        return json_tools.loads(
            pkg_resources.read_text(payloads, "test_event_update_risk_status.json")
        )

    @pytest.fixture(scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "update-risk-status"

        return test_context

    @patch("services.update_risk_status.update_risk_status_handler.SqsResource")
    @patch("services.update_risk_status.update_risk_status_handler.SqsConnect")
    def test_update_risk_status_handler(
        self,
        MockSqsConnect,
        MockSqsResource,
        mock_run_read_query,
        test_event,
        test_context,
        handler,
    ):
        mock_sqs_connect = MockSqsConnect()
        mock_sqs_connect.send_msg.return_value = ""
        mock_sqs_resource = MockSqsResource()
        mock_sqs_resource.get_q_url.return_value = ""
        mock_run_read_query.return_value = [{"kind": "personal", "number": "+15555555555"}]
        resp = handler.handle(test_event, test_context)

        assert resp["statusCode"] == 200

        mock_sqs_resource.get_q_url.call_count == 1
        mock_sqs_connect.send_msg.call_count == 1

        handler.run_read_query.assert_any_call(
            file_path=handler.sql_path / "get_pending_permissions.sql",
            query_params={
                "risk_id": "301c568d821375a4c19c0118547fdb1d47fdc6cce",
            },
        )
