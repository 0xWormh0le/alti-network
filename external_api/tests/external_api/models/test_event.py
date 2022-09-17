from unittest.mock import patch

import pytest
from tools.catalogs import Platform
from tools.sql import SQLConnect

from external_api.models.event import Event
from external_api.utils.constants import GoogleTableNames


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestEvent:
    @pytest.fixture
    def test_event(self):
        return {
            "event_id": "7567771728085732868",
            "event_name": "download",
            "event_type": "access",
            "event_description": "unknown",
            "file_id": "1t7jWcnCxSbE8FJHl4uzSw87xoa_qb7hW",
            "file_name": "CMakeLists.txt",
            "datetime": 1609288723,
            "ipaddress": "35.155.135.135",
            "membership_change_type": None,
            "old_value": None,
            "new_value": None,
            "source_folder_title": None,
            "destination_folder_title": None,
            "old_visibility": None,
            "new_visibility": "private",
            "visibility_change": None,
            "creator_email": "bobbie@thoughtlabs.io",
            "folder_id": "1bqFCpP4meC3vVnuYL0PQZpIgi5pak8fe",
            "folder_name": "ch3-4",
            "platform_name": "Google Workspace",
            "creator_firstname": "Bobbie",
            "creator_lastname": "Hawaii",
            "actor_email": "bobbie@thoughtlabs.io",
            "actor_firstname": "Bobbie",
            "actor_lastname": "Hawaii",
            "target_email": None,
            "target_firstname": None,
            "target_lastname": None,
            "target_user_domain": None,
        }

    @pytest.fixture
    def event_response(self):
        return {
            "actor": {
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
                    "givenName": "Bobbie",
                    "familyName": "Hawaii",
                    "fullName": "Bobbie Hawaii",
                },
                "phones": [{"number": "+15555555555", "kind": "personal"}],
                "primaryEmail": {
                    "address": "bobbie@thoughtlabs.io",
                    "kind": "work",
                    "primary": True,
                },
                "projectId": "thoughtlabs",
                "userKind": "user",
            },
            "datetime": 1609288723,
            "destinationFolderTitle": None,
            "eventDescription": "unknown",
            "eventId": "7567771728085732868",
            "eventName": "download",
            "exposure": "external",
            "files": [
                {
                    "createdAt": 0,
                    "createdBy": {
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
                            "givenName": "Bobbie",
                            "familyName": "Hawaii",
                            "fullName": "Bobbie Hawaii",
                        },
                        "phones": [{"number": "+15555555555", "kind": "personal"}],
                        "primaryEmail": {
                            "address": "bobbie@thoughtlabs.io",
                            "kind": "work",
                            "primary": True,
                        },
                        "projectId": "thoughtlabs",
                        "userKind": "user",
                    },
                    "externalAccessCount": 0,
                    "externalAccessList": [],
                    "fileId": "1t7jWcnCxSbE8FJHl4uzSw87xoa_qb7hW",
                    "fileName": "CMakeLists.txt",
                    "iconUrl": "",
                    "internalAccessCount": 0,
                    "internalAccessList": [],
                    "lastIngested": 0,
                    "lastModified": 0,
                    "linkVisibility": "unknown",
                    "md5Checksum": "",
                    "mimeType": "",
                    "parentFolder": {
                        "folderId": "1bqFCpP4meC3vVnuYL0PQZpIgi5pak8fe",
                        "folderName": "ch3-4",
                    },
                    "platformId": "gsuite",
                    "platformName": "Google Workspace",
                    "sensitivePhrases": {"ccNum": 0, "ssn": 0, "sensitiveKeywords": []},
                    "sharedToDomains": [],
                    "trashed": False,
                    "webLink": "",
                }
            ],
            "ipAddress": "35.155.135.135",
            "membershipChangeType": None,
            "newValue": None,
            "newVisibility": "private",
            "oldValue": None,
            "oldVisibility": None,
            "sourceFolderTitle": None,
            "targetPeople": [],
            "visibilityChange": None,
        }

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
    def event_handler(self, mock_config):
        configs_p = patch("external_api.models.event.Config", mock_config)
        with configs_p:
            yield Event

    def test_event_from_sql_to_api_dm(
        self,
        test_event,
        event_response,
        admin_usersmeta,
        event_handler,
        mock_config,
        user_generator,
    ) -> None:
        event_info = event_handler.from_sql_dm(
            config=mock_config, platform=Platform.GSUITE, attrs=test_event
        ).to_api_dm()
        print(event_info)
        assert event_info == event_response
