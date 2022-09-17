from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.people.people_handler import PeopleHandler

risk_id_test_events = [
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "33433cb47e6dc7097b1622d564c80a85ae8c9a30",
                "platform-id": "gsuite",
            },
        },
        {
            "applicationId": None,
            "domain": "external",
            "pageCount": 0,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "people": [
                {
                    "accessCount": 1,
                    "accessLevel": "admin",
                    "altnetId": "515c7228-10e4-550c-8889-54fb39f9489b",
                    "emails": [
                        {
                            "accessCount": 2,
                            "address": "nyah@thoughtlabs.io",
                            "kind": "work",
                            "riskCount": 1,
                        },
                        {"address": "neeya@tech.biz", "kind": "personal"},
                    ],
                    "externalCount": 2,
                    "internalCount": 1,
                    "lastRemovedPermissions": ANY,
                    "name": {"familyName": "Check", "fullName": "Nyah Check", "givenName": "Nyah"},
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {
                        "accessCount": 1,
                        "address": "nyah@thoughtlabs.biz",
                        "kind": "personal",
                        "riskCount": 1,
                    },
                    "projectId": "thoughtlabs",
                    "riskCount": 1,
                    "userKind": "person",
                },
                {
                    "accessCount": 1,
                    "accessLevel": "admin",
                    "altnetId": "515c7228-10e4-550c-8889-54fb39f9489b",
                    "emails": [
                        {
                            "accessCount": 2,
                            "address": "nyah@thoughtlabs.io",
                            "kind": "work",
                            "riskCount": 1,
                        },
                        {"address": "neeya@tech.biz", "kind": "personal"},
                    ],
                    "externalCount": 2,
                    "internalCount": 1,
                    "lastRemovedPermissions": ANY,
                    "name": {"familyName": "Check", "fullName": "Nyah Check", "givenName": "Nyah"},
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {
                        "accessCount": 1,
                        "address": "check.nyah@gmail.com",
                        "kind": "personal",
                        "riskCount": 1,
                    },
                    "projectId": "thoughtlabs",
                    "riskCount": 1,
                    "userKind": "person",
                },
            ],
            "platformId": "gsuite",
            "riskId": "33433cb47e6dc7097b1622d564c80a85ae8c9a30",
            "sort": "DESC",
        },
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "fiel2i2e00102309cb129cd409df972752ce556",
                "platform-id": "o365",
            },
        },
        {
            "applicationId": None,
            "domain": "external",
            "pageCount": 0,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "people": [],
            "platformId": "o365",
            "riskId": "fiel2i2e00102309cb129cd409df972752ce556",
            "sort": "DESC",
        },
    ),
]

file_id_test_events = [
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "file-id": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                "platform-id": "gsuite",
            },
        },
        {
            "applicationId": None,
            "domain": "external",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "people": [
                {
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
                }
            ],
            "platformId": "gsuite",
            "riskId": None,
            "sort": "DESC",
        },
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "file-id": "015XDZUDBNXD3NQIBXRFGLUHMWKBV3NUJP",
                "platform-id": "o365",
            },
        },
        {
            "applicationId": None,
            "domain": "external",
            "pageCount": 0,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "people": [],
            "platformId": "o365",
            "riskId": None,
            "sort": "DESC",
        },
    ),
]

app_id_test_events = [
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"application-id": "261251194779", "platform-id": "gsuite"},
        },
        {
            "applicationId": "261251194779",
            "domain": "external",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "people": [
                {
                    "accessLevel": "admin",
                    "altnetId": "4d5344dd-b699-59e9-9e3f-86f054521d1e",
                    "emails": [
                        {"address": "bobbieh@gmail.com", "kind": "personal"},
                        {"address": "bobbie@thoughtlabs.biz", "kind": "work"},
                    ],
                    "externalCount": 1,
                    "internal": True,
                    "internalCount": 2,
                    "name": {
                        "familyName": "Hawaii",
                        "fullName": "Bobbie Hawaii",
                        "givenName": "Bobbie",
                    },
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {
                        "address": "bobbie@thoughtlabs.io",
                        "kind": "work",
                        "primary": True,
                    },
                    "projectId": "thoughtlabs",
                    "userKind": "user",
                }
            ],
            "platformId": "gsuite",
            "riskId": None,
            "sort": "DESC",
        },
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "application-id": "0f9e59ce-494b-4e0c-95d2-5931562a7b86",
                "platform-id": "o365",
            },
        },
        {
            "applicationId": "0f9e59ce-494b-4e0c-95d2-5931562a7b86",
            "domain": "external",
            "pageCount": 0,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "people": [],
            "platformId": "o365",
            "riskId": None,
            "sort": "DESC",
        },
    ),
]


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestPeopleHandler:
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
    def admin_reports_v1_drive(self, mysql_connect, admin_reports_v1_drive_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.ADMIN_REPORTS.value,
            admin_reports_v1_drive_data,
        )

    @pytest.fixture
    def email_identification(self, mysql_connect, email_identification_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.EMAIL_IDENTIFICATION.value,
            email_identification_data,
        )

    @pytest.fixture
    def top_risks(self, mysql_connect, top_risks_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.TOP_RISKS.value,
            top_risks_data,
        )

    @pytest.fixture
    def handler(self, mock_config, users_manager, user_generator, mysql_connect):
        configs_p = patch.object(PeopleHandler, "configs", mock_config)
        sql_connect_p = patch.object(PeopleHandler, "sql_connect", return_value=mysql_connect)
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(PeopleHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = PeopleHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "people"
        return lambda_context

    def test_all_people_query_with_no_query_params(
        self,
        lambda_context,
        handler,
        admin_reports_v1_drive,
        drive_v3_filesmeta,
        top_risks,
        risks_files,
        admin_directory_v1_usersmeta,
        email_identification,
        ms_drives_docs,
        ms_drives_docs_permissions,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == {
            "applicationId": None,
            "domain": "external",
            "pageCount": 0,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "people": [
                {
                    "accessLevel": "owner",
                    "altnetId": "00b2461b-fb1b-578b-869d-4bdbfc826c86",
                    "emails": [
                        {"address": "yasuke@tech.info", "kind": "personal"},
                        {"address": "pluto@sweatband.org", "kind": "personal"},
                    ],
                    "externalCount": 3,
                    "lastRemovedPermissions": ANY,
                    "name": {
                        "familyName": "Daimyo",
                        "fullName": "Yasuke Daimyo",
                        "givenName": "Yasuke",
                    },
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {"address": "yasuke@shogun.jp", "kind": "personal"},
                    "projectId": "thoughtlabs",
                    "userKind": "person",
                },
                {
                    "accessLevel": "admin",
                    "altnetId": "4d5344dd-b699-59e9-9e3f-86f054521d1e",
                    "emails": [
                        {"address": "bobbieh@gmail.com", "kind": "personal"},
                        {"address": "bobbie@thoughtlabs.biz", "kind": "work"},
                    ],
                    "externalCount": 1,
                    "internal": True,
                    "internalCount": 2,
                    "name": {
                        "familyName": "Hawaii",
                        "fullName": "Bobbie Hawaii",
                        "givenName": "Bobbie",
                    },
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {
                        "address": "bobbie@thoughtlabs.io",
                        "kind": "work",
                        "primary": True,
                    },
                    "projectId": "thoughtlabs",
                    "userKind": "user",
                },
                {
                    "accessLevel": "admin",
                    "altnetId": "dc6734df-2ef4-53fc-8a6e-f93f7ced912f",
                    "emails": [
                        {"address": "pkhetrapal@gmail.com", "kind": "personal"},
                        {"address": "pulkit@thoughtlabs00.onmicrosoft.com", "kind": "work"},
                    ],
                    "externalCount": 1,
                    "internal": True,
                    "internalCount": 2,
                    "name": {
                        "familyName": "Khetrapal",
                        "fullName": "Pulkit Khetrapal",
                        "givenName": "Pulkit",
                    },
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {
                        "address": "Pulkit@thoughtlabs.io",
                        "kind": "work",
                        "primary": True,
                    },
                    "projectId": "thoughtlabs",
                    "userKind": "user",
                },
                {
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
                },
                {
                    "accessLevel": "admin",
                    "altnetId": "45c63f50-55bf-54d9-a801-39c26bd5a49c",
                    "emails": [
                        {"address": "amol@altitudenetworks.com", "kind": "personal"},
                        {"address": "mr.amolpatel@gmail.com", "kind": "personal"},
                        {"address": "amol.canvas@gmail.com", "kind": "personal"},
                    ],
                    "externalCount": 3,
                    "internal": True,
                    "internalCount": 1,
                    "name": {"familyName": "Patel", "fullName": "Amol Patel", "givenName": "Amol"},
                    "phones": [{"kind": "personal", "number": "+15555555555"}],
                    "primaryEmail": {
                        "address": "amol@thoughtlabs.io",
                        "kind": "work",
                        "primary": True,
                    },
                    "projectId": "thoughtlabs",
                    "userKind": "user",
                },
                {
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
            ],
            "platformId": "gsuite",
            "riskId": None,
            "sort": "DESC",
        }

    @pytest.mark.parametrize("test_event, test_response", risk_id_test_events)
    def test_people_base_query_with_risk_id_by_platform(
        self,
        lambda_context,
        handler,
        test_event,
        test_response,
        admin_reports_v1_drive,
        drive_v3_filesmeta,
        top_risks,
        risks_files,
        admin_directory_v1_usersmeta,
        email_identification,
        ms_drives_docs,
        ms_drives_docs_permissions,
    ):
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == test_response

    @pytest.mark.parametrize("test_event, test_response", file_id_test_events)
    def test_people_handler_with_file_id_by_platform(
        self,
        lambda_context,
        handler,
        test_event,
        test_response,
        admin_reports_v1_drive,
        drive_v3_filesmeta,
        top_risks,
        risks_files,
        admin_directory_v1_usersmeta,
        email_identification,
        ms_drives_docs,
        ms_drives_docs_permissions,
    ):
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == test_response

    @pytest.mark.parametrize("test_event, test_response", app_id_test_events)
    def test_people_handler_with_app_id_by_platform(
        self,
        lambda_context,
        handler,
        test_event,
        test_response,
        admin_reports_v1_drive,
        drive_v3_filesmeta,
        top_risks,
        risks_files,
        admin_directory_v1_usersmeta,
        email_identification,
        ms_drives_docs,
        ms_drives_docs_permissions,
    ):
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == test_response
