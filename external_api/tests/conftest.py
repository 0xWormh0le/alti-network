from importlib import resources
from typing import Optional
from unittest.mock import MagicMock

import pytest
import tools.testing
from tools import json_tools
from tools.catalogs import Platform
from tools.config import Config
from tools.logger import Logger
from tools.retry_backoff_class import RetryAndCatch
from tools.sqs_connect import SqsConnect
from tools.sqs_resource import SqsResource

from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate
from tests import payloads

pytest_plugins = [
    "helpers_namespace",
    "monkeypatch",
    "tests.sql.fixtures",
    "tests.dynamo.fixtures",
]

dynamodb_local = pytest.fixture(scope="session")(tools.testing.dynamodb_local)
mysql_route = pytest.fixture(scope="session")(tools.testing.mysql_route)
postgresql_route = pytest.fixture(scope="session")(tools.testing.postgresql_route)
sql_connect = pytest.fixture(scope="session")(ExternalApiHandlerTemplate.sql_connect)


def pytest_addoption(parser):
    tools.testing.register_cli_options_rm_containers(parser)
    tools.testing.register_cli_options_mysql(parser)
    tools.testing.register_cli_options_postgresql(parser)


def assert_dict_contains(d: dict, expected: Optional[dict] = None) -> None:
    __tracebackhide__ = True
    missing = object()
    if not isinstance(expected, dict):
        pytest.fail(f"Not a dict: {d}")
    diff = {}
    for key in expected.keys():
        if key not in d:
            diff[key] = (missing, expected[key])
        elif d[key] != expected[key]:
            diff[key] = (d[key], expected[key])
    if diff:
        key_length = max(len(key) for key in diff.keys())
        lines = ["dict keys mismatch:", "{"]
        for key, (value, expected) in diff.items():
            lines.append(
                f"  {repr(key) + ':':<{key_length + 3}} "
                f"{'missing' if value is missing else repr(value)} != {expected!r}"
            )
        lines.append("}")
        pytest.fail("\n".join(lines))


# Per <https://github.com/pytest-dev/pytest/issues/363#issuecomment-406536200>:
@pytest.fixture(scope="session")
def session_monkeypatch(request):
    from _pytest.monkeypatch import MonkeyPatch

    session_monkeypatch = MonkeyPatch()
    yield session_monkeypatch
    session_monkeypatch.undo()


@pytest.fixture(autouse=True, scope="session")
def set_env(session_monkeypatch):
    session_monkeypatch.setenv("ENV", "local")
    session_monkeypatch.setenv("SUFFIX", "01")


@pytest.fixture(autouse=True, scope="session")
def disable_aws(request, session_monkeypatch):
    if request.node.get_closest_marker("integration"):
        # Do not disable AWS for integration tests.
        pass
    else:
        session_monkeypatch.delenv("AWS_PROFILE", raising=False)
        session_monkeypatch.setenv("AWS_ACCESS_KEY_ID", "none")
        session_monkeypatch.setenv("AWS_SECRET_ACCESS_KEY", "none")
        session_monkeypatch.setenv("AWS_SESSION_TOKEN", "none")


@pytest.fixture
def no_retry():
    with RetryAndCatch.no_retry():
        yield


@pytest.fixture
def no_backoff():
    with RetryAndCatch.no_backoff():
        yield


@pytest.fixture
def mock_config():
    config = MagicMock(spec=Config)
    config.project_name = "thoughtlabs"
    config.env = "test"
    config.aws_region = "test"
    config.suffix = "01"
    config.db_ro_endpoint = "db_ro_endpoint"
    config.readonly_user = "readonly_user"
    config.endpoint = "endpoint"
    config.readwrite_user = "readwrite_user"
    config.db_name = "db_name"
    config.db_port = "db_port"
    config.db_iam_auth = "db_iam_auth"
    config.company_name = "Thoughtlabs.io"
    config.domains = [
        "thoughtlabs.io",
        "thoughtlabs00.onmicrosoft.com",
        "thought.labs",
        "thoughtlabs.xyz",
    ]
    config.return_value.project_name = "test-project"
    config.segment_key = "test-key"
    config.gs_admin_user_email = "admin@test-domain.com"
    config.gs_sa_dev_json_filename = "test-gs-configs"
    config.risk_summary_email_addresses = ["test-email@domain.exist"]
    config.s3_bucket = "test-bucket"
    config.get_scopes.return_value = ["https://www.googleapis.com/auth/drive"]
    config.cognito_user_pool_id = "test-cognito-id"
    config.altitude_user_stats_metrics_partition_count = 2
    config.altitude_users_partition_count = 1
    config.status = "active"
    config.table_name = "configs"
    config.cors_domains = set("*")
    config.platforms_as_enum = [Platform.GSUITE, Platform.O365]
    config.get_attribute.return_value = ["gsuite"]
    return config


@pytest.fixture
def mock_ses_alert():
    mock_alert = MagicMock()
    mock_alert.return_value = {
        "MessageId": "01010171e0b3237e-8a01f436-dc54-4a66-83ac-bdd398188db8-000000",
        "ResponseMetadata": {
            "RequestId": "05623422-16bf-456b-828b-0768e9f2631a",
            "HTTPStatusCode": 200,
            "HTTPHeaders": {
                "x-amzn-requestid": "05623422-16bf-456b-828b-0768e9f2631a",
                "content-type": "text/xml",
                "content-length": "326",
                "date": "Mon, 15 October 2020 17:19:28 GMT",
            },
            "RetryAttempts": 0,
        },
    }
    return mock_alert


@pytest.fixture
def mock_sqs_resource():
    sqs_resource = MagicMock(spec=SqsResource)
    sqs_resource.get_q_name.return_value = "thoughtlabs-test-sqs-queue"
    sqs_resource.get_q_url.return_value = (
        "https://sqs-test-.amazonaws.com/000/thoughtlabs-test-sqs-queue"
    )
    sqs_resource.get_q_arn.return_value = "arn:aws:sqs:test:000:thoughtlabs-test-sqs-queue"
    return sqs_resource


@pytest.fixture
def mock_sqs_connect():
    sqs_queue = MagicMock(spec=SqsConnect)
    sqs_queue.return_value.queue_exists.return_value = "true"
    sqs_queue.send_msg.return_value = {
        "MD5OfMessageBody": "test-msg-mock",
        "MD5OfMessageAttributes": "test-msg-mock",
        "MessageId": "test-msg-mock",
        "SequenceNumber": "test-msg-mock",
        "ResponseMetadata": {
            "RetryAttempts": int,
            "HTTPStatusCode": 200,
            "RequestId": "test-msg-mock",
            "HTTPHeaders": {
                "x-amzn-requestid": "test-msg-mock",
                "content-length": "int",
                "server": "Server",
                "connection": "keep-alive",
                "date": "Tue, 17 Nov 2020 02:24:22 GMT",
                "content-type": "text/xml",
            },
        },
    }
    sqs_queue.receive_msg.return_value = {
        "Messages": [
            {
                "MessageId": "test-msg",
                "ReceiptHandle": "test-msg",
                "MD5OfBody": "test-msg",
                "Body": "test-msg",
                "Attributes": {"test-msg-attr": "test-msg-value"},
                "MD5OfMessageAttributes": "test-msg",
                "MessageAttributes": {
                    "test-msg": {
                        "StringValue": "test-msg",
                        "BinaryValue": b"bytes",
                        "StringListValues": [
                            "test-msg",
                        ],
                        "BinaryListValues": [
                            b"bytes",
                        ],
                        "DataType": "test-msg",
                    }
                },
            },
        ]
    }
    return sqs_queue


@pytest.fixture
def mock_segment_connector():
    mock_segment = MagicMock()
    mock_segment.return_value.track.return_value = None
    mock_segment.return_value.alias.return_value = None
    mock_segment.return_value.identify.return_value = None
    mock_segment.return_value.page.return_value = None
    mock_segment.return_value.group.return_value = None
    return mock_segment


@pytest.helpers.register
def create_test_payload(job_name):
    """Helper function to open test payload files"""
    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, f"test_event_{job_name}.json"))
    logger.json(test_event, name="test_event")
    return test_event
