from unittest.mock import patch

import pytest
from callee import Glob
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.folder_id.folder_id_handler import FolderIdHandler

folder_by_platform_events = [
    (
        {
            "pathParameters": {"folderId": "082948x3l48"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"platform-id": "gsuite"},
        },
        {
            "fileCount": 5,
            "folderId": "082948x3l48",
            "folderName": "fake-documents-folder",
            "parentFolder": {"folderId": "fake-root-folder", "folderName": ""},
            "parent_folder_id": "fake-root-folder",
            "parent_folder_name": None,
            "platformId": "gsuite",
            "platform_name": "Google Workspace",
        },
    ),
    (
        {
            "pathParameters": {"folderId": "01D3GIE3GV6Y2GOVW442325BZO354PWSELRRZ"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"platform-id": "o365"},
        },
        {
            "fileCount": 5,
            "folderId": "01D3GIE3GV6Y2GOVW442325BZO354PWSELRRZ",
            "folderName": "top-level-folder",
            "parentFolder": {"folderId": "", "folderName": ""},
            "parent_folder_id": None,
            "parent_folder_name": None,
            "platformId": "o365",
            "platform_name": "Microsoft Office 365",
        },
    ),
]


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
@pytest.mark.usefixtures("dynamodb_local")
class TestFolderIdHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "folder-id"
        return lambda_context

    @pytest.fixture
    def handler(self, mock_config, mysql_connect):
        configs_p = patch.object(FolderIdHandler, "configs", mock_config)
        sql_connect_p = patch.object(FolderIdHandler, "sql_connect", return_value=mysql_connect)
        with configs_p, sql_connect_p:
            handler = FolderIdHandler(enable_sentry=False, raise_errors=True)
            yield handler

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
    def risks_files(self, mysql_connect, risks_files_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.RISKS_FILES.value,
            risks_files_data,
        )

    @pytest.fixture
    def drive_v3_filesmeta(self, mysql_connect, drive_v3_filesmeta_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.FILESMETA.value,
            drive_v3_filesmeta_data,
        )

    @pytest.mark.parametrize("test_event, test_results", folder_by_platform_events)
    def test_folder_id_with_folder_info_by_platform(
        self,
        test_event,
        test_results,
        drive_v3_filesmeta,
        platform,
        risks_files,
        ms_drives_docs,
        lambda_context,
        handler,
    ):
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # verify success
        assert resp["statusCode"] == 200
        assert body == test_results

    def test_folder_id_handler_with_bad_folder_id_on_gsuite(
        self,
        drive_v3_filesmeta,
        platform,
        risks_files,
        ms_drives_docs,
        lambda_context,
        handler,
    ):
        bad_test_event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}
        response = handler.handle(bad_test_event, lambda_context)
        assert response["statusCode"] == 400

        bad_test_event_2 = {
            "requestContext": {"authorizer": {"project_id": "test-project"}},
            "pathParameters": {"folderId": "WeirdBadFolderId"},
        }
        response_2 = handler.handle(bad_test_event_2, lambda_context)
        assert response_2["statusCode"] == 400

    def test_folder_id_handler_with_missing_folder_metadata_on_gsuite(
        self,
        drive_v3_filesmeta,
        platform,
        risks_files,
        ms_drives_docs,
        lambda_context,
        handler,
    ):
        bad_test_event = {
            "requestContext": {"authorizer": {"project_id": "test-project"}},
            "pathParameters": {"folderId": "0AD48298EDLDIO9PVA"},
        }
        response = handler.handle(bad_test_event, lambda_context)
        body = json_tools.loads(response["body"])
        assert response["statusCode"] == 200
        assert not body

    def test_folder_id_handler_with_unsupported_platform_id(
        self,
        drive_v3_filesmeta,
        platform,
        risks_files,
        ms_drives_docs,
        lambda_context,
        handler,
    ):
        bad_test_event = {
            "requestContext": {"authorizer": {"project_id": "test-project"}},
            "pathParameters": {"folderId": "0AD48298EDLDIO9PVA"},
            "queryStringParameters": {"platform-id": "slack"},
        }
        response = handler.handle(bad_test_event, lambda_context)
        body = json_tools.loads(response["body"])

        assert response["statusCode"] == 400
        assert body["message"] == Glob("unconfigured *: slack", case=False)
