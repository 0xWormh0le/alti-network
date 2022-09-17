import importlib.resources as pkg_resources
from unittest.mock import patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context

from services.company_domains.company_domains_handler import CompanyDomainsHandler
from tests import payloads


class TestCompanyDomainsHandler:
    @pytest.fixture
    def handler(self, mock_config):
        configs_p = patch.object(CompanyDomainsHandler, "configs", mock_config)
        with configs_p:
            handler = CompanyDomainsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(autouse=True, scope="class")
    def test_event(self):
        return json_tools.loads(
            pkg_resources.read_text(payloads, "test_event_company_domains.json")
        )

    @pytest.fixture(autouse=True, scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "company_domains"
        return test_context

    def test_company_domains_success(self, test_event, test_context, handler):
        response = handler.handle(test_event, test_context)
        body = json_tools.loads(response["body"])

        assert response["statusCode"] == 200
        assert body == [
            "thoughtlabs.io",
            "thoughtlabs00.onmicrosoft.com",
            "thought.labs",
            "thoughtlabs.xyz",
        ]
