from unittest.mock import call, patch

import pytest
from tools import json_tools
from tools.catalogs import Platform
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import (
    DELETE_PERM_QUEUE,
    RISK_PENDING_STATUS,
    GoogleTableNames,
    MicrosoftTableNames,
)
from services.delete_permissions_orch.delete_permissions_orch_handler import (
    DeletePermissionsOrchHandler,
)

module_path = DeletePermissionsOrchHandler.__module__


@pytest.mark.parametrize(
    "platform, table_name",
    [
        (Platform.GSUITE, GoogleTableNames.FILESMETA.value),
        (Platform.O365, MicrosoftTableNames.MS_DRIVES_PERMISSIONS.value),
    ],
)
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
    def test_event(self, platform, table_name):
        return {
            "platform": platform.value,
            "risk_id": "risk_id_one",
            "permission_details_list": [
                {
                    "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                    "file_id": "file_id_1",
                    "permission_email": "user_1@barracuda.com",
                }
            ],
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
                },
            ],
        )

    @pytest.fixture
    def top_risks_records(self, mysql_connect):
        pytest.helpers.insert_into_table(mysql_connect, "top_risks", [{"risk_id": "risk_id_one"}])

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, mock_sqs_connect):
        configs_p = patch.object(DeletePermissionsOrchHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            DeletePermissionsOrchHandler, "sql_connect", return_value=mysql_connect
        )
        with configs_p, sql_connect_p:
            handler = DeletePermissionsOrchHandler(enable_sentry=False, raise_errors=True)
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
        table_name,
    ):
        resp = handler.handle(test_event, lambda_context)

        mock_sqs_connect.assert_has_calls(
            [
                call.send_msg(
                    msg_body=json_tools.dumps(
                        {
                            "permission_details": {
                                "file_id": "file_id_1",
                                "permission_email": "user_1@barracuda.com",
                                "permissions_id": "af0c0c1c72fa5e716ff2dad135d95b5a",
                            },
                            "project_id": "thoughtlabs",
                            "platform": platform.value,
                        }
                    ),
                    queue_url="https://sqs.us-west-2.amazonaws.com/0/thoughtlabs-local-delete-permission-id-01",
                )
            ]
        )
