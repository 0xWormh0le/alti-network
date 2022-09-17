from unittest.mock import ANY, patch

import pytest
from callee import Glob
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.risks.risks_handler import RisksHandler

page_count_test_events = [(10, 1), (5, 1), (1, 2), (2, 1), (3, 1), (0, None)]


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestRisksHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture
    def ms_applications(self, mysql_connect, ms_applications_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            MicrosoftTableNames.MS_APPLICATIONS.value,
            ms_applications_data,
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

    @pytest.fixture
    def admin_directory_v1_tokens(self, mysql_connect, admin_directory_v1_tokens_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.ADMIN_TOKENS.value,
            admin_directory_v1_tokens_data,
        )

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, users_manager, user_generator):
        configs_p = patch.object(RisksHandler, "configs", mock_config)
        sql_connect_p = patch.object(RisksHandler, "sql_connect", return_value=mysql_connect)
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(RisksHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = RisksHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "page-number": "1",
                "platform-ids": '["gsuite", "o365"]',
                "page-size": "10",
                "order-by": "severity",
                "risk-type-ids": "[3010]",
            },
        }

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "risks"
        return lambda_context

    @pytest.mark.parametrize("page_size, page_count", page_count_test_events)
    def test_risks_handler_with_page_count_values(
        self,
        page_size,
        page_count,
        handler,
        lambda_context,
        top_risks,
        platform,
        files_content_inspection,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
        user_generator,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "page-number": "1",
                "page-size": page_size,
                "platform-ids": '["gsuite", "o365"]',
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])
        body["pageCount"] == page_count

    def test_risks_handler_with_filter_by_sensitive_content_only(
        self,
        handler,
        lambda_context,
        top_risks,
        platform,
        files_content_inspection,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
        user_generator,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "platform-ids": '["gsuite", "o365"]',
                "page-number": "1",
                "page-size": "10",
                "sensitive-content-only": "True",
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == {
            "applicationId": None,
            "orderBy": "datetime",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "personId": None,
            "platformIds": ["gsuite", "o365"],
            "riskCount": 1,
            "riskTypeIds": [],
            "risks": [
                {
                    "creator": {
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
                    "datetime": ANY,
                    "fileCount": 1,
                    "mimeType": "document",
                    "fileId": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                    "fileName": "Private personal secret secure financial - edited again",
                    "owner": {
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
                    "platformId": "gsuite",
                    "plugin": {"id": "261251194779", "name": "Google APIs Explorer"},
                    "riskDescription": "File Shared by Link - Externally Accessible",
                    "riskId": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                    "riskTarget": [],
                    "riskTypeId": 3010,
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
                    "severity": 8,
                    "webLink": "web_view_link_1",
                }
            ],
            "sensitiveContentOnly": True,
            "severityThreshold": 0,
            "sort": "DESC",
        }

    def test_risks_handler_with_single_file_sensitive_phrases(
        self,
        handler,
        lambda_event,
        lambda_context,
        top_risks,
        platform,
        files_content_inspection,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
    ):
        resp = handler.handle(lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == {
            "applicationId": None,
            "orderBy": "severity",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "platformIds": ["gsuite", "o365"],
            "personId": None,
            "riskCount": 2,
            "riskTypeIds": [3010],
            "risks": [
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                        "emails": [
                            {"address": "mwcoates@gmail.com", "kind": "personal"},
                            {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                        ],
                        "internal": True,
                        "internalCount": 2,
                        "externalCount": 1,
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
                    "datetime": ANY,
                    "fileCount": 1,
                    "mimeType": "document",
                    "fileId": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                    "fileName": "Private personal secret secure financial - edited again",
                    "owner": {
                        "accessLevel": "admin",
                        "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                        "emails": [
                            {"address": "mwcoates@gmail.com", "kind": "personal"},
                            {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                        ],
                        "internal": True,
                        "internalCount": 2,
                        "externalCount": 1,
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
                    "platformId": "gsuite",
                    "plugin": {"id": "261251194779", "name": "Google APIs Explorer"},
                    "riskDescription": "File Shared by Link - Externally Accessible",
                    "riskId": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                    "riskTarget": [],
                    "riskTypeId": 3010,
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
                    "severity": 8,
                    "webLink": "web_view_link_1",
                },
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "515c7228-10e4-550c-8889-54fb39f9489b",
                        "emails": [{"address": "neeya@tech.biz", "kind": "personal"}],
                        "externalCount": 1,
                        "internal": True,
                        "internalCount": 1,
                        "name": {
                            "familyName": "Check",
                            "fullName": "Nyah Check",
                            "givenName": "Nyah",
                        },
                        "phones": [{"kind": "personal", "number": "+15555555555"}],
                        "primaryEmail": {
                            "address": "nyah@thoughtlabs.io",
                            "kind": "work",
                            "primary": True,
                            "riskCount": 3,
                        },
                        "projectId": "thoughtlabs",
                        "riskCount": 3,
                        "userKind": "user",
                    },
                    "datetime": ANY,
                    "fileCount": 2,
                    "mimeType": "document",
                    "fileId": None,
                    "fileName": None,
                    "owner": {},
                    "platformId": "o365",
                    "plugin": {
                        "id": "0f9e59ce-494b-4e0c-95d2-5931562a7b86",
                        "name": "Thought Labs MS Office Integration",
                    },
                    "riskDescription": "Many company owned files downloaded in 24 "
                    "hours by app on behalf of a user",
                    "riskId": "fiel2i2e00102309cb129cd409df972752ce556",
                    "riskTarget": [],
                    "riskTypeId": 3010,
                    "sensitivePhrases": {
                        "ccNumFileCount": 0,
                        "sensitiveKeywordsFileCount": 0,
                        "ssnFileCount": 0,
                    },
                    "severity": 5,
                    "webLink": None,
                },
            ],
            "severityThreshold": 0,
            "sort": "DESC",
            "sensitiveContentOnly": False,
        }

    def test_risks_handler_with_multi_file_sensitive_phrases(
        self,
        handler,
        lambda_context,
        top_risks,
        platform,
        files_content_inspection,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "platform-ids": '["gsuite", "o365"]',
                "page-number": "1",
                "page-size": "10",
                "risk-type-ids": "[1020]",
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body == {
            "applicationId": None,
            "orderBy": "datetime",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "personId": None,
            "platformIds": ["gsuite", "o365"],
            "riskCount": 2,
            "riskTypeIds": [1020],
            "risks": [
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                        "emails": [
                            {"address": "mwcoates@gmail.com", "kind": "personal"},
                            {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                        ],
                        "internal": True,
                        "internalCount": 2,
                        "externalCount": 1,
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
                    "datetime": ANY,
                    "fileCount": 2,
                    "mimeType": "document",
                    "fileId": None,
                    "fileName": None,
                    "owner": ANY,
                    "platformId": "gsuite",
                    "plugin": None,
                    "riskDescription": "Company Owned File Shared by Link - Externally Accessible",
                    "riskId": "33433cb47e6dc7097b1622d564c80a85ae8c9a30",
                    "riskTarget": [],
                    "riskTypeId": 1020,
                    "sensitivePhrases": {
                        "ccNumFileCount": 1,
                        "sensitiveKeywordsFileCount": 2,
                        "ssnFileCount": 0,
                    },
                    "severity": 8,
                    "webLink": None,
                },
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "515c7228-10e4-550c-8889-54fb39f9489b",
                        "emails": [{"address": "neeya@tech.biz", "kind": "personal"}],
                        "externalCount": 1,
                        "internal": True,
                        "internalCount": 1,
                        "name": {
                            "familyName": "Check",
                            "fullName": "Nyah Check",
                            "givenName": "Nyah",
                        },
                        "phones": [{"kind": "personal", "number": "+15555555555"}],
                        "primaryEmail": {
                            "address": "nyah@thoughtlabs.io",
                            "kind": "work",
                            "primary": True,
                            "riskCount": 3,
                        },
                        "projectId": "thoughtlabs",
                        "riskCount": 3,
                        "userKind": "user",
                    },
                    "datetime": ANY,
                    "fileCount": 2,
                    "mimeType": "document",
                    "fileId": "",
                    "fileName": None,
                    "owner": {},
                    "platformId": "o365",
                    "plugin": None,
                    "riskDescription": "Company Owned File Shared by Link - Externally Accessible",
                    "riskId": "8lr2ieel8492leediadelelewl32dksle",
                    "riskTarget": [],
                    "riskTypeId": 1020,
                    "sensitivePhrases": {
                        "ccNumFileCount": 0,
                        "sensitiveKeywordsFileCount": 0,
                        "ssnFileCount": 0,
                    },
                    "severity": 6,
                    "webLink": None,
                },
            ],
            "severityThreshold": 0,
            "sort": "DESC",
            "sensitiveContentOnly": False,
        }

    def test_risks_handler_with_multi_file_sensitive_phrases_having_none_values(
        self,
        handler,
        lambda_context,
        top_risks,
        platform,
        files_content_inspection,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "platform-ids": '["gsuite", "o365"]',
                "page-number": "1",
                "page-size": "10",
                "risk-type-ids": "[3100]",
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        assert resp["statusCode"] == 200
        assert body["riskTypeIds"] == [3100]
        assert body["risks"][0]["sensitivePhrases"] == {
            "ccNumFileCount": 2,
            "sensitiveKeywordsFileCount": 0,
            "ssnFileCount": 1,
        }

    def test_risks_handler_with_person_id_event(
        self,
        handler,
        lambda_event,
        lambda_context,
        top_risks,
        platform,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
    ):
        new_lambda_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "order-by": "severity",
                "person-id": "michael@thoughtlabs.io",
                "platform-ids": '["gsuite", "o365"]',
            },
        }
        resp = handler.handle(new_lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert body == {
            "applicationId": None,
            "orderBy": "severity",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "platformIds": ["gsuite", "o365"],
            "personId": "michael@thoughtlabs.io",
            "riskCount": 2,
            "riskTypeIds": [],
            "risks": [
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                        "emails": [
                            {"address": "mwcoates@gmail.com", "kind": "personal"},
                            {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                        ],
                        "internal": True,
                        "internalCount": 2,
                        "externalCount": 1,
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
                    "datetime": ANY,
                    "fileCount": 1,
                    "mimeType": "document",
                    "fileId": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                    "fileName": "Private personal secret secure financial - edited again",
                    "owner": {
                        "accessLevel": "admin",
                        "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                        "emails": [
                            {"address": "mwcoates@gmail.com", "kind": "personal"},
                            {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                        ],
                        "internal": True,
                        "internalCount": 2,
                        "externalCount": 1,
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
                    "platformId": "gsuite",
                    "plugin": {"id": "261251194779", "name": "Google APIs Explorer"},
                    "riskDescription": "File Shared by Link - Externally Accessible",
                    "riskId": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                    "riskTarget": [],
                    "riskTypeId": 3010,
                    "sensitivePhrases": {"ccNum": 0, "sensitiveKeywords": [], "ssn": 0},
                    "severity": 8,
                    "webLink": "web_view_link_1",
                },
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "9a909349-b22e-5cf3-adc4-b2b18b1cdc9c",
                        "emails": [
                            {"address": "mwcoates@gmail.com", "kind": "personal"},
                            {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                        ],
                        "internal": True,
                        "internalCount": 2,
                        "externalCount": 1,
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
                    "datetime": ANY,
                    "fileCount": 2,
                    "mimeType": "document",
                    "fileId": None,
                    "fileName": None,
                    "owner": {},
                    "platformId": "gsuite",
                    "plugin": None,
                    "riskDescription": "Company Owned File Shared by Link - Externally Accessible",
                    "riskId": "33433cb47e6dc7097b1622d564c80a85ae8c9a30",
                    "riskTarget": [],
                    "riskTypeId": 1020,
                    "sensitivePhrases": {
                        "ccNumFileCount": 0,
                        "sensitiveKeywordsFileCount": 0,
                        "ssnFileCount": 0,
                    },
                    "severity": 8,
                    "webLink": None,
                },
            ],
            "severityThreshold": 0,
            "sort": "DESC",
            "sensitiveContentOnly": False,
        }

    def test_risks_handler_with_empty_platforms(
        self,
        handler,
        lambda_event,
        lambda_context,
        top_risks,
        platform,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
    ) -> None:
        new_lambda_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "order-by": "severity",
                "platform-ids": "[]",
            },
        }
        resp = handler.handle(new_lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body["platformIds"] == ["gsuite", "o365"]

    def test_risks_handler_with_o365_platform_only(
        self,
        handler,
        lambda_event,
        lambda_context,
        top_risks,
        platform,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
    ) -> None:
        new_lambda_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "order-by": "severity",
                "platform-ids": "['o365']",
            },
        }
        resp = handler.handle(new_lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body == {
            "applicationId": None,
            "orderBy": "severity",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "personId": None,
            "platformIds": ["o365"],
            "riskCount": 2,
            "riskTypeIds": [],
            "risks": [
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "515c7228-10e4-550c-8889-54fb39f9489b",
                        "emails": [{"address": "neeya@tech.biz", "kind": "personal"}],
                        "externalCount": 1,
                        "internal": True,
                        "internalCount": 1,
                        "name": {
                            "familyName": "Check",
                            "fullName": "Nyah Check",
                            "givenName": "Nyah",
                        },
                        "phones": [{"kind": "personal", "number": "+15555555555"}],
                        "primaryEmail": {
                            "address": "nyah@thoughtlabs.io",
                            "kind": "work",
                            "primary": True,
                            "riskCount": 3,
                        },
                        "projectId": "thoughtlabs",
                        "riskCount": 3,
                        "userKind": "user",
                    },
                    "datetime": ANY,
                    "fileCount": 2,
                    "mimeType": "document",
                    "fileId": "",
                    "fileName": None,
                    "owner": {},
                    "platformId": "o365",
                    "plugin": None,
                    "riskDescription": "Company Owned File Shared by Link - Externally Accessible",
                    "riskId": "8lr2ieel8492leediadelelewl32dksle",
                    "riskTarget": [],
                    "riskTypeId": 1020,
                    "sensitivePhrases": {
                        "ccNumFileCount": 0,
                        "sensitiveKeywordsFileCount": 0,
                        "ssnFileCount": 0,
                    },
                    "severity": 6,
                    "webLink": None,
                },
                {
                    "creator": {
                        "accessLevel": "admin",
                        "altnetId": "515c7228-10e4-550c-8889-54fb39f9489b",
                        "emails": [{"address": "neeya@tech.biz", "kind": "personal"}],
                        "externalCount": 1,
                        "internal": True,
                        "internalCount": 1,
                        "name": {
                            "familyName": "Check",
                            "fullName": "Nyah Check",
                            "givenName": "Nyah",
                        },
                        "phones": [{"kind": "personal", "number": "+15555555555"}],
                        "primaryEmail": {
                            "address": "nyah@thoughtlabs.io",
                            "kind": "work",
                            "primary": True,
                            "riskCount": 3,
                        },
                        "projectId": "thoughtlabs",
                        "riskCount": 3,
                        "userKind": "user",
                    },
                    "datetime": ANY,
                    "fileCount": 2,
                    "mimeType": "document",
                    "fileId": None,
                    "fileName": None,
                    "owner": {},
                    "platformId": "o365",
                    "plugin": {
                        "id": "0f9e59ce-494b-4e0c-95d2-5931562a7b86",
                        "name": "Thought Labs MS Office Integration",
                    },
                    "riskDescription": "Many company owned files downloaded in 24 hours by app on behalf of a user",
                    "riskId": "fiel2i2e00102309cb129cd409df972752ce556",
                    "riskTarget": [],
                    "riskTypeId": 3010,
                    "sensitivePhrases": {
                        "ccNumFileCount": 0,
                        "sensitiveKeywordsFileCount": 0,
                        "ssnFileCount": 0,
                    },
                    "severity": 5,
                    "webLink": None,
                },
            ],
            "sensitiveContentOnly": False,
            "severityThreshold": 0,
            "sort": "DESC",
        }

    def test_risks_handler_with_unsupported_platform_ids(
        self,
        handler,
        lambda_event,
        lambda_context,
        top_risks,
        platform,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        admin_directory_v1_tokens,
        ms_applications,
        ms_drives_docs,
    ) -> None:
        new_lambda_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "order-by": "severity",
                "platform-ids": '["confluence", "slack"]',
            },
        }
        resp = handler.handle(new_lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 400
        assert body["message"] == Glob("unconfigured *: confluence, slack", case=False)
