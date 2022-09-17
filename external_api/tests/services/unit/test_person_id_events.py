from unittest.mock import patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.person_id_events.person_id_events_handler import PersonIdEventsHandler


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestPersonIdEventsHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

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
                "event_name": "download",
                "event_type": "access",
                "doc_id": "fake-doc-id-2",
                "doc_title": "fake-doc-title-2",
                "id_time": "2021-06-10T17:48:41",
                "originating_app_id": None,
                "actor_email": "bobbie@thoughtlabs.io",
                "target_user": None,
                "ipaddress": "fake-ip-address",
                "visibility": "private",
            },
            {
                "id_uniqueQualifier": "3",
                "event_name": "change_user_access",
                "event_type": "acl_change",
                "doc_id": "fake-doc-id-3",
                "doc_title": "fake-doc-title-3",
                "id_time": "2021-06-10T17:48:41",
                "originating_app_id": None,
                "actor_email": "bobbie@thoughtlabs.io",
                "target_user": None,
                "new_value": "private",
                "ipaddress": "fake-ip-address",
                "visibility": "private",
            },
            {
                "id_uniqueQualifier": "4",
                "event_name": "change_user_access",
                "event_type": "acl_change",
                "doc_id": "fake-doc-id-4",
                "doc_title": "fake-doc-title-4",
                "id_time": "2021-06-10T17:48:41",
                "originating_app_id": None,
                "actor_email": "nyah@thoughtlabs.io",
                "target_user": "bobbie@thoughtlabs.io",
                "ipaddress": "fake-ip-address",
                "visibility": "private",
            },
            {
                "id_uniqueQualifier": "5",
                "event_name": "change_user_access",
                "event_type": "acl_change",
                "doc_id": "fake-doc-id-5",
                "doc_title": "fake-doc-title-5",
                "id_time": "2021-06-10T17:48:41",
                "originating_app_id": None,
                "actor_email": "bobbie@thoughtlabs.io",
                "target_user": "check.nyah@gmail.com",
                "ipaddress": "fake-ip-address",
                "visibility": "shared_externally",
            },
        ]

    @pytest.fixture
    def ms_audit_sharepoint(self, mysql_connect, ms_audit_sharepoint_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            MicrosoftTableNames.MS_SHAREPOINT.value,
            ms_audit_sharepoint_data,
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
    def ms_sites_drives(self, mysql_connect, ms_sites_drives_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            MicrosoftTableNames.MS_SITES.value,
            ms_sites_drives_data,
        )

    @pytest.fixture
    def handler(self, mock_config, users_manager, user_generator, mysql_connect):
        configs_p = patch.object(PersonIdEventsHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            PersonIdEventsHandler, "sql_connect", return_value=mysql_connect
        )
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(PersonIdEventsHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = PersonIdEventsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "person-id-events"
        return lambda_context

    @pytest.mark.parametrize(
        "event_type, event_names",
        [
            ("appdownloads", ["download", "FileDownloaded"]),
            ("persondownloads", ["download", "FileDownloaded"]),
            ("sharedWith", ["change_user_access", "CompanyLinkCreated"]),
            ("sharedBy", ["change_user_access", "SharingSet"]),
            ("fake-type", ["download", "SharingSet"]),
        ],
    )
    @pytest.mark.parametrize("platform_value", ['["gsuite"]', '["o365"]'])
    def test_person_id_events_handler_by_platform(
        self,
        handler,
        lambda_context,
        platform_value,
        event_type,
        event_names,
        ms_audit_sharepoint,
        ms_drives_docs,
        ms_drives_docs_permissions,
        ms_sites_drives,
        platform,
        drive_v3_filesmeta,
        admin_reports_v1_drive,
        user_generator,
    ):

        test_event = {
            "pathParameters": {"personId": "bobbie@thoughtlabs.io"},
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

    def test_person_id_events_handler_with_bad_test_event(
        self,
        lambda_context,
        handler,
        ms_audit_sharepoint,
        ms_drives_docs,
        ms_drives_docs_permissions,
        ms_sites_drives,
        platform,
        drive_v3_filesmeta,
        admin_reports_v1_drive,
    ):
        bad_test_event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}
        response = handler.handle(bad_test_event, lambda_context)
        assert response["statusCode"] == 400
