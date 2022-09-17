from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from services.get_file_id_permissions.get_file_id_permissions_handler import (
    GetFileIdPermissionsHandler,
)


@pytest.mark.parametrize("platform", [Platform.GSUITE, Platform.O365])
class TestGetFileIdPermissionsHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "get-file-id-permissions"
        return lambda_context

    @pytest.fixture
    def platform_records(self, mysql_connect, platform_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "platform",
            platform_data,
        )

    @pytest.fixture
    def drive_v3_filesmeta(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "drive_v3_filesmeta",
            [
                {
                    "file_id": "file_id_1",
                    "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                    "permissions_type": "user",
                    "permissions_status": "ACTIVE",
                    "permissions_emailAddress": "user_1@barracuda.io",
                    "permissions_role": "owner",
                    "permissions_allowFileDiscovery": False,
                },
                {
                    "file_id": "file_id_1",
                    "permissions_id": "3d950a2752fa5570fd4a9c595ffe2230",
                    "permissions_type": "user",
                    "permissions_status": "ACTIVE",
                    "permissions_emailAddress": "user_2@thoughtlabs.io",
                    "permissions_role": "writer",
                    "permissions_allowFileDiscovery": False,
                },
            ],
        )

    @pytest.fixture
    def ms_docs_permissions(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "ms_drives_docs_permissions",
            [
                {
                    "ms_doc_id": "file_id_1",
                    "ms_id": "id_one",
                    "link_scope": "domain",
                    "granted_to_type": "user",
                    "granted_to_email": "user_1@barracuda.io",
                    "granted_to_id": "granted_to_id_1",
                },
                {
                    "ms_doc_id": "file_id_1",
                    "ms_id": "id_two",
                    "link_scope": "domain",
                    "granted_to_type": "user",
                    "granted_to_email": "user_2@thoughtlabs.io",
                    "granted_to_id": "granted_to_id_1",
                },
            ],
        )

    @pytest.fixture
    def handler(self, mock_config, mysql_connect):
        configs_p = patch.object(GetFileIdPermissionsHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            GetFileIdPermissionsHandler, "sql_connect", return_value=mysql_connect
        )
        with configs_p, sql_connect_p:
            handler = GetFileIdPermissionsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    def test_handler(
        self,
        platform_records,
        drive_v3_filesmeta,
        ms_docs_permissions,
        lambda_context,
        handler,
        platform,
        platform_data,
    ):
        test_event = {
            "pathParameters": {"fileId": "file_id_1"},
            "requestContext": {"authorizer": {"project_id": "barracuda"}},
            "queryStringParameters": {
                "order-by": "permissions-emailaddress",
                "platform-id": platform.value,
            },
        }

        platform_symbolic_name_by_name_map = {
            platform["symbolic_name"]: platform["name"] for platform in platform_data
        }
        resp = handler.handle(test_event, lambda_context)

        assert resp["statusCode"] == 200
        body = json_tools.loads(resp["body"])

        assert body == {
            "orderBy": "permissions_emailaddress",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "permissions": [
                {
                    "discoverable": False,
                    "permissionEmailAddress": "user_2@thoughtlabs.io",
                    "permissionId": "3d950a2752fa5570fd4a9c595ffe2230",
                    "platformId": platform.value,
                    "platformName": platform_symbolic_name_by_name_map[platform.value],
                    "role": "write",
                    "shared": "internal",
                    "type": "user",
                },
                {
                    "discoverable": False,
                    "permissionEmailAddress": "user_1@barracuda.io",
                    "permissionId": "af0c0c1c72fa5e716ff2dad135d95b5a",
                    "platformId": platform.value,
                    "platformName": platform_symbolic_name_by_name_map[platform.value],
                    "role": "write",
                    "shared": "external",
                    "type": "user",
                },
            ],
            "permissionsCount": 2,
            "platformId": platform.value,
            "sort": "DESC",
        }

    def test_response_with_not_existing_file(
        self,
        platform,
        drive_v3_filesmeta,
        lambda_context,
        handler,
    ):
        new_test_event = {
            "pathParameters": {"fileId": "non-existing-id"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "page-size": "01",
                "platform-id": platform.value,
            },
        }
        new_resp = handler.handle(new_test_event, lambda_context)
        assert new_resp["statusCode"] == 200
        body = json_tools.loads(new_resp["body"])
        assert body == {
            "orderBy": "permissions_id",
            "pageCount": 0,
            "pageCountCacheTTL": ANY,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 1,
            "permissions": [],
            "permissionsCount": 0,
            "platformId": platform.value,
            "sort": "DESC",
        }

    def test_get_file_id_permissions_handler_with_bad_test_event(
        self,
        drive_v3_filesmeta,
        platform,
        lambda_context,
        handler,
    ):
        test_event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}
        response = handler.handle(test_event, lambda_context)
        assert response["statusCode"] == 400

        test_event = {
            "pathParameters": {"fileId": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"order-by": "invalid-order-by"},
        }
        response = handler.handle(test_event, lambda_context)
        assert response["statusCode"] == 400

        test_event = {
            "pathParameters": {"fileId": "1O_uFvP-OXajpmZHB9NssdOyeQcJOxYMg"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {},
        }
        response = handler.handle(test_event, lambda_context)
        assert response["statusCode"] == 200
        assert handler.order_by == "permissions_id"
