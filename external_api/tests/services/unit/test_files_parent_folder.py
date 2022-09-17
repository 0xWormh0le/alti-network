from unittest.mock import ANY, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.files_parent_folder.files_parent_folder_handler import FilesParentFolderHandler


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestFilesParentFolderHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return {
            "pathParameters": {"parentId": "082948x3l48"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
        }

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "files-parent-folder"
        return lambda_context

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, users_manager, user_generator):
        configs_p = patch.object(FilesParentFolderHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            FilesParentFolderHandler, "sql_connect", return_value=mysql_connect
        )
        users_gen_p = patch("external_api.models.event.UserGenerator", user_generator)
        users_mgr_p = patch.object(FilesParentFolderHandler, "users_manager", users_manager)
        with configs_p, sql_connect_p, users_gen_p, users_mgr_p:
            handler = FilesParentFolderHandler(enable_sentry=False, raise_errors=True)
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

    @pytest.fixture
    def admin_directory_v1_usersmeta(self, mysql_connect, admin_directory_v1_usersmeta_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.ADMIN_USERSMETA.value,
            admin_directory_v1_usersmeta_data,
        )

    @pytest.fixture
    def files_content_inspection(self, mysql_connect, files_content_inspection_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.CONTENT_INSPECTION.value,
            files_content_inspection_data,
        )

    def test_files_parent_folder_with_valid_parent_id_on_gsuite(
        self,
        handler,
        lambda_event,
        lambda_context,
        ms_drives_docs,
        platform,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        files_content_inspection,
    ):
        resp = handler.handle(lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # verify execute_query returns the proper results
        assert resp["statusCode"] == 200
        assert body == {
            "files": [
                {
                    "createdAt": 1554485433,
                    "createdBy": {
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
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "482398SSEE3LDL3.WE",
                    "fileName": "San Francisco Chronicle meeting.txt",
                    "webLink": "web_view_link_5",
                    "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": 1605548921,
                    "linkVisibility": "unknown",
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "mimeType": "document",
                    "parentFolder": {
                        "folderId": "082948x3l48",
                        "folderName": "fake-documents-folder",
                    },
                    "platformId": "gsuite",
                    "platformName": "Google Workspace",
                    "sensitivePhrases": {"ccNum": 2, "sensitiveKeywords": [], "ssn": 0},
                    "sharedToDomains": [],
                    "trashed": False,
                },
                {
                    "createdAt": 1554485433,
                    "createdBy": {
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
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "4823984lr2li3eli2eli",
                    "fileName": "DC Metro plan.docx",
                    "webLink": "web_view_link_4",
                    "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": 1605548921,
                    "linkVisibility": "unknown",
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "mimeType": "document",
                    "parentFolder": {
                        "folderId": "082948x3l48",
                        "folderName": "fake-documents-folder",
                    },
                    "platformId": "gsuite",
                    "platformName": "Google Workspace",
                    "sensitivePhrases": {"ccNum": 1, "sensitiveKeywords": [], "ssn": 1},
                    "sharedToDomains": [],
                    "trashed": False,
                },
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
                    "fileId": "195AwU1HlKBdOWTXzfF_irREGfqMDB1d4",
                    "fileName": "requirements-specs.doc",
                    "webLink": "web_view_link_3",
                    "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": 1605548921,
                    "linkVisibility": "unknown",
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "mimeType": "document",
                    "parentFolder": {
                        "folderId": "082948x3l48",
                        "folderName": "fake-documents-folder",
                    },
                    "platformId": "gsuite",
                    "platformName": "Google Workspace",
                    "sensitivePhrases": {
                        "ccNum": 0,
                        "sensitiveKeywords": [
                            {"count": 8, "keyword": "invalid-key"},
                            {"count": 5, "keyword": "board meeting"},
                            {"count": 5, "keyword": "proprietary"},
                            {"count": 1, "keyword": "Attorney"},
                            {"count": 1, "keyword": "Attorney/Client"},
                        ],
                        "ssn": 0,
                    },
                    "sharedToDomains": [],
                    "trashed": False,
                },
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
                    "fileId": "1BuZUfN1vykrDjPi6zlEr8CtoIwiYQJ1n",
                    "fileName": "dependency_links.txt",
                    "webLink": "web_view_link_2",
                    "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": 1605548921,
                    "linkVisibility": "unknown",
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
                    "mimeType": "document",
                    "parentFolder": {
                        "folderId": "082948x3l48",
                        "folderName": "fake-documents-folder",
                    },
                    "platformId": "gsuite",
                    "platformName": "Google Workspace",
                    "sensitivePhrases": {
                        "ccNum": 1,
                        "sensitiveKeywords": [
                            {"count": 4, "keyword": "board meeting"},
                            {"count": 4, "keyword": "invalid-key"},
                            {"count": 2, "keyword": "Attorney/Client"},
                            {"count": 2, "keyword": "proprietary"},
                            {"count": 1, "keyword": "Attorney"},
                        ],
                        "ssn": 0,
                    },
                    "sharedToDomains": [],
                    "trashed": False,
                },
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
                    "md5Checksum": "d41d8cd98f00b204e9800998ecf8427e",
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
                },
            ],
            "orderBy": "datetime",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "parentId": "082948x3l48",
            "platformId": "gsuite",
            "sort": "DESC",
        }

    def test_files_parent_folder_with_valid_parent_id_on_o365(
        self,
        handler,
        lambda_event,
        lambda_context,
        ms_drives_docs,
        platform,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        files_content_inspection,
    ):
        test_event = {
            "pathParameters": {"parentId": "01D3GIE3GV6Y2GOVW442325BZO354PWSELRRZ"},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"platform-id": "o365"},
        }
        resp = handler.handle(test_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # verify execute_query returns the proper results
        assert resp["statusCode"] == 200
        assert body == {
            "files": [
                {
                    "createdAt": 1604086781,
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
                    "lastModified": 1604086781,
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
                    "lastModified": 1604086721,
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
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": 1604085489,
                    "linkVisibility": "unknown",
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
                },
                {
                    "createdAt": 1604085377,
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
                    "fileId": "01LLW7TSH5Q6C7SGGYANHIBZJQJ5YK25H2",
                    "fileName": "a new document under Bobbie Test Shared Site.docx",
                    "iconUrl": "",
                    "webLink": "https://thoughtlabs00.sharepoint.com/sites/BobbieTestSite/_layouts/15/Doc.aspx?sourcedoc=%7BF98587FD-D818-4E03-80E5-304F70AD74FA%7D&file=a%20new%20document%20under%20Bobbie%20Test%20Shared%20Site.docx&action=default&mobileredirect=true",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": ANY,
                    "linkVisibility": "unknown",
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
                },
                {
                    "createdAt": 1604076618,
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
                            "address": "lucas@thoughtlabs00.onmicrosoft.com",
                            "kind": "work",
                            "primary": True,
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "01TMD3YV4TY2JEV4VK7ZBLT3EJ5N434E6P",
                    "fileName": "Word doc in private test site created by Lucas .docx",
                    "iconUrl": "",
                    "webLink": "https://thoughtlabs00.sharepoint.com/sites/PrivateTestSiteCreatedByLucas/_layouts/15/Doc.aspx?sourcedoc=%7B4A92C693-AAF2-42FE-B9EC-89EB79BE13CF%7D&file=Word%20doc%20in%20private%20test%20site%20created%20by%20Lucas%20.docx&action=default&mobileredirect=true",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": ANY,
                    "lastModified": ANY,
                    "linkVisibility": "unknown",
                    "md5Checksum": "cb9548d3-89a2-4754-901f-9ee04bef60b0",
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
            "orderBy": "datetime",
            "pageCount": 1,
            "pageCountCacheTTL": 3600,
            "pageCountLastUpdated": ANY,
            "pageNumber": 1,
            "pageSize": 10,
            "parentId": "01D3GIE3GV6Y2GOVW442325BZO354PWSELRRZ",
            "platformId": "o365",
            "sort": "DESC",
        }

    def test_files_parent_folder_handler_with_bad_parent_id(
        self,
        handler,
        lambda_context,
        ms_drives_docs,
        platform,
        risks_files,
        drive_v3_filesmeta,
        admin_directory_v1_usersmeta,
        files_content_inspection,
    ):
        event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}
        response = handler.handle(event, lambda_context)
        assert response["statusCode"] == 400
        body = json_tools.loads(response["body"])
        assert body == {"message": "Invalid parent_id value: "}

        event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "pathParameters": {"parentId": "EIG9238492"},
        }
        response = handler.handle(event, lambda_context)
        assert response["statusCode"] == 400
        body = json_tools.loads(response["body"])
        assert body == {"message": "Invalid parent_id value: EIG9238492"}

    def test_files_parent_folder_handler_sql_injection(
        self, handler, lambda_context, drive_v3_filesmeta, platform, files_content_inspection
    ):
        event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "pathParameters": {
                "parentId": "foo'bar",
            },
        }
        handler.handle(event, lambda_context)
