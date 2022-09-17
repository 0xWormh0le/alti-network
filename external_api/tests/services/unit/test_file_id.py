from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.file_id.file_id_handler import FileIdHandler


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestFileIdHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return {
            "pathParameters": {"fileId": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
        }

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "file-id"
        return lambda_context

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, users_manager, user_generator):
        configs_p = patch.object(FileIdHandler, "configs", mock_config)
        sql_connect_p = patch.object(FileIdHandler, "sql_connect", return_value=mysql_connect)
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(FileIdHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = FileIdHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def ms_drives_docs_permissions(self, mysql_connect, ms_drives_docs_permissions_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            MicrosoftTableNames.MS_DRIVES_PERMISSIONS.value,
            ms_drives_docs_permissions_data,
        )

    @pytest.fixture
    def ms_drives_docs(self, mysql_connect, ms_drives_docs_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            MicrosoftTableNames.MS_DRIVES_DOCS.value,
            ms_drives_docs_data,
        )

    @pytest.fixture
    def platform(self, mysql_connect, platform_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.PLATFORM.value,
            platform_data,
        )

    @pytest.fixture
    def top_risks(self, mysql_connect, top_risks_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.TOP_RISKS.value,
            top_risks_data,
        )

    @pytest.fixture
    def risks_files(self, mysql_connect, risks_files_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.RISKS_FILES.value,
            risks_files_data,
        )

    @pytest.fixture
    def files_content_inspection(self, mysql_connect, files_content_inspection_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.CONTENT_INSPECTION.value,
            files_content_inspection_data,
        )

    @pytest.fixture
    def drive_v3_filesmeta(self, mysql_connect, drive_v3_filesmeta_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.FILESMETA.value,
            drive_v3_filesmeta_data,
        )

    @pytest.fixture
    def admin_directory_v1_usersmeta(self, mysql_connect, admin_directory_v1_usersmeta_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.ADMIN_USERSMETA.value,
            admin_directory_v1_usersmeta_data,
        )

    def test_file_id_handler_for_gsuite(
        self,
        drive_v3_filesmeta,
        platform,
        risks_files,
        files_content_inspection,
        admin_directory_v1_usersmeta,
        ms_drives_docs,
        ms_drives_docs_permissions,
        top_risks,
        lambda_event,
        lambda_context,
        handler,
    ):
        resp = handler.handle(lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # verify success
        assert resp["statusCode"] == 200
        assert body == {
            "createdAt": 1554485433,
            "createdBy": {
                "accessLevel": "admin",
                "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                "emails": [
                    {"address": "mwcoates@gmail.com", "kind": "personal"},
                    {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                ],
                "externalCount": 1,
                "internal": True,
                "internalCount": 2,
                "name": {
                    "familyName": "Coates",
                    "fullName": "Michael Coates",
                    "givenName": "Michael",
                },
                "phones": [{"kind": "personal", "number": "+15555555555"}],
                "primaryEmail": {
                    "address": "michael@thoughtlabs.io",
                    "kind": "work",
                    "primary": True,
                },
                "projectId": "thoughtlabs",
                "userKind": "user",
            },
            "externalAccessCount": 0,
            "externalAccessList": [],
            "fileId": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
            "fileName": "Private personal secret secure financial - edited again",
            "webLink": "web_view_link_1",
            "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document",
            "internalAccessCount": 1,
            "internalAccessList": [
                {
                    "accessLevel": "owner",
                    "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                    "emails": [
                        {"address": "mwcoates@gmail.com", "kind": "personal"},
                        {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                    ],
                    "externalCount": 1,
                    "externalIds": [{"platform": "gsuite", "value": "01418317513357223822"}],
                    "internal": True,
                    "internalCount": 2,
                    "name": {
                        "familyName": "Coates",
                        "fullName": "Michael Coates",
                        "givenName": "Michael",
                    },
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {
                        "address": "michael@thoughtlabs.io",
                        "kind": "work",
                        "primary": True,
                    },
                    "projectId": "thoughtlabs",
                    "userKind": "user",
                }
            ],
            "lastIngested": ANY,
            "lastModified": 1594403321,
            "linkVisibility": "user",
            "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
            "mimeType": "document",
            "parentFolder": {"folderId": "082948x3l48", "folderName": "fake-documents-folder"},
            "platformId": "gsuite",
            "platformName": "Google Workspace",
            "sensitivePhrases": {
                "ccNum": 3,
                "sensitiveKeywords": [
                    {"count": 9, "keyword": "Attorney/Client"},
                    {"count": 6, "keyword": "board meeting"},
                    {"count": 2, "keyword": "proprietary"},
                    {"count": 1, "keyword": "Attorney"},
                    {"count": 0, "keyword": "invalid-key"},
                ],
                "ssn": 0,
            },
            "sharedToDomains": [{"name": "thoughtlabs.io", "permissionId": "01418317513357223822"}],
            "trashed": False,
        }

    def test_file_id_handler_for_o365(
        self,
        drive_v3_filesmeta,
        platform,
        risks_files,
        files_content_inspection,
        admin_directory_v1_usersmeta,
        ms_drives_docs,
        ms_drives_docs_permissions,
        lambda_context,
        handler,
    ):
        test_event = {
            "pathParameters": {"fileId": "016MCEIVFUWWODSSBS4VFIULB3J5EUDEIH"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"platform-id": "o365"},
        }

        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # verify success
        assert resp["statusCode"] == 200
        assert body == {
            "createdAt": 1604085446,
            "createdBy": {
                "accessLevel": "member",
                "internal": True,
                "internalCount": 1,
                "name": {
                    "familyName": "User",
                    "fullName": "Anonymous User",
                    "givenName": "Anonymous",
                },
                "primaryEmail": {
                    "address": "bobbie@thoughtlabs00.onmicrosoft.com",
                    "kind": "work",
                    "primary": True,
                },
                "projectId": "thoughtlabs",
                "userKind": "user",
            },
            "externalAccessCount": 0,
            "externalAccessList": [],
            "fileId": "016MCEIVFUWWODSSBS4VFIULB3J5EUDEIH",
            "fileName": "This is a document under Bobbie Shared Test Site.docx",
            "iconUrl": "",
            "webLink": "https://thoughtlabs00.sharepoint.com/sites/BobbieTestSharedSite/_layouts/15/Doc.aspx?sourcedoc=%7B399CB5B4-3248-4AE5-8A2C-3B4F49419107%7D&file=This%20is%20a%20document%20under%20Bobbie%20Shared%20Test%20Site.docx&action=default&mobileredirect=true",
            "internalAccessCount": 1,
            "internalAccessList": [
                {
                    "accessLevel": "owner",
                    "externalIds": [
                        {"platform": "o365", "value": "6fe0448102f73bc3680502d01dc42fe4"}
                    ],
                    "internal": True,
                    "internalCount": 1,
                    "name": {
                        "familyName": "User",
                        "fullName": "Anonymous User",
                        "givenName": "Anonymous",
                    },
                    "primaryEmail": {
                        "address": "AmirTestSharedSite@thoughtlabs00.onmicrosoft.com",
                        "kind": "work",
                        "primary": True,
                    },
                    "projectId": "thoughtlabs",
                    "userKind": "user",
                }
            ],
            "lastIngested": ANY,
            "lastModified": 1604085489,
            "linkVisibility": "external",
            "md5Checksum": "340254d6-4d75-4cb0-baf3-bcfce7ab1a56",
            "mimeType": "document",
            "parentFolder": {
                "folderId": "01D3GIE3GV6Y2GOVW442325BZO354PWSELRRZ",
                "folderName": "top-level-folder",
            },
            "platformId": "o365",
            "platformName": "Microsoft Office 365",
            "sensitivePhrases": {"ccNum": 0, "sensitiveKeywords": [], "ssn": 0},
            "sharedToDomains": [],
            "trashed": False,
        }

    def test_file_id_handler_with_bad_test_event(
        self,
        drive_v3_filesmeta,
        platform,
        risks_files,
        files_content_inspection,
        admin_directory_v1_usersmeta,
        ms_drives_docs,
        ms_drives_docs_permissions,
        lambda_context,
        handler,
    ):
        bad_test_event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}
        response = handler.handle(bad_test_event, lambda_context)
        assert response["statusCode"] == 400
