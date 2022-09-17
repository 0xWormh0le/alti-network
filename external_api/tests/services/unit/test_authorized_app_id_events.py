from unittest.mock import patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.authorized_app_id_events.authorized_app_id_events_handler import (
    AuthorizedAppIdEventsHandler,
)


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestAuthorizedAppIdEventsHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture
    def ms_audit_sharepoint_table_data(self):
        return [
            {
                "id_db": "1",
                "ms_id": "1",
                "ms_dt_created": "2021-06-10T17:48:41",
                "operation": "FileDownloaded",
                "record_type": "SharePoint",
                "organization_id": "new-org",
                "user_id": None,
                "ms_doc_id": "fake-doc-id",
                "ms_drive_id": "fake-drive-id",
                "client_ip": "fake-ip-address",
                "app_id": "unknown-app-id",
            },
            {
                "id_db": "2",
                "ms_id": "2",
                "ms_dt_created": "2021-06-10T17:48:41",
                "operation": "FileDownloaded",
                "record_type": "SharePoint",
                "organization_id": "new-org",
                "user_id": None,
                "ms_doc_id": "fake-doc-id-2",
                "ms_drive_id": "fake-drive-id",
                "client_ip": "fake-ip-address",
                "app_id": "unknown-app-id",
            },
            {
                "id_db": "3",
                "ms_id": "3",
                "ms_dt_created": "2021-06-10T17:48:41",
                "operation": "AddedToSecureLink",
                "record_type": "SharePointSharingOperation",
                "organization_id": "new-org",
                "user_id": None,
                "ms_doc_id": "fake-doc-id-3",
                "ms_drive_id": "fake-drive-id",
                "client_ip": "fake-ip-address",
                "app_id": "unknown-app-id",
            },
            {
                "id_db": "4",
                "ms_id": "4",
                "ms_dt_created": "2021-06-10T17:48:41",
                "operation": "CompanyLinkCreated",
                "record_type": "SharePointSharingOperation",
                "organization_id": "new-org",
                "user_id": "nyah@thoughtlabs.io",
                "target_name": "bobbie@thoughtlabs.io",
                "ms_doc_id": "fake-doc-id-4",
                "ms_drive_id": "fake-drive-id",
                "client_ip": "fake-ip-address",
                "app_id": "unknown-app-id",
            },
            {
                "id_db": "5",
                "ms_id": "5",
                "ms_dt_created": "2021-06-10T17:58:51",
                "operation": "SharingSet",
                "record_type": "SharePointSharingOperation",
                "organization_id": "new-org",
                "user_id": None,
                "target_name": "check.nyah@gmail.com",
                "ms_doc_id": "fake-doc-id-5",
                "ms_drive_id": "fake-drive-id",
                "client_ip": "fake-ip-address",
                "app_id": "unknown-app-id",
            },
        ]

    @pytest.fixture
    def admin_reports_drive_table(self):
        return [
            {
                "id_uniqueQualifier": "1",
                "event_name": "download",
                "event_type": "access",
                "doc_id": "fake-doc-id",
                "doc_title": "fake-doc-title",
                "id_time": "2021-06-10T17:48:41",
                "originating_app_id": "unknown-app-id",
                "actor_email": "bobbie@thoughtlabs.io",
                "target_user": None,
                "ipaddress": "fake-ip-address",
                "visibility": "private",
            },
            {
                "id_uniqueQualifier": "2",
                "event_name": "change_user_access",
                "event_type": "acl_change",
                "doc_id": "fake-doc-id",
                "doc_title": "fake-doc-title",
                "id_time": "2021-06-10T17:48:41",
                "originating_app_id": "unknown-app-id",
                "actor_email": "unknown-app-id",
                "target_user": "nyah@thoughtlabs.io",
                "ipaddress": "fake-ip-address",
                "visibility": "private",
            },
        ]

    @pytest.fixture
    def ms_audit_sharepoint(self, mysql_connect, ms_audit_sharepoint_table_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            MicrosoftTableNames.MS_SHAREPOINT.value,
            ms_audit_sharepoint_table_data,
        )

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
    def drive_v3_filesmeta(self, mysql_connect, drive_v3_filesmeta_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.FILESMETA.value,
            drive_v3_filesmeta_data,
        )

    @pytest.fixture
    def admin_reports_v1_drive(self, mysql_connect, admin_reports_drive_table):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.ADMIN_REPORTS.value,
            admin_reports_drive_table,
        )

    @pytest.fixture
    def handler(self, mock_config, users_manager, user_generator, mysql_connect):
        configs_p = patch.object(AuthorizedAppIdEventsHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            AuthorizedAppIdEventsHandler, "sql_connect", return_value=mysql_connect
        )
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(AuthorizedAppIdEventsHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = AuthorizedAppIdEventsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "authorized-app-id-events"
        return lambda_context

    @pytest.mark.parametrize(
        "event_type, event_names",
        [
            ("downloads", ["download", "FileDownloaded"]),
            ("added", ["change_user_access", "SharingSet"]),
            ("sharedWith", ["change_user_access", "SharingSet"]),
            ("sharedBy", ["change_user_access", "SharingSet"]),
        ],
    )
    @pytest.mark.parametrize("platform_value", ['["gsuite"]', '["o365"]'])
    def test_app_id_events_handler_by_platform(
        self,
        handler,
        lambda_context,
        platform_value,
        event_type,
        event_names,
        ms_audit_sharepoint,
        ms_drives_docs,
        ms_drives_docs_permissions,
        platform,
        drive_v3_filesmeta,
        admin_reports_v1_drive,
        user_generator,
    ):

        test_event = {
            "pathParameters": {"applicationId": "unknown-app-id"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "page-number": "1",
                "page-size": "10",
                "platform-ids": platform_value,
                "event-type": event_type,
            },
        }
        ev_name = event_names[0] if platform_value == '["gsuite"]' else event_names[1]

        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert handler.event_category == event_type
        assert body["eventType"] == handler.event_category
        assert body["events"][0]["eventName"] == ev_name
        assert body["events"][0]["eventDescription"] == "unknown"
        assert body["events"][0]["ipAddress"] == "fake-ip-address"

    def test_authorized_app_id_events_handler_failure(
        self,
        handler,
        lambda_context,
        ms_audit_sharepoint,
        ms_drives_docs,
        ms_drives_docs_permissions,
        platform,
        drive_v3_filesmeta,
        admin_reports_v1_drive,
        user_generator,
    ):
        input_event = {
            "requestContext": {"authorizer": {"project_id": "test-project"}},
            "pathParameters": {"applicationId": ""},
        }
        response = handler.handle(input_event, lambda_context)
        assert response["statusCode"] == 400

    @pytest.mark.xfail(
        reason="<https://altitudenetworks.atlassian.net/browse/API-80> will make this work"
    )
    def test_event_name(self, lambda_context, handler):
        raw_event = {
            "requestContext": {"authorizer": {"project_id": "test-project"}},
            "pathParameters": {"applicationId": "42"},
            "queryStringParameters": {"event-name": "downloads"},
        }
        handler.handle(raw_event, lambda_context)
        assert not handler.event_type
        assert handler.event_name == "downloads"
