import importlib.resources as pkg_resources
from unittest.mock import MagicMock, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context

from services.update_email_address.update_email_address_handler import UpdateEmailAddressHandler
from tests import payloads


@patch.object(UpdateEmailAddressHandler, "run_read_query")
@patch.object(UpdateEmailAddressHandler, "run_write_query")
class TestUpdateEmailAddressHandler:
    @pytest.fixture(scope="function")
    def handler(self, mock_config):
        configs_p = patch.object(UpdateEmailAddressHandler, "configs", mock_config)
        with configs_p:
            handler = UpdateEmailAddressHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def test_event(self):
        return json_tools.loads(
            pkg_resources.read_text(payloads, "test_event_update_email_address.json")
        )

    @pytest.fixture(scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "update-risk-status"

        return test_context

    @pytest.fixture(autouse=True, scope="class")
    def mock_run_read_query(self):
        query_runner = MagicMock()
        query_runner.return_value = [{"kind": "personal", "number": "+15555555555"}]

        return query_runner

    @patch("services.update_email_address.update_email_address_handler.SqsResource")
    @patch("services.update_email_address.update_email_address_handler.SqsConnect")
    def test_update_email_address_handler(
        self,
        MockSqsConnect,
        MockSqsResource,
        mock_run_write_query,
        mock_run_read_query_func,
        test_event,
        test_context,
        handler,
        mock_run_read_query,
    ):
        mock_sqs_connect = MockSqsConnect()
        mock_sqs_connect.send_msg.return_value = ""
        mock_sqs_resource = MockSqsResource()
        mock_sqs_resource.get_q_url.return_value = ""
        mock_run_read_query_func.return_value = mock_run_read_query()
        mock_run_write_query.return_value = {}
        resp = handler.handle(test_event, test_context)

        assert resp["statusCode"] == 200

        handler.run_read_query.assert_any_call(
            file_path=handler.sql_path / "get_pending_permissions.sql",
            query_params={
                "email": "pabloschall@gmail.com",
                "pending": "PENDING",
                "active": "ACTIVE",
            },
        )
