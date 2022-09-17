import os
from unittest.mock import call, patch

import pytest
from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from services.delete_permissions_by_risk_id.delete_permissions_by_risk_id_handler import (
    DeletePermissionsByRiskIdHandler,
)

module_path = DeletePermissionsByRiskIdHandler.__module__


@pytest.mark.parametrize("platform, platform_id", [(Platform.GSUITE, 1), (Platform.O365, 2)])
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
    def test_event(self):
        return {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"risk-id": "risk_id_1"},
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
                }
            ],
        )

    @pytest.fixture
    def risk_files_records(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "risks_files",
            [
                {
                    "risk_id": "risk_id_1",
                    "risk_type_id": "3000",
                    "file_id": "file_id_1",
                    "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                    "permissions_emailAddress": "user_1@barracuda.io",
                    "owners_emailAddress": "user_2@owner.com",
                },
                {
                    "risk_id": "risk_id_1",
                    "risk_type_id": "3000",
                    "file_id": "file_id_2",
                    "permissions_id": "already deleted",
                    "permissions_emailAddress": "user_1@barracuda.io",
                    "owners_emailAddress": "user_3@owner.com",
                },
            ],
        )

    @pytest.fixture
    def top_risks_records(self, mysql_connect, platform, platform_id):
        pytest.helpers.insert_into_table(
            mysql_connect, "top_risks", [{"risk_id": "risk_id_1", "platform_id": platform_id}]
        )

    @pytest.fixture
    def platform_records(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "platform",
            [
                {"id": 1, "symbolic_name": "gsuite", "name": "Google Workspace"},
                {"id": 2, "symbolic_name": "o365", "name": "Microsoft Office 365"},
            ],
        )

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, mock_sqs_connect):
        configs_p = patch.object(DeletePermissionsByRiskIdHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            DeletePermissionsByRiskIdHandler, "sql_connect", return_value=mysql_connect
        )
        sqs_conn_p = patch(f"{module_path}.SqsConnect", return_value=mock_sqs_connect)
        with configs_p, sql_connect_p, sqs_conn_p:
            handler = DeletePermissionsByRiskIdHandler(enable_sentry=False, raise_errors=True)
            yield handler

    def test_handler(
        self,
        handler,
        mock_sqs_connect,
        lambda_context,
        test_event,
        ms_docs_permissions,
        files_meta_records,
        risk_files_records,
        top_risks_records,
        platform_records,
        mysql_connect,
        platform,
        platform_id,
    ):
        sqs_base_url = "https://sqs.us-west-2.amazonaws.com/0/thoughtlabs-local-"

        resp = handler.handle(test_event, lambda_context)
        assert resp == {
            "body": json_tools.dumps(
                {"count_of_permissions_removed": 1, "message": "Permissions queued for deletion"}
            ),
            "headers": {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "no-store",
                "Vary": "Authorization, Origin",
            },
            "isBase64Encoded": True,
            "statusCode": 200,
        }

        if platform == Platform.GSUITE:
            mock_sqs_connect.assert_has_calls(
                [
                    call.send_msg(
                        msg_body=json_tools.dumps(
                            {
                                "message_count": 1,
                                "message_number": 1,
                                "permission_details_list": [
                                    {
                                        "file_id": "file_id_1",
                                        "permission_email": "user_1@barracuda.io",
                                        "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                                        "owner_email": "user_2@owner.com",
                                    }
                                ],
                                "platform": platform.value,
                                "project_id": "thoughtlabs",
                                "risk_id": "risk_id_1",
                            }
                        ),
                        queue_url=f"{sqs_base_url}delete-permissions-orch-01",
                    )
                ]
            )
        else:
            mock_sqs_connect.assert_has_calls(
                [
                    call.send_msg(
                        msg_body=json_tools.dumps(
                            {
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
                                "risk_id": "risk_id_1",
                            }
                        ),
                        queue_url=f"{sqs_base_url}delete-permissions-orch-01",
                    )
                ]
            )
