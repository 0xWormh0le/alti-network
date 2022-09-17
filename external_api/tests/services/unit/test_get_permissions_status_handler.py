from unittest.mock import patch

import pytest
from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.get_permissions_status.get_permissions_status_handler import (
    GetPermissionsStatusHandler,
)


@pytest.mark.parametrize("platform_v", [Platform.GSUITE, Platform.O365])
@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestGetPermissionsStatusHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "get-permissions-status"
        return lambda_context

    @pytest.fixture
    def ms_drives_docs_permissions(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            MicrosoftTableNames.MS_DRIVES_PERMISSIONS.value,
            [
                {
                    "id_db": 1,
                    "dt_created": "2021-05-19 00:55:21",
                    "dt_modified": "2021-06-19 00:55:21",
                    "ms_id": "ms-id-1",
                    "ms_drive_id": "new-o365-drive-id",
                    "ms_doc_id": "016MCEIVFUWWODSSBS4VFIU",
                    "roles": "owner",
                    "has_password": "0",
                    "link_prevents_download": "0",
                    "link_scope": "anonymous",
                    "link_type": "edit",
                    "link_web_url": None,
                    "granted_to_type": "user",
                    "granted_to_email": "check.nyah@gmail.com",
                    "permission_status": None,
                },
                {
                    "id_db": 2,
                    "dt_created": "2021-05-19 00:55:21",
                    "dt_modified": "2021-06-19 00:55:21",
                    "ms_id": "ms-id-1",
                    "ms_drive_id": "new-o365-drive-id",
                    "ms_doc_id": "016MCEIVFUWWODSSBS4VFIU",
                    "roles": "owner",
                    "link_type": "edit",
                    "link_web_url": None,
                    "granted_to_type": "user",
                    "granted_to_email": "nyahc@tech.biz",
                    "permission_status": None,
                },
            ],
        )

    @pytest.fixture
    def risks_files(self, mysql_connect, risks_files_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.RISKS_FILES.value,
            risks_files_data,
        )

    @pytest.fixture
    def drive_v3_filesmeta(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "drive_v3_filesmeta",
            [
                {
                    "file_id": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                    "file_name": "Private personal secret secure financial - edited again",
                    "file_mimeType": "application/vnd.google-apps.document",
                    "trashed": False,
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document",
                    "createdTime": "2019-04-05T17:30:33",
                    "modifiedTime": "2020-07-10T17:48:41",
                    "owners_emailAddress": "michael@thoughtlabs.io",
                    "permissions_id": "01418317513357223822",
                    "permissions_type": "user",
                    "permissions_emailAddress": "michael@thoughtlabs.io",
                    "permissions_displayName": "Michael Coates",
                    "permissions_role": "owner",
                    "permissions_domain": None,
                    "permissions_allowFileDiscovery": True,
                    "permissions_status": None,
                },
                {
                    "file_id": "1BuZUfN1vykrDjPi6zlEr8CtoIwiYQJ1n",
                    "file_name": "dependency_links.txt",
                    "file_mimeType": "application/vnd.google-apps.document",
                    "trashed": False,
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document",
                    "createdTime": "2019-04-05T17:30:33",
                    "modifiedTime": "2020-11-16T17:48:41",
                    "owners_emailAddress": "michael@thoughtlabs.io",
                    "permissions_id": "01418314232403493553834",
                    "permissions_type": "user",
                    "permissions_emailAddress": "nyah@thoughtlabs.biz",
                    "permissions_displayName": "Nyah Check",
                    "permissions_role": "write",
                    "permissions_domain": None,
                    "permissions_allowFileDiscovery": True,
                    "permissions_status": "PENDING",
                },
                {
                    "file_id": "195AwU1HlKBdOWTXzfF_irREGfqMDB1d4",
                    "file_name": "requirements-specs.doc",
                    "file_mimeType": "application/vnd.google-apps.document",
                    "trashed": False,
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document",
                    "createdTime": "2019-04-05T17:30:33",
                    "modifiedTime": "2020-11-16T17:48:41",
                    "owners_emailAddress": "michael@thoughtlabs.io",
                    "permissions_id": "4239403049230923348024",
                    "permissions_type": "user",
                    "permissions_emailAddress": "check.nyah@gmail.com",
                    "permissions_displayName": "Nyah Check",
                    "permissions_role": "read",
                    "permissions_domain": None,
                    "permissions_allowFileDiscovery": True,
                    "permissions_status": "REMOVED",
                },
                {
                    "file_id": "4823984lr2li3eli2eli",
                    "file_name": "DC Metro plan.docx",
                    "file_mimeType": "application/vnd.google-apps.document",
                    "trashed": False,
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document",
                    "createdTime": "2019-04-05T17:30:33",
                    "modifiedTime": "2020-11-16T17:48:41",
                    "owners_emailAddress": "nyah@thoughtlabs.io",
                    "permissions_id": "42802038238534944829",
                    "permissions_type": "user",
                    "permissions_emailAddress": "nyahc@tech.biz",
                    "permissions_displayName": "Nyah Check",
                    "permissions_role": "read",
                    "permissions_domain": None,
                    "permissions_allowFileDiscovery": True,
                    "permissions_status": "REMOVED",
                },
                {
                    "file_id": "482398SSEE3LDL3.WE",
                    "file_name": "San Francisco Chronicle meeting.txt",
                    "file_mimeType": "application/vnd.google-apps.document",
                    "trashed": False,
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "iconLink": "https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document",
                    "createdTime": "2019-04-05T17:30:33",
                    "modifiedTime": "2020-11-16T17:48:41",
                    "owners_emailAddress": "nyah@thoughtlabs.io",
                    "permissions_id": "5593485281327382",
                    "permissions_type": "user",
                    "permissions_emailAddress": "nyah-at-nasak@space.x",
                    "permissions_displayName": "Nyah Check",
                    "permissions_role": "read",
                    "permissions_domain": None,
                    "permissions_allowFileDiscovery": True,
                    "permissions_status": "PENDING",
                },
            ],
        )

    @pytest.fixture
    def email_identification(self, mysql_connect, email_identification_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.EMAIL_IDENTIFICATION.value,
            email_identification_data,
        )

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, users_manager, user_generator):
        configs_p = patch.object(GetPermissionsStatusHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            GetPermissionsStatusHandler, "sql_connect", return_value=mysql_connect
        )
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(GetPermissionsStatusHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = GetPermissionsStatusHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.mark.parametrize(
        "platform_value, response_value",
        [
            (
                "gsuite",
                {"active": 0, "completed": 1, "failed": 0, "pending": 1, "totalCount": 2},
            ),
            ("o365", {"active": 0, "completed": 0, "failed": 0, "pending": 0, "totalCount": 0}),
        ],
    )
    def test_get_permissions_status_for_risk_id(
        self,
        handler,
        lambda_context,
        risks_files,
        drive_v3_filesmeta,
        email_identification,
        ms_drives_docs_permissions,
        platform_value,
        response_value,
        platform_v,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "gtereflig4392398ge2l3i323984293",
                "platform-id": platform_value,
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body == response_value

    def test_get_permissions_status_for_email(
        self,
        handler,
        lambda_context,
        risks_files,
        drive_v3_filesmeta,
        email_identification,
        ms_drives_docs_permissions,
        platform_v,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "email": "bobbie@thoughtlabs.io",
                "platform-id": platform_v.value,
            },
        }

        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body == {"active": 0, "completed": 0, "failed": 0, "pending": 0, "totalCount": 0}

    def test_get_permissions_status_with_bad_test_events(
        self,
        handler,
        lambda_context,
        risks_files,
        drive_v3_filesmeta,
        email_identification,
        ms_drives_docs_permissions,
        platform_v,
    ):
        # event without risk-id or email
        bad_test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "file-id": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY428392",
                "platform-id": platform_v.value,
            },
        }

        bad_event_response = {
            "active": 0,
            "completed": 0,
            "failed": 0,
            "pending": 0,
            "totalCount": 0,
        }

        resp = handler.handle(bad_test_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body == bad_event_response

        bad_test_input = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {},
        }
        resp_2 = handler.handle(bad_test_input, lambda_context)
        body_2 = json_tools.loads(resp["body"])
        assert resp_2["statusCode"] == 200
        assert body_2 == bad_event_response
