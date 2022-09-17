from unittest.mock import patch

import pytest
from tools.lambda_handler import get_dummy_context
from tools.logger import Logger

from services.authorized_app_id_stats.authorized_app_id_stats_handler import (
    AuthorizedAppIdStatsHandler,
)


@patch.object(AuthorizedAppIdStatsHandler, "applications_manager")
@patch.object(AuthorizedAppIdStatsHandler, "get_epoch_months_ago")
def test_authorized_app_id_stats_handler(mock_date_label, mock_app_mgr, mock_config):
    input_event = {
        "requestContext": {"authorizer": {"project_id": "test-project"}},
        "pathParameters": {"applicationId": "test-app-id"},
        "queryStringParameters": {"event-type": "download", "page-size": "10", "page-number": "01"},
    }

    # Configure Mocks
    label = 1580515200
    mock_date_label.return_value = label
    mock_app_mgr.get.return_value = {"metric_value": 1}

    configs_p = patch.object(AuthorizedAppIdStatsHandler, "configs", mock_config)
    with configs_p:
        handler = AuthorizedAppIdStatsHandler(enable_sentry=False, raise_errors=True)
        context = get_dummy_context()
        context.function_name = "authorized-app-id-stats"

        # Call the function
        resp = handler.handle(input_event, context)

    # verify success
    mock_config.assert_not_called()
    handler.applications_manager.get.assert_any_call(
        client_id="test-app-id",
        metric_id="count_total_employees",
        metric_label=label,
        project_id=mock_config.project_name,
    )
    handler.applications_manager.get.assert_any_call(
        client_id="test-app-id",
        metric_id="count_people_who_authorized_app",
        metric_label=label,
        project_id=mock_config.project_name,
    )
    handler.applications_manager.get.assert_any_call(
        client_id="test-app-id",
        metric_id="count_risks_by_app",
        metric_label=label,
        project_id=mock_config.project_name,
    )

    handler.applications_manager.get.assert_any_call(
        client_id="test-app-id",
        metric_id="count_files_downloaded_by_app",
        metric_label=label,
        project_id=mock_config.project_name,
    )
    handler.applications_manager.get.assert_any_call(
        client_id="test-app-id",
        metric_id="count_total_sensitive_files",
        metric_label=label,
        project_id=mock_config.project_name,
    )
    handler.applications_manager.get.assert_any_call(
        client_id="test-app-id",
        metric_id="count_people_who_authorized_app_current",
        metric_label=label,
        project_id=mock_config.project_name,
    )
    handler.applications_manager.get.assert_any_call(
        client_id="test-app-id",
        metric_id="count_risks_by_app_current",
        metric_label=label,
        project_id=mock_config.project_name,
    )

    assert resp["statusCode"] == 200
    assert resp["body"].index("labels")
    assert resp["body"].index("series")
    assert resp["body"].index("associatedRisks")
    assert resp["body"].index("authorizedBy")
    assert resp["body"].index("fileDownloads")
    assert resp["body"].index("tileInfo")
    assert resp["body"].index("totalEmails")
    assert resp["body"].index("totalSensitive")


def test_authorized_app_id_stats_handler_failure(mock_config):
    input_event = {
        "requestContext": {"authorizer": {"project_id": "test-project"}},
        "pathParameters": {"applicationId": ""},
    }

    configs_p = patch.object(AuthorizedAppIdStatsHandler, "configs", mock_config)
    with configs_p:
        handler = AuthorizedAppIdStatsHandler(enable_sentry=False, raise_errors=True)
        context = get_dummy_context()
        context.function_name = "authorized-app-id-stats"

        response = handler.handle(input_event, context)
        assert response["statusCode"] == 400


@patch.object(AuthorizedAppIdStatsHandler, "applications_manager")
@patch.object(AuthorizedAppIdStatsHandler, "get_epoch_months_ago")
@pytest.mark.xfail()
def test_authorized_app_id_stats_handler_failure_with_invalid_metric_id(
    mock_date_label, mock_app_mgr, mock_config
):
    input_event = {
        "requestContext": {"authorizer": {"project_id": "test-project"}},
        "pathParameters": {"applicationId": "test-app-id"},
        "queryStringParameters": {"event-type": "download", "page-size": "10", "page-number": "01"},
    }

    # Configure Mocks
    label = "test-label"
    mock_date_label.return_value = label
    mock_app_mgr.get.return_value = {"metric_value": 1}

    configs_p = patch.object(AuthorizedAppIdStatsHandler, "configs", mock_config)
    with configs_p:
        handler = AuthorizedAppIdStatsHandler(enable_sentry=False, raise_errors=True)
        context = get_dummy_context()
        context.function_name = "authorized-app-id-stats"

        # Call the function
        resp = handler.handle(input_event, context)

        # verify success
        assert resp["statusCode"] == 200
        handler.applications_manager.get.assert_any_call(
            client_id="test-app-id",
            metric_id="check_invalid_metric_id",
            metric_label=label,
            project_id="test-project",
        )
