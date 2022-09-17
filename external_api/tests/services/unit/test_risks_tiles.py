from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.risks_tiles.risks_tiles_handler import RisksTilesHandler


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestRisksTilesHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

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
    def handler(
        self, mock_config, mysql_connect, risk_metrics_manager, users_manager, user_generator
    ):
        configs_p = patch.object(RisksTilesHandler, "configs", mock_config)
        sql_connect_p = patch.object(RisksTilesHandler, "sql_connect", return_value=mysql_connect)
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        # risk_m_p = patch(RisksTilesHandler, "risk_metrics_manager", risk_metrics_manager)
        users_mgr_p = patch.object(RisksTilesHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:  # , risk_m_p:
            handler = RisksTilesHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def mock_event(self):
        return {"requestContext": {"authorizer": {"project_id": "thoughtlabs"}}}

    @pytest.fixture(scope="class")
    def mock_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "risks-tiles"
        return test_context

    def test_risks_tiles_handler_success(
        self,
        mock_event,
        mock_context,
        handler,
        ms_drives_docs,
        platform,
        top_risks,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        email_identification,
    ):
        resp = handler.handle(mock_event, mock_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == {
            "highestRiskFile": {
                "count": "6",
                "file": {
                    "createdAt": 0,
                    "createdBy": {},
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                    "fileName": "Private personal secret secure financial - edited again",
                    "webLink": "web_view_link_1",
                    "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": 0,
                    "lastModified": 0,
                    "linkVisibility": "unknown",
                    "md5Checksum": "",
                    "mimeType": "document",
                    "parentFolder": {},
                    "platformId": "gsuite",
                    "platformName": "Google Workspace",
                    "sensitivePhrases": {"ccNum": 0, "sensitiveKeywords": [], "ssn": 0},
                    "sharedToDomains": [],
                    "trashed": False,
                },
            },
            "mostAtRiskFilesOwned": {
                "count": "4",
                "person": {
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
            },
            "mostExternalAccess": {
                "count": "5",
                "person": {
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
            },
            "mostRisksCreated": {
                "count": "10",
                "person": {
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
            },
        }
