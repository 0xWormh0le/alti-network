from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.dynamo.data_state_table.risk_engine_keywords_manager import RiskEngineKeywordsManager
from tools.lambda_handler import get_dummy_context

from services.sensitive_phrases.sensitive_phrases_handler import SensitivePhrasesHandler


@pytest.mark.usefixtures("dynamodb_local")
class TestSensitivePhrasesHandler:
    @pytest.fixture
    def risk_engine_keywords_manager(self, mock_config, dynamodb_local):
        metrics_manager = RiskEngineKeywordsManager(mock_config)
        metrics_manager.create_table()
        metrics_manager.clear_records()
        metrics_manager.upsert(
            uuid="1234",
            keyword="test-mally",
            exact_match=False,
        )
        yield metrics_manager
        metrics_manager.delete_table()

    @pytest.fixture(scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "sensitive-phrases"
        return test_context

    @pytest.fixture
    def handler(self, mock_config, risk_engine_keywords_manager):
        configs_p = patch.object(SensitivePhrasesHandler, "configs", mock_config)
        metric_mgr_p = patch.object(
            SensitivePhrasesHandler, "risk_engine_keywords_manager", risk_engine_keywords_manager
        )
        with configs_p, metric_mgr_p:
            handler = SensitivePhrasesHandler(enable_sentry=False, raise_errors=True)
            yield handler

    def test_sensitive_phrases_handler_delete_with_success(self, test_context, handler):
        old_test_event = {
            "httpMethod": "GET",
            "queryStringParameters": {},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}, "httpMethod": "GET"},
        }
        resp = handler.handle(old_test_event, test_context)
        old_body = json_tools.loads(resp["body"])

        print(f"Body: {old_body}")
        test_event = {
            "httpMethod": "DELETE",
            "queryStringParameters": {
                "phrase": old_body[0]["phrase"],
                "id": old_body[0]["id"],
            },
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}, "httpMethod": "DELETE"},
        }
        resp = handler.handle(test_event, test_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body == f"Successfully deleted phrase: {old_body[0]['phrase']}"

    @pytest.mark.parametrize(
        "test_phrase", ["this should pass", "this-should-pass", "this should pass!", "!  ", "     "]
    )
    def test_sensitive_phrases_handler_post_with_success(self, test_phrase, test_context, handler):
        # add phrase to dynamo table
        test_event = {
            "httpMethod": "POST",
            "queryStringParameters": {"phrase": test_phrase, "exact": "false"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}, "httpMethod": "POST"},
        }
        resp = handler.handle(test_event, test_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body == f"Successfully added {test_phrase}"

        # fetch words from dynamo
        test_event = {
            "httpMethod": "GET",
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}, "httpMethod": "GET"},
        }
        resp = handler.handle(test_event, test_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        body == [
            {"exact": False, "id": "e1f94a093cd84f6f84e2e29e0ce38b7c", "phrase": "test-mally"},
            {
                "exact": False,
                "id": ANY,
                "phrase": test_phrase,
            },
        ]

    @pytest.mark.parametrize("test_phrase", ["", "\n     ", "\t", "t" * 51])
    def test_sensitive_phrases_handler_post_with_failure(self, test_phrase, test_context, handler):
        # add phrase to dynamo table
        test_event = {
            "httpMethod": "POST",
            "queryStringParameters": {"phrase": test_phrase, "exact": "false"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}, "httpMethod": "POST"},
        }
        resp = handler.handle(test_event, test_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 422
        assert body["message"] == f"Unprocessable sensitive phrase: {test_phrase}"
