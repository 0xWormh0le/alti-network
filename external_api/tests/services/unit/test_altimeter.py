import importlib.resources as pkg_resources
from unittest.mock import patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context

from services.altimeter.altimeter_handler import AltimeterHandler
from tests import payloads


@patch.object(AltimeterHandler, "segment_conn")
class TestAltimeterHandler:
    @pytest.fixture()
    def handler(self, mock_config, mock_segment_connector):
        segment_p = patch.object(AltimeterHandler, "segment_conn", mock_segment_connector)
        configs_p = patch.object(AltimeterHandler, "configs", mock_config)
        with segment_p, configs_p:
            handler = AltimeterHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(autouse=True, scope="class")
    def test_event(self):
        return json_tools.loads(pkg_resources.read_text(payloads, "test_event_altimeter.json"))

    @pytest.fixture(autouse=True, scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "altimeter"
        return test_context

    def test_altimeter_handler_success(
        self, mock_segment_connector, test_event, test_context, handler
    ):
        mock_segment_connector.identify.return_value = {}
        response = handler.handle(test_event, test_context)

        assert response["statusCode"] == 200
        assert response["body"] == "{}"
        handler.segment_conn.identify.assert_any_call(
            user_id="testing_user",
            traits={"project_id": "thoughtlabs", "sourceIp": "0.0.0.0", "useragent": "test"},
        )
