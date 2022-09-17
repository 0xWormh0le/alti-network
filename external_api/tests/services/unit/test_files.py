from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.files.files_handler import FilesHandler

page_count_test_events = [
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "person-id": "nyah@thoughtlabs.io",
                "platform-ids": '["gsuite"]',
            },
        },
        1,
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "owner-id": "bobbie@thoughtlabs.io",
                "at-risk": "false",
                "platform-ids": '["gsuite"]',
            },
        },
        1,
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "owner-id": "bobbie@thoughtlabs.io",
                "at-risk": "true",
                "platform-ids": '["gsuite"]',
            },
        },
        1,
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                "platform-ids": '["gsuite"]',
            },
        },
        1,
    ),
    (
        {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "8lr2ieel8492leediadelelewl32dksle",
                "platform-ids": '["o365"]',
            },
        },
        1,
    ),
]


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestFilesHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return {
            "queryStringParameters": {
                "risk-id": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                "page-number": "1",
                "page-size": "10",
                "platform-ids": '["gsuite"]',
            },
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
        }

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "file-id"
        return lambda_context

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, users_manager, user_generator):
        configs_p = patch.object(FilesHandler, "configs", mock_config)
        sql_connect_p = patch.object(FilesHandler, "sql_connect", return_value=mysql_connect)
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(FilesHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = FilesHandler(enable_sentry=False, raise_errors=True)
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

    @pytest.mark.parametrize("test_event, page_count", page_count_test_events)
    def test_files_handler_with_page_count(
        self,
        test_event,
        page_count,
        handler,
        lambda_context,
        ms_drives_docs_permissions,
        ms_drives_docs,
        platform,
        risks_files,
        files_content_inspection,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])
        assert resp["statusCode"] == 200
        assert body["pageCount"] == page_count

    def test_files_associated_with_risk_with_rendered_queries_on_gsuite(
        self,
        handler,
        lambda_context,
        ms_drives_docs_permissions,
        ms_drives_docs,
        platform,
        risks_files,
        files_content_inspection,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                "platform-ids": '["gsuite"]',
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # assert build_query works as expected
        query_file_name, query_count_file_name, query_fragments = handler.build_query(
            Platform.GSUITE
        )
        assert query_count_file_name == "file_risk_count.sql"
        assert query_file_name == "files_base_query.sql"
        assert query_fragments == {
            "order": "lastModified",
            "person_id_predicate": "true",
            "risk_id_predicate": "rf.risk_id = %(risk_id)s",
            "sort": "DESC",
        }

        # verify execute_query returns the proper results
        assert resp["statusCode"] == 200
        assert body == {
            "files": [
                {
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
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": 1594403321,
                    "linkVisibility": "unknown",
                    "md5Checksum": "",
                    "mimeType": "document",
                    "parentFolder": {
                        "folderId": "082948x3l48",
                        "folderName": "fake-documents-folder",
                    },
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
                    "sharedToDomains": [],
                    "trashed": False,
                }
            ],
            "orderBy": "lastModified",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "platformIds": ["gsuite"],
            "riskId": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
            "sort": "DESC",
        }

    def test_files_associated_with_risk_on_o365(
        self,
        handler,
        lambda_context,
        ms_drives_docs_permissions,
        ms_drives_docs,
        platform,
        risks_files,
        files_content_inspection,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "8lr2ieel8492leediadelelewl32dksle",
                "platform-ids": '["o365"]',
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # assert build_query works as expected
        query_file_name, query_count_file_name, query_fragments = handler.build_query(Platform.O365)
        assert query_count_file_name == "file_risk_count.sql"
        assert query_file_name == "files_base_query.sql"
        assert query_fragments == {
            "order": "lastModified",
            "person_id_predicate": "true",
            "risk_id_predicate": "rf.risk_id = %(risk_id)s",
            "sort": "DESC",
        }

        # verify execute_query returns the proper results
        assert resp["statusCode"] == 200
        assert body == {
            "files": [
                {
                    "createdAt": ANY,
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
                            "address": "pulkit@thoughtlabs00.onmicrosoft.com",
                            "kind": "work",
                            "primary": True,
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "015XDZUDG42SYYNSTFNNBZNZYK4QAGDBJA",
                    "fileName": "Book.xlsx",
                    "iconUrl": "",
                    "webLink": "https://thoughtlabs00-my.sharepoint.com/personal/pulkit_thoughtlabs00_onmicrosoft_com/_layouts/15/Doc.aspx?sourcedoc=%7B86B1D4DC-65CA-436B-96E7-0AE400618520%7D&file=Book.xlsx&action=default&mobileredirect=true",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": ANY,
                    "linkVisibility": "unknown",
                    "md5Checksum": "79c2e5fd-cab9-4a42-a045-ba8d7b1fc612",
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
                },
                {
                    "createdAt": 1604086719,
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
                            "address": "pulkit@thoughtlabs00.onmicrosoft.com",
                            "kind": "work",
                            "primary": True,
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "015XDZUDBNXD3NQIBXRFGLUHMWKBV3NUJP",
                    "fileName": "Document.docx",
                    "iconUrl": "",
                    "webLink": "https://thoughtlabs00-my.sharepoint.com/personal/pulkit_thoughtlabs00_onmicrosoft_com/_layouts/15/Doc.aspx?sourcedoc=%7BD8F6B82D-3720-4C89-BA1D-96506BB6D12F%7D&file=Document.docx&action=default&mobileredirect=true",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": ANY,
                    "linkVisibility": "unknown",
                    "md5Checksum": "79c2e5fd-cab9-4a42-a045-ba8d7b1fc612",
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
                },
            ],
            "orderBy": "lastModified",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "platformIds": ["o365"],
            "riskId": "8lr2ieel8492leediadelelewl32dksle",
            "sort": "DESC",
        }

    def test_files_by_person_query_on_o365(
        self,
        handler,
        lambda_event,
        lambda_context,
        ms_drives_docs_permissions,
        ms_drives_docs,
        platform,
        risks_files,
        files_content_inspection,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "person-id": "pulkit@thoughtlabs00.onmicrosoft.com",
                "platform-ids": '["o365"]',
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # assert build_query works as expected
        query_file_name, query_count_file_name, query_fragments = handler.build_query(Platform.O365)
        assert query_count_file_name == "file_person_count.sql"
        assert query_file_name == "files_by_person.sql"
        assert query_fragments == {
            "order": "lastModified",
            "person_id_predicate": "true",
            "risk_id_predicate": "true",
            "sort": "DESC",
        }

        # verify execute_query returns the proper results
        assert resp["statusCode"] == 200
        assert body == {
            "files": [
                {
                    "createdAt": ANY,
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
                            "address": "pulkit@thoughtlabs00.onmicrosoft.com",
                            "kind": "work",
                            "primary": True,
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "015XDZUDG42SYYNSTFNNBZNZYK4QAGDBJA",
                    "fileName": "Book.xlsx",
                    "iconUrl": "",
                    "webLink": "https://thoughtlabs00-my.sharepoint.com/personal/pulkit_thoughtlabs00_onmicrosoft_com/_layouts/15/Doc.aspx?sourcedoc=%7B86B1D4DC-65CA-436B-96E7-0AE400618520%7D&file=Book.xlsx&action=default&mobileredirect=true",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": ANY,
                    "linkVisibility": "unknown",
                    "md5Checksum": "",
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
                },
                {
                    "createdAt": 1604086719,
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
                            "address": "pulkit@thoughtlabs00.onmicrosoft.com",
                            "kind": "work",
                            "primary": True,
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "015XDZUDBNXD3NQIBXRFGLUHMWKBV3NUJP",
                    "fileName": "Document.docx",
                    "iconUrl": "",
                    "webLink": "https://thoughtlabs00-my.sharepoint.com/personal/pulkit_thoughtlabs00_onmicrosoft_com/_layouts/15/Doc.aspx?sourcedoc=%7BD8F6B82D-3720-4C89-BA1D-96506BB6D12F%7D&file=Document.docx&action=default&mobileredirect=true",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": ANY,
                    "linkVisibility": "unknown",
                    "md5Checksum": "",
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
                },
            ],
            "orderBy": "lastModified",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "platformIds": ["o365"],
            "riskId": None,
            "sort": "DESC",
        }

    def test_files_by_person_query_with_build_rendered_queries_on_gsuite(
        self,
        handler,
        lambda_event,
        lambda_context,
        ms_drives_docs_permissions,
        ms_drives_docs,
        platform,
        risks_files,
        files_content_inspection,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "person-id": "michael@thoughtlabs.io",
                "platform-ids": '["gsuite"]',
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # assert build_query works as expected
        query_file_name, query_count_file_name, query_fragments = handler.build_query(
            Platform.GSUITE
        )
        assert query_count_file_name == "file_person_count.sql"
        assert query_file_name == "files_by_person.sql"
        assert query_fragments == {
            "order": "lastModified",
            "person_id_predicate": "true",
            "risk_id_predicate": "true",
            "sort": "DESC",
        }

        # verify execute_query returns the proper results
        assert resp["statusCode"] == 200
        assert len(body["files"]) == 3
        assert body["platformIds"] == ["gsuite"]

    def test_files_handler_with_bad_test_event(self, handler, lambda_context):
        event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}
        response = handler.handle(event, lambda_context)
        assert response["statusCode"] == 400

        event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"risk-id": None},
        }
        response = handler.handle(event, lambda_context)
        assert response["statusCode"] == 400

    def test_files_handler_sql_injection(self, handler, lambda_context):
        event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "person-id": "foo'bar",
            },
        }
        handler.handle(event, lambda_context)

        event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "foo'bar",
            },
        }
        handler.handle(event, lambda_context)

        event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "owner-id": "foo'bar",
            },
        }
        handler.handle(event, lambda_context)

    def test_files_handler_with_no_platforms_param(
        self,
        handler,
        lambda_context,
        ms_drives_docs_permissions,
        ms_drives_docs,
        platform,
        risks_files,
        files_content_inspection,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
    ):
        test_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "risk-id": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                "platform-ids": "[]",
            },
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # assert build_query works as expected
        assert resp["statusCode"] == 200
        assert body["platformIds"] == ["gsuite", "o365"]
