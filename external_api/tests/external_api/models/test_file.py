from unittest.mock import ANY, patch

import pytest
from tools.sql import SQLConnect

from external_api.models.file import File, map_role
from external_api.models.sensitive_phrases import MultiFileSensitivePhrases
from external_api.user.user_generator import UserGenerator
from external_api.utils.constants import GoogleTableNames

test_user_roles = [
    (
        [
            "commenter",
            "fileOrganizer",
            "organizer",
            "own",
            "owner",
            "admin",
            "read",
            "reader",
            "writer",
            "write",
        ],
        [
            "member",
            "manager",
            "manager",
            "owner",
            "owner",
            "admin",
            "member",
            "member",
            "manager",
            "manager",
        ],
    ),
    (
        ["user", "test", "fake", "unknown"],
        ["member", "member", "member", "member"],
    ),
]


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestFile:
    @pytest.fixture
    def test_file(self):
        return {
            "file_id": "1FV0SkHK_jjQSC-NRpkyVuyqwMZKKw4aP1lNOayBL2Gw",
            "file_name": "merit",
            "tin_count": 0,
            "ccn_count": 0,
            "kw_count_data": "[]",
            "created_at": 1613693987,
            "creator_email": "amol@thoughtlabs.io",
            "base.creator_email": "amol@thoughtlabs.io",
            "last_modified": 1613693994,
            "file_mimetype": "application/vnd.google-apps.document",
            "md5Checksum": "",
            "folder_id": "0AAIirW6trR84Uk9PVA",
            "folder_name": "My Drive",
            "platform": "gsuite",
            "platform_name": "Google Workspace",
            "last_ingested": 1613892643,
            "trashed": 0,
            "icon_link": "/16/type/application/vnd.google-apps.document",
            "permissions_domain": "gmail.com,thoughtlabs.io",
            "permissions_id": "17663922708776835730,15578356261102364698,11995125594131066371",
            "link_visibility": "user",
            "internal_access_list": "amol@thoughtlabs.io",
            "internal_access_count": 1,
            "internal_access_firstname_list": "Amol",
            "internal_access_lastname_list": "Patel",
            "internal_permissions_role": "owner",
            "internal_permissions_id": "11995125594131066371",
            "external_access_list": "mr.amolpatel@gmail.com,amol.canvas@gmail.com",
            "external_access_count": 2,
            "external_access_firstname_list": "Amol,Amol",
            "external_access_lastname_list": "Patel,Patel",
            "external_permissions_role": "writer,writer",
            "external_permissions_id": "17663922708776835730,15578356261102364698",
            "creator_lastname": "Patel",
            "creator_firstname": "Amol",
            "web_link": "https://docs.google.com/document/d/1FV0SkHK_jjQSC-NRpkyVuyqwMZKKw4aP1lNOayBL2Gw/edit",
        }

    @pytest.fixture
    def file_response(self):
        return {
            "createdAt": 1613693987,
            "createdBy": {
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
                "name": {"givenName": "Amol", "familyName": "Patel", "fullName": "Amol Patel"},
                "phones": [{"number": "+15555555555", "kind": "personal"}],
                "primaryEmail": {"address": "amol@thoughtlabs.io", "kind": "work", "primary": True},
                "projectId": "thoughtlabs",
                "userKind": "user",
            },
            "externalAccessCount": 2,
            "externalAccessList": [
                {
                    "accessLevel": "manager",
                    "altnetId": "45c63f50-55bf-54d9-a801-39c26bd5a49c",
                    "emails": [
                        {"address": "amol@thoughtlabs.io", "kind": "work"},
                        {"address": "amol@altitudenetworks.com", "kind": "personal"},
                        {"address": "amol.canvas@gmail.com", "kind": "personal"},
                    ],
                    "externalCount": 3,
                    "externalIds": [{"platform": "gsuite", "value": "17663922708776835730"}],
                    "internalCount": 1,
                    "name": {"givenName": "Amol", "familyName": "Patel", "fullName": "Amol Patel"},
                    "phones": [{"number": "+15555555555", "kind": "personal"}],
                    "primaryEmail": {"address": "mr.amolpatel@gmail.com", "kind": "personal"},
                    "projectId": "thoughtlabs",
                    "userKind": "person",
                },
                {
                    "accessLevel": "manager",
                    "altnetId": "45c63f50-55bf-54d9-a801-39c26bd5a49c",
                    "emails": [
                        {"address": "amol@thoughtlabs.io", "kind": "work"},
                        {"address": "amol@altitudenetworks.com", "kind": "personal"},
                        {"address": "mr.amolpatel@gmail.com", "kind": "personal"},
                    ],
                    "externalCount": 3,
                    "externalIds": [{"platform": "gsuite", "value": "15578356261102364698"}],
                    "internalCount": 1,
                    "name": {"givenName": "Amol", "familyName": "Patel", "fullName": "Amol Patel"},
                    "phones": [{"number": "+15555555555", "kind": "personal"}],
                    "primaryEmail": {"address": "amol.canvas@gmail.com", "kind": "personal"},
                    "projectId": "thoughtlabs",
                    "userKind": "person",
                },
            ],
            "fileId": "1FV0SkHK_jjQSC-NRpkyVuyqwMZKKw4aP1lNOayBL2Gw",
            "fileName": "merit",
            "iconUrl": "/256/type/application/vnd.google-apps.document",
            "internalAccessCount": 1,
            "internalAccessList": [
                {
                    "accessLevel": "owner",
                    "altnetId": "45c63f50-55bf-54d9-a801-39c26bd5a49c",
                    "emails": [
                        {"address": "amol@altitudenetworks.com", "kind": "personal"},
                        {"address": "mr.amolpatel@gmail.com", "kind": "personal"},
                        {"address": "amol.canvas@gmail.com", "kind": "personal"},
                    ],
                    "externalCount": 3,
                    "externalIds": [{"platform": "gsuite", "value": "11995125594131066371"}],
                    "internal": True,
                    "internalCount": 1,
                    "name": {"givenName": "Amol", "familyName": "Patel", "fullName": "Amol Patel"},
                    "phones": [{"number": "+15555555555", "kind": "personal"}],
                    "primaryEmail": {
                        "address": "amol@thoughtlabs.io",
                        "kind": "work",
                        "primary": True,
                    },
                    "projectId": "thoughtlabs",
                    "userKind": "user",
                }
            ],
            "lastIngested": ANY,
            "lastModified": ANY,
            "linkVisibility": "user",
            "md5Checksum": "",
            "mimeType": "document",
            "parentFolder": {"folderId": "0AAIirW6trR84Uk9PVA", "folderName": "My Drive"},
            "platformId": "gsuite",
            "platformName": "Google Workspace",
            "sensitivePhrases": {"ccNum": 0, "ssn": 0, "sensitiveKeywords": []},
            "sharedToDomains": [
                {"name": "gmail.com", "permissionId": "17663922708776835730"},
                {"name": "thoughtlabs.io", "permissionId": "15578356261102364698"},
            ],
            "trashed": False,
            "webLink": "https://docs.google.com/document/d/1FV0SkHK_jjQSC-NRpkyVuyqwMZKKw4aP1lNOayBL2Gw/edit",
        }

    def clear_tables(self, sql_connect):
        with sql_connect.open():
            sql_connect.execute_query(f"DELETE FROM {GoogleTableNames.ADMIN_USERSMETA.value}")

    @pytest.fixture
    def admin_usersmeta(self, mysql_connect, admin_directory_v1_usersmeta_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.ADMIN_USERSMETA.value,
            admin_directory_v1_usersmeta_data,
        )

    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture
    def user_generator(self, mysql_connect, users_manager):
        sql_connect_p = patch.object(UserGenerator, "sql_connect", mysql_connect)
        users_mgr_p = patch.object(UserGenerator, "users_manager", users_manager)
        with sql_connect_p, users_mgr_p:
            user_gen = UserGenerator
            yield user_gen

    @pytest.fixture
    def file_handler(self, user_generator, users_manager):
        users_gen_p = patch("external_api.models.file.UserGenerator", user_generator)
        with users_gen_p:
            yield File

    def test_file_from_sql_to_api_dm(
        self,
        test_file,
        file_response,
        admin_usersmeta,
        file_handler,
        mock_config,
    ) -> None:
        file_info = file_handler.from_sql_dm(
            config=mock_config, platform="gsuite", attrs=test_file
        ).to_api_dm()
        print(file_info)
        assert file_info == file_response

    def test_multi_file_sensitive_phrases(
        self,
        test_file,
        file_response,
        admin_usersmeta,
        file_handler,
    ) -> None:
        test_input = [
            {
                "file_id": "1x1L8F-rzi12dKxyPA5IAvHP7u2Q7j39VPEZ3_LR64ag",
                "tin_count": 51,
                "ccn_count": 306,
                "kw_count_data": '[{"count": 51, "keyword": "Attorney"}, {"count": 51, "keyword": "Attorney/Client"}, {"count": 21, "keyword": "acme"}, {"count": 51, "keyword": "board meeting"}, {"count": 7, "keyword": "chopper"}, {"count": 14, "keyword": "drainage"}, {"count": 7, "keyword": "erase"}, {"count": 7, "keyword": "merit"}, {"count": 7, "keyword": "payday"}, {"count": 51, "keyword": "proprietary"}, {"count": 7, "keyword": "repay"}, {"count": 7, "keyword": "shadow"}, {"count": 7, "keyword": "solo"}, {"count": 7, "keyword": "tactics"}, {"count": 7, "keyword": "trouble"}, {"count": 7, "keyword": "wallet"}]',
            },
            {
                "file_id": "1Ygl4Xn7jM6r_z_GlaGjqWbtMg8GKUJJDGqTX7QEBf_4",
                "tin_count": 1,
                "ccn_count": 6,
                "kw_count_data": '[{"count": 1, "keyword": "Attorney"}, {"count": 1, "keyword": "Attorney/Client"}, {"count": 3, "keyword": "acme"}, {"count": 1, "keyword": "board meeting"}, {"count": 1, "keyword": "chopper"}, {"count": 2, "keyword": "drainage"}, {"count": 1, "keyword": "erase"}, {"count": 1, "keyword": "merit"}, {"count": 1, "keyword": "payday"}, {"count": 1, "keyword": "proprietary"}, {"count": 1, "keyword": "repay"}, {"count": 1, "keyword": "shadow"}, {"count": 1, "keyword": "solo"}, {"count": 1, "keyword": "tactics"}, {"count": 1, "keyword": "trouble"}, {"count": 1, "keyword": "wallet"}]',
            },
            {
                "file_id": "1IWzk7CMmhOsU5BojXk00Rg24KPfmaWwSW2Hlvc_uZsw",
                "tin_count": 0,
                "ccn_count": 0,
                "kw_count_data": "[]",
            },
            {
                "file_id": "1-IorGDPVhtbcYrndTe1slNGTIyWZjW05BIa0Xo1ZOSs",
                "tin_count": 0,
                "ccn_count": 0,
                "kw_count_data": '[{"count": 9, "keyword": "acme"}, {"count": 3, "keyword": "chopper"}]',
            },
        ]

        sensitive_phrases = MultiFileSensitivePhrases.from_sql_dm(test_input).to_api_dm()
        assert sensitive_phrases == {
            "ccNumFileCount": 2,
            "sensitiveKeywordsFileCount": 3,
            "ssnFileCount": 2,
        }

    @pytest.mark.parametrize("test_event, test_result", test_user_roles)
    def test_user_role_mapping(self, test_event, test_result) -> None:
        for event, result in zip(test_event, test_result):
            assert map_role(event) == result
