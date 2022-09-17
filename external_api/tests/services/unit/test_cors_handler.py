import importlib.resources as pkg_resources
import os
from unittest.mock import patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context

from services.cors.cors_handler import CorsHandler
from tests import payloads


class TestCorsHandler:
    @pytest.fixture
    def handler(self, mock_config):
        configs_p = patch.object(CorsHandler, "configs", mock_config)
        with configs_p:
            handler = CorsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(autouse=True, scope="class")
    def test_event(self):
        return json_tools.loads(pkg_resources.read_text(payloads, "test_event_cors.json"))

    @pytest.fixture(autouse=True, scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "cors"
        return test_context

    def test_cors_success(self, test_event, test_context, handler):
        response = handler.handle(test_event, test_context)

        assert response["statusCode"] == 200
        assert response["headers"] == {
            "Access-Control-Allow-Credentials": "true",
            "X-Debug-Request-Origin": "http://localhost:3000",
            "Access-Control-Allow-Headers": "Content-Type, X-Amz-Date, Authorization, X-Api-Key",
            "Access-Control-Allow-Methods": "OPTIONS,GET,POST,DELETE",
            "Access-Control-Allow-Origin": "http://localhost:3000",
            "Cache-Control": "no-store",
            "Vary": "Authorization, Origin",
        }

    @patch.dict(os.environ, {"ENV": "staging"}, clear=True)
    def test_cors_failure(self, test_event, test_context, handler):
        handler.configs.cors_domains = set("127.0.0.1")
        response = handler.handle(test_event, test_context)

        assert response["statusCode"] == 401
        assert (
            response["body"] == '{"message": "Unauthorized request origin: http://localhost:3000"}'
        )
