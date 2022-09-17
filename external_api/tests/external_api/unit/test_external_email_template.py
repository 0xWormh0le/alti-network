from unittest.mock import patch

import pytest
from tools.lambda_handler.lambda_context import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.external_email_template import ExternalEmailTemplate


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestExternalEmailTemplate:
    class Handler(ExternalEmailTemplate):
        def get_response(self, event):
            ...

    @pytest.fixture
    def raw_lambda_context(self):
        return get_dummy_context()

    @pytest.fixture
    def test_results(self):
        return {
            "daily_risks": [
                {
                    "risk_count": 1,
                    "risk_desc": "Non-Company Owned Potentially Sensitive File Shared to Personal Email Account",
                    "risk_type_id": 2003,
                    "risks_created": 2,
                    "severity": 8,
                },
                {
                    "risk_count": 1,
                    "risk_desc": "Potentially Sensitive File Non Company owned file Shared by Link - Externally Accessible",
                    "risk_type_id": 1023,
                    "risks_created": 2,
                    "severity": 6,
                },
                {
                    "risk_count": 1,
                    "risk_desc": "Most Shared Files (Non-Company Owned)",
                    "risk_type_id": 10,
                    "risks_created": 2,
                    "severity": 5,
                },
                {
                    "risk_count": 2,
                    "risk_desc": "Many files downloaded in 24 hours by non-employee",
                    "risk_type_id": 3200,
                    "risks_created": 2,
                    "severity": 7,
                },
                {
                    "risk_count": 2,
                    "risk_desc": "Many files downloaded in 24 hours by employee",
                    "risk_type_id": 3100,
                    "risks_created": 2,
                    "severity": 6,
                },
                {
                    "risk_count": 2,
                    "risk_desc": "Many company owned files downloaded in 24 hours by app on behalf of a user",
                    "risk_type_id": 3010,
                    "risks_created": 2,
                    "severity": 5,
                },
                {
                    "risk_count": 2,
                    "risk_desc": "Non Company Owned File Shared by Link - Externally Accessible",
                    "risk_type_id": 1022,
                    "risks_created": 2,
                    "severity": 4,
                },
                {
                    "risk_count": 2,
                    "risk_desc": "Most Shared Files (Company Owned)",
                    "risk_type_id": 0,
                    "risks_created": 2,
                    "severity": 5,
                },
                {
                    "risk_count": 3,
                    "risk_desc": "Non-Company Owned File Shared to Personal Email Account",
                    "risk_type_id": 2002,
                    "risks_created": 2,
                    "severity": 5,
                },
                {
                    "risk_count": 6,
                    "risk_desc": "Company Owned File Shared by Link - Externally Accessible",
                    "risk_type_id": 1020,
                    "risks_created": 2,
                    "severity": 8,
                },
                {
                    "risk_count": 7,
                    "risk_desc": "Potentially Sensitive File Shared to Personal Email Account",
                    "risk_type_id": 2001,
                    "risks_created": 2,
                    "severity": 8,
                },
                {
                    "risk_count": 9,
                    "risk_desc": "Company Owned File Shared to Personal Email Account",
                    "risk_type_id": 2000,
                    "risks_created": 2,
                    "severity": 5,
                },
            ]
        }

    @pytest.fixture
    def handler(self, mock_config, mysql_route):
        configs_p = patch.object(self.Handler, "configs", mock_config)
        sql_connect_p = patch.object(
            self.Handler, "sql_connect", return_value=SQLConnect(mysql_route)
        )
        with configs_p, sql_connect_p:
            handler = TestExternalEmailTemplate.Handler(enable_sentry=False, raise_errors=True)
            yield handler

    @patch.object(ExternalEmailTemplate, "ses_alert")
    @patch.object(ExternalEmailTemplate, "risks_url")
    @patch.object(ExternalEmailTemplate, "risk_type_url")
    def test_send_user_emails(
        self,
        mock_risk_type_url,
        mock_risks_url,
        mock_ses_alert,
        handler,
        test_results,
        mock_config,
        raw_lambda_context,
    ):
        raw_event = {
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
            "queryStringParameters": {"page-size": "4000"},
        }
        mock_risks_url.return_value = "test-url"
        mock_risk_type_url.return_value = "test-risk-type-url"
        mock_ses_alert.send.return_value = ["test-email-sent"]
        handler.handle(raw_event, raw_lambda_context)

        assert handler.verify_risk_summary_results_are_grouped(test_results["daily_risks"])
