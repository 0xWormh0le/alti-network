from unittest.mock import ANY, patch

import pytest
from callee import Glob
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.person_id.person_id_handler import PersonIdHandler


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestPersonIdHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

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

    @pytest.fixture
    def email_identification(self, mysql_connect, email_identification_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.EMAIL_IDENTIFICATION.value,
            email_identification_data,
        )

    @pytest.fixture
    def handler(self, mock_config, users_manager, user_generator, mysql_connect):
        configs_p = patch.object(PersonIdHandler, "configs", mock_config)
        sql_connect_p = patch.object(PersonIdHandler, "sql_connect", return_value=mysql_connect)
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(PersonIdHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = PersonIdHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return {
            "pathParameters": {"personId": "nyah@thoughtlabs.io"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "platform-id": "gsuite",
            },
        }

    @pytest.fixture(scope="class")
    def lambda_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "person-id"
        return test_context

    def test_person_id_handler_on_gsuite(
        self,
        handler,
        lambda_event,
        lambda_context,
        email_identification,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        platform,
    ):
        resp = handler.handle(lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == {
            "accessCount": 2,
            "accessLevel": "admin",
            "altnetId": "515c7228-10e4-550c-8889-54fb39f9489b",
            "emails": [{"address": "neeya@tech.biz", "kind": "personal"}],
            "externalCount": 1,
            "internal": True,
            "internalCount": 1,
            "lastRemovedPermissions": ANY,
            "name": {"familyName": "Check", "fullName": "Nyah Check", "givenName": "Nyah"},
            "phones": [{"kind": "personal", "number": "+15555555555"}],
            "primaryEmail": {
                "accessCount": 2,
                "address": "nyah@thoughtlabs.io",
                "kind": "work",
                "primary": True,
                "riskCount": 1,
            },
            "projectId": "thoughtlabs",
            "riskCount": 1,
            "userKind": "user",
        }

    def test_person_id_handler_on_o365(
        self,
        handler,
        lambda_context,
        risks_files,
        ms_drives_docs,
        ms_drives_docs_permissions,
        platform,
    ):
        test_event = {
            "pathParameters": {"personId": "pulkit@thoughtlabs00.onmicrosoft.com"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"platform-id": "o365"},
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == {
            "accessLevel": "member",
            "internal": True,
            "internalCount": 1,
            "name": {"familyName": "User", "fullName": "Anonymous User", "givenName": "Anonymous"},
            "primaryEmail": {
                "address": "pulkit@thoughtlabs00.onmicrosoft.com",
                "kind": "work",
                "primary": True,
            },
            "projectId": "thoughtlabs",
            "userKind": "user",
        }

    def test_person_id_handler_with_upper_case_test_event(
        self,
        handler,
        lambda_context,
        email_identification,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        test_event = {
            "pathParameters": {"personId": "NyAh@tHoUghTlaBs.io"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
        }

        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body["primaryEmail"]["address"] == "nyah@thoughtlabs.io"
        assert not body["primaryEmail"]["address"].isupper()

    def test_person_id_handler_with_bad_test_event(
        self,
        handler,
        lambda_context,
        email_identification,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        test_event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}

        response = handler.handle(test_event, lambda_context)
        body = json_tools.loads(response["body"])

        assert response["statusCode"] == 400
        assert body == {"message": "Invalid personId path parameter"}

        test_event = {
            "pathParameters": {"personId": "nyah@thoughtlabs.io"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "platform-id": "slack",
            },
        }
        response = handler.handle(test_event, lambda_context)
        body = json_tools.loads(response["body"])
        assert response["statusCode"] == 400
        assert body["message"] == Glob("unconfigured *: slack", case=False)
