import importlib.resources as pkg_resources
from unittest.mock import MagicMock, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context

from services.delete_permission_id.delete_permission_id_handler import DeletePermissionIdHandler
from tests import payloads


@patch.object(DeletePermissionIdHandler, "run_read_query")
@patch.object(DeletePermissionIdHandler, "run_write_query")
@patch.object(DeletePermissionIdHandler, "get_permissions_connector")
class TestDeletePermissionIdHandler:
    @pytest.fixture
    def handler(self, mock_config):
        configs_p = patch.object(DeletePermissionIdHandler, "configs", mock_config)
        with configs_p:
            handler = DeletePermissionIdHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture(scope="class")
    def test_event(self):
        return json_tools.loads(
            pkg_resources.read_text(payloads, "test_event_delete_permission_id.json")
        )

    @pytest.fixture(scope="class")
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "delete-permission-id"

        return test_context

    @pytest.fixture(autouse=True, scope="class")
    def mock_run_read_query(self):
        query_runner = MagicMock()
        query_runner.return_value = [{"owner_email": "michael@thoughtlabs.io"}]

        return query_runner

    @patch("services.delete_permission_id.delete_permission_id_handler.SqsResource")
    @patch("services.delete_permission_id.delete_permission_id_handler.SqsConnect")
    def test_delete_permission_id_handler(
        self,
        MockSqsConnect,
        MockSqsResource,
        mock_permissions_connector,
        mock_run_read_query_func,
        test_event,
        test_context,
        handler,
        mock_run_write_query,
        mock_run_read_query,
    ):
        mock_run_read_query_func.return_value = mock_run_read_query()
        mock_run_write_query.return_value = {}

        mock_sqs_connect = MockSqsConnect()
        mock_sqs_connect.send_msg.return_value = ""
        mock_sqs_connect.return_value.queue_exists.return_value = ""
        mock_sqs_resource = MockSqsResource()
        mock_sqs_resource.get_q_url.return_value = ""
        mock_permissions_connector.return_value.delete_permission.return_value = None
        resp = handler.handle(test_event, test_context)

        assert resp["statusCode"] == 200
        handler.run_read_query.assert_any_call(
            file_path=handler.sql_path / "get_file_owner_info_query.sql",
            query_params={"file_id": "1O_uFvP-OXajpmZHB9NssdOyeQcJOxYMg"},
        )
        mock_sqs_resource.get_q_url.assert_called_once_with("files-details-etl")
        mock_sqs_connect.send_msg.assert_called_once_with(
            queue_url="",
            msg_body=json_tools.dumps(
                {
                    "project_id": handler.configs.project_name,
                    "job_name": "drive_v3_file_details",
                    "file_id": ["1O_uFvP-OXajpmZHB9NssdOyeQcJOxYMg"],
                    "uid": ["michael@thoughtlabs.io"],
                }
            ),
            delay_seconds=30,
        )

    @patch("services.delete_permission_id.delete_permission_id_handler.SqsResource")
    @patch("services.delete_permission_id.delete_permission_id_handler.SqsConnect")
    def test_delete_permission_id_handler(
        self,
        MockSqsConnect,
        MockSqsResource,
        mock_permissions_connector,
        mock_run_write_query,
        mock_run_read_query_func,
        monkeypatch,
        test_event,
        test_context,
        handler,
        mock_run_read_query,
    ):
        test_event = json_tools.loads(
            pkg_resources.read_text(payloads, "test_event_delete_permission_id_2.json")
        )
        mock_run_read_query_func.return_value = mock_run_read_query()
        mock_run_write_query.return_value = {}

        handler.configs.get_scopes.return_value = ["https://www.googleapis.com/auth/drive"]

        mock_sqs_connect = MockSqsConnect()
        mock_sqs_connect.send_msg.return_value = ""
        mock_sqs_connect.return_value.queue_exists.return_value = ""
        mock_sqs_resource = MockSqsResource()
        mock_sqs_resource.get_q_url.return_value = ""
        mock_permissions_connector.return_value.delete_permission.return_value = None
        monkeypatch.setenv("SUFFIX", "01")
        resp = handler.handle(test_event, test_context)

        assert resp["statusCode"] == 200

        mock_sqs_resource.get_q_url.assert_any_call("files-details-etl-01")
        handler.run_write_query.assert_any_call(
            table_name="drive_v3_filesmeta",
            file_path=handler.sql_path / "update_permissions_query.sql",
            query_params={
                "file_id": "1pY55hCKgoXVkp_7_qpQevyidt-wJLmXE",
                "permission_id": "anyoneWithLink",
                "status": "REMOVED",
            },
        )
        mock_sqs_connect.send_msg.assert_any_call(
            queue_url="",
            msg_body=json_tools.dumps(
                {
                    "project_id": handler.configs.project_name,
                    "job_name": "drive_v3_file_details",
                    "file_id": ["1pY55hCKgoXVkp_7_qpQevyidt-wJLmXE"],
                    "uid": ["michael@thoughtlabs.io"],
                }
            ),
            delay_seconds=30,
        )
