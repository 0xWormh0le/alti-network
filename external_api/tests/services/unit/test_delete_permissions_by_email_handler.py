from unittest.mock import call, patch

import pytest
from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from services.delete_permissions_by_email.delete_permissions_by_email_handler import (
    DeletePermissionsByEmailHandler,
)

module_path = DeletePermissionsByEmailHandler.__module__


@pytest.mark.parametrize("platform", [Platform.GSUITE, Platform.O365])
class TestMsDeletePermission:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "ms-delete-permission"
        return lambda_context

    @pytest.fixture
    def test_event(self, platform):
        return {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {
                "email": "user_1@barracuda.io",
                "platform-ids": f'["{platform.value}"]',
            },
        }

    @pytest.fixture
    def ms_docs_permissions(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "ms_drives_docs_permissions",
            [
                {
                    "ms_doc_id": "file_id_1",
                    "ms_id": "id_one",
                    "link_scope": "domain",
                    "granted_to_type": "user",
                    "granted_to_email": "user_1@barracuda.io",
                    "granted_to_id": "granted_to_id_1",
                },
            ],
        )

    @pytest.fixture
    def files_meta_records(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "drive_v3_filesmeta",
            [
                {
                    "file_id": "file_id_1",
                    "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                    "permissions_emailAddress": "user_1@barracuda.io",
                    "permissions_role": "reader",
                    "permissions_status": "ACTIVE",
                    "owners_emailAddress": "owner@barracuda.com",
                },
            ],
        )

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, mock_sqs_connect):
        configs_p = patch.object(DeletePermissionsByEmailHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            DeletePermissionsByEmailHandler, "sql_connect", return_value=mysql_connect
        )
        with configs_p, sql_connect_p:
            handler = DeletePermissionsByEmailHandler(enable_sentry=False, raise_errors=True)
            handler._sqs_connect = mock_sqs_connect

            yield handler

    def test_handler(
        self,
        handler,
        mock_sqs_connect,
        lambda_context,
        test_event,
        ms_docs_permissions,
        files_meta_records,
        mysql_connect,
        platform,
    ):
        sqs_base_url = "https://sqs.us-west-2.amazonaws.com/0/thoughtlabs-local-"

        resp = handler.handle(test_event, lambda_context)

        if platform == Platform.GSUITE:
            mock_sqs_connect.assert_has_calls(
                [
                    call.send_msg(
                        msg_body=json_tools.dumps(
                            {
                                "email": "user_1@barracuda.io",
                                "message_count": 1,
                                "message_number": 1,
                                "permission_details_list": [
                                    {
                                        "file_id": "file_id_1",
                                        "permission_email": "user_1@barracuda.io",
                                        "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                                        "owner_email": "owner@barracuda.com",
                                    }
                                ],
                                "platform": platform.value,
                                "project_id": "thoughtlabs",
                            }
                        ),
                        queue_url=f"{sqs_base_url}delete-permissions-orch-01",
                    ),
                    call.send_msg(
                        msg_body=json_tools.dumps(
                            {
                                "action": "update_status",
                                "email": "user_1@barracuda.io",
                                "new_status": "PENDING",
                                "project_id": "thoughtlabs",
                            }
                        ),
                        queue_url=f"{sqs_base_url}update-email-address-01",
                    ),
                ]
            )
        else:
            mock_sqs_connect.assert_has_calls(
                [
                    call.send_msg(
                        msg_body=json_tools.dumps(
                            {
                                "email": "user_1@barracuda.io",
                                "message_count": 1,
                                "message_number": 1,
                                "permission_details_list": [
                                    {
                                        "file_id": "file_id_1",
                                        "permission_email": "user_1@barracuda.io",
                                        "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                                    }
                                ],
                                "platform": platform.value,
                                "project_id": "thoughtlabs",
                            }
                        ),
                        queue_url=f"{sqs_base_url}delete-permissions-orch-01",
                    )
                ]
            )
