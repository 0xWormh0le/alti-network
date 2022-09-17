from unittest.mock import ANY, MagicMock, patch

import pytest
from tools import json_tools
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from external_api.utils.constants import GoogleTableNames, MicrosoftTableNames
from services.risk_summary_emails.risk_summary_emails_handler import SummaryEmailsHandler


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestSummaryEmailsHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

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
    def top_risks(self, mysql_connect, top_risks_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.TOP_RISKS.value,
            top_risks_data,
        )

    @pytest.fixture
    def test_results(self):
        return {
            "daily_risks": [
                {
                    "risk_count": 2,
                    "risk_desc": "Many files downloaded in 24 hours by non-employee",
                    "risk_type_id": 3200,
                    "severity": 7,
                }
            ],
            "risk_metrics": [],
            "1021": {
                "count": 1,
                "desc": "Non-Company Owned Potentially Sensitive File Shared to Personal Email Account",
                "risk_type_id": 1021,
                "risks_created": 2,
                "severity": 8,
            },
            "1011": {
                "count": 1,
                "desc": "Potentially Sensitive File Non Company owned file Shared by Link - Externally Accessible",
                "risk_type_id": 1011,
                "risks_created": 2,
                "severity": 6,
            },
            "2001": {
                "count": 7,
                "desc": "Potentially Sensitive File Shared to Personal Email Account",
                "risk_type_id": 2001,
                "risks_created": 2,
                "severity": 8,
            },
            "3100": {
                "count": 2,
                "desc": "Many files downloaded in 24 hours by employee",
                "risk_type_id": 3100,
                "risks_created": 2,
                "severity": 6,
            },
            "3010": {
                "count": 2,
                "desc": "Many company owned files downloaded in 24 hours by app on behalf of a user",
                "risk_type_id": 3010,
                "risks_created": 2,
                "severity": 5,
            },
        }

    @pytest.fixture
    def mock_get_rendered_emails(self):
        mock_rendered_emails = MagicMock()
        mock_rendered_emails.return_value = "Here is the rendered email"
        return mock_rendered_emails

    @pytest.fixture
    def handler(
        self,
        mock_config,
        mysql_connect,
        mock_ses_alert,
        test_results,
    ):
        configs_p = patch.object(SummaryEmailsHandler, "configs", mock_config)
        sql_connect_p = patch.object(
            SummaryEmailsHandler, "sql_connect", return_value=mysql_connect
        )
        ses_alert_p = patch.object(SummaryEmailsHandler, "ses_alert", mock_ses_alert)
        metrics_p = patch.object(
            SummaryEmailsHandler, "create_risk_summary_metrics", return_value={}
        )
        risk_metric_p = patch.object(
            SummaryEmailsHandler, "compute_risk_metrics", return_value=test_results
        )
        with configs_p, sql_connect_p, ses_alert_p, metrics_p, risk_metric_p:
            handler = SummaryEmailsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def test_event(self):
        return {"project_id": "test-project"}

    @pytest.fixture
    def test_context(self):
        test_context = get_dummy_context()
        test_context.function_name = "risk-summary-emails"
        return test_context

    def test_risk_summary_emails_handler_with_success(
        self,
        top_risks,
        test_event,
        test_context,
        test_results,
        handler,
    ):
        resp = handler.handle(test_event, test_context)
        body = json_tools.loads(resp["body"])
        rendered_emails = handler.get_rendered_emails(test_results)

        # assert values in rendered emails
        assert "https://app-test.altitudenetworks.com/risks?utm-source" in rendered_emails
        assert "1021" in rendered_emails
        assert "2001" in rendered_emails
        assert "3100" in rendered_emails
        assert "1011" in rendered_emails
        handler.ses_alert.send.assert_called_once_with(
            subject="Risk Summary from Altitude Networks",
            content=ANY,
            markup_content=ANY,
            to_emails=["test-email@domain.exist"],
            reply_to_email="support@altitudenetworks.com",
        )

    def test_risk_summary_emails_handler_with_recipients(
        self,
        top_risks,
        test_event,
        test_context,
        handler,
    ):
        test_event["recipients"] = ["eddard@stark.name"]
        resp = handler.handle(test_event, test_context)

        handler.ses_alert.send.assert_called_once_with(
            subject="Risk Summary from Altitude Networks",
            content=ANY,
            markup_content=ANY,
            to_emails=["eddard@stark.name"],
            reply_to_email="support@altitudenetworks.com",
        )

    def test_risk_summary_emails_with_admin_email_in_prod(
        self,
        top_risks,
        test_event,
        test_context,
        handler,
        monkeypatch,
    ):
        monkeypatch.setenv("ENV", "prod")
        monkeypatch.setattr(handler.configs, "env", "prod")
        handler.handle(test_event, test_context)

        # asserts email addresses are appended with admin email in prod
        handler.ses_alert.send.assert_called_once_with(
            subject="Risk Summary from Altitude Networks",
            content=ANY,
            markup_content=ANY,
            to_emails=["test-email@domain.exist", "michael@altitudenetworks.com"],
            reply_to_email=ANY,
        )
