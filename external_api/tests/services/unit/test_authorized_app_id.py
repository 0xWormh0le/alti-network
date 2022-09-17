import importlib.resources as pkg_resources
from inspect import cleandoc as trim
from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.logger import Logger
from tools.sql import SQLConnect

from services.authorized_app_id.authorized_app_id_handler import AuthorizedAppIdHandler
from tests import payloads


class TestAuthorizedAppIdHandler:
    def clear_tables(self, sql_connect):
        with sql_connect.open():
            table_name = "admin_directory_v1_tokens"
            sql_connect.execute_query(f"DELETE FROM {table_name}")

    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return json_tools.loads(
            pkg_resources.read_text(payloads, "test_event_authorized_app_id.json")
        )

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "authorized-app-id"
        return lambda_context

    @pytest.fixture
    def handler(self, mock_config, mysql_connect):
        configs_p = patch.object(AuthorizedAppIdHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            AuthorizedAppIdHandler, "sql_connect", return_value=mysql_connect
        )
        with configs_p, sql_connect_p:
            handler = AuthorizedAppIdHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def admin_directory_v1_tokens(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "admin_directory_v1_tokens",
            [
                {
                    "id_db": "1",
                    "kind": "admin#directory#token",
                    "etag": "'GPUJN6YVAOElesyqxtgGs7jrFWY/GTZ5tOjbpz8HdJ2V_AHOZ_K-X60'",
                    "clientId": "261251194779.apps.googleusercontent.com",
                    "displayText": "Google APIs Explorer",
                    "anonymous": "0",
                    "nativeApp": "0",
                    "userKey": "106502887677037886472",
                    "scope": "https://www.googleapis.com/auth/admin.directory.orgunit",
                    "dt_created": "2018-06-07 03:28:58",
                    "dt_modified": "2019-02-21 10:00:26",
                    "has_marketplace_app": None,
                    "marketplace_icon": None,
                },
            ],
        )

    def test_authorized_app_id_handler_success(
        self,
        admin_directory_v1_tokens,
        lambda_event,
        lambda_context,
        handler,
    ):
        resp = handler.handle(lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # assert statements
        assert resp["statusCode"] == 200
        assert body == {
            "id": "261251194779",
            "imageURI": None,
            "marketplaceURI": None,
            "name": "Google APIs Explorer",
            "grants": ["https://www.googleapis.com/auth/admin.directory.orgunit"],
        }

    def test_authorized_app_id_handler_failure(self, lambda_context, handler):
        input_event = {
            "requestContext": {"authorizer": {"project_id": "test-project"}},
            "pathParameters": {"applicationId": None},
        }
        response = handler.handle(input_event, lambda_context)
        assert response["statusCode"] == 400
