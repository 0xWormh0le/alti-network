import os
from unittest.mock import patch

import pytest
from callee import Glob
from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import LambdaEvent
from tools.lambda_handler.lambda_context import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate

test_risk_type_ids = [
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"risk-type-ids": None},
        },
        set(),
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"risk-type-ids": ""},
        },
        set(),
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"risk-type-ids": "[]"},
        },
        set(),
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"risk-type-ids": "[3010]"},
        },
        {3010},
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"risk-type-ids": "[3010, 3011]"},
        },
        {3010, 3011},
    ),
]

test_platforms = [
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"platform-id": "o365", "platform-ids": '["o365", "gsuite"]'},
        },
        ((Platform.O365), [Platform.GSUITE, Platform.O365]),
    ),
]


test_unconfigured_platforms = [
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "platform-id": "salesforce",
                "platform-ids": '["salesforce", "gsuite"]',
            },
        },
        ((Platform.SALESFORCE), [Platform.GSUITE, Platform.SALESFORCE]),
    ),
]


class TestExternalApiHandlerTemplate:
    class Handler(ExternalApiHandlerTemplate):
        def get_response(self, event):
            self.platform
            self.platforms

    @pytest.fixture
    def raw_lambda_context(self):
        return get_dummy_context()

    @pytest.fixture
    def handler(self, mock_config, mysql_route):
        configs_p = patch.object(self.Handler, "configs", mock_config)
        sql_connect_p = patch.object(
            self.Handler,
            "sql_connect",
            return_value=SQLConnect(mysql_route),
        )
        with configs_p, sql_connect_p:
            handler = TestExternalApiHandlerTemplate.Handler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.mark.parametrize("test_event, test_result", test_risk_type_ids)
    def test_risk_type_ids(self, test_event, test_result, handler, mock_config, raw_lambda_context):
        response = handler.handle(test_event, raw_lambda_context)
        assert handler.risk_type_ids == test_result

    @pytest.mark.parametrize("test_event, test_results", test_platforms)
    def test_platforms(self, test_event, test_results, handler, mock_config, raw_lambda_context):
        response = handler.handle(test_event, raw_lambda_context)
        assert handler.platform == test_results[0]
        assert handler.platforms == test_results[1]

    @pytest.mark.parametrize("test_event, test_results", test_unconfigured_platforms)
    def test_unconfigured_platforms(
        self, test_event, test_results, handler, mock_config, raw_lambda_context
    ):
        response = handler.handle(test_event, raw_lambda_context)
        assert response["statusCode"] == 400
        assert json_tools.loads(response["body"]) == {
            "message": Glob("unconfigured *: salesforce", case=False)
        }

    def test_bad_platform_and_ids(self, handler, mock_config, raw_lambda_context):
        raw_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"platform-id": "0365", "platform-ids": ["google"]},
        }
        response = handler.handle(raw_event, raw_lambda_context)
        assert response["statusCode"] == 400
        assert response["body"] == '{"message": "Invalid platform value: 0365"}'

    def test_is_internal(self, handler, mock_config):
        is_internal = handler.is_internal(email="email@thoughtlabs.io")
        assert is_internal

    def test_run_read_query(self, handler):
        query_string = "SELECT %(foo)s AS everything"
        query_params = {"foo": 42}

        def response_mapper(r):
            return r["everything"] // 2

        handler._event = LambdaEvent({})
        result = handler.run_read_query(
            query_string=query_string,
            query_params=query_params,
            response_mapper=response_mapper,
        )
        assert result == [21]
        assert handler._query_stats == {"found_rows": 1}

    @pytest.mark.xfail(
        reason="<https://altitudenetworks.atlassian.net/browse/API-79> will make this work"
    )
    def test_event_category(self, raw_lambda_context, handler):
        raw_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"event-category": "sharedBy"},
        }
        handler.handle(raw_event, raw_lambda_context)
        assert handler.event_category == "sharedBy"

    @pytest.mark.xfail(
        reason="<https://altitudenetworks.atlassian.net/browse/API-187> will make this work"
    )
    def test_page_size(self, raw_lambda_context, handler):
        raw_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"page-size": "4000"},
        }
        handler.handle(raw_event, raw_lambda_context)
        assert handler.page_size == 4000
