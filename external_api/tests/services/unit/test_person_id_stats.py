from unittest.mock import ANY, patch

import pytest
from freezegun import freeze_time
from tools import json_tools
from tools.dynamo.user_stats_metrics_table.user_stats_metric_record import UserStatsMetricRecord
from tools.lambda_handler import get_dummy_context
from tools.sql import SQLConnect

from services.person_id_stats.person_id_stats_handler import PersonStatsHandler


@pytest.mark.usefixtures("dynamodb_local")
class TestPersonStatsHandler:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture(scope="class")
    def lambda_event(self):
        return {
            "pathParameters": {"personId": "michael@thoughtlabs.io"},
            "queryStringParameters": {"metrics": ["risksCreated"]},
            "requestContext": {"authorizer": {"project_id": "thoughtlabs"}},
        }

    @pytest.fixture(scope="class")
    def lambda_context(self):
        lambda_context = get_dummy_context()
        lambda_context.function_name = "person-id-stats"
        return lambda_context

    @pytest.fixture
    def handler(self, mock_config, mysql_connect, user_stats_metrics_manager):
        configs_p = patch.object(PersonStatsHandler, "configs", mock_config)
        sql_connect_p = patch.object(PersonStatsHandler, "sql_connect", return_value=mysql_connect)
        metric_mgr_p = patch.object(
            PersonStatsHandler, "metrics_manager", user_stats_metrics_manager
        )
        with configs_p, sql_connect_p, metric_mgr_p:
            handler = PersonStatsHandler(enable_sentry=False, raise_errors=True)
            yield handler

    @pytest.fixture
    def top_risks(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "top_risks",
            [
                {
                    "id_db": 1793631,
                    "risk_id": "28c6d4819547a93fd68e2984ec4f7f9b47cd62ac",
                    "risk_type_id": 10,
                    "risk_incident_date": "2020-06-01 11:30:00",
                    "risk_target": "NULL",
                    "severity": 5,
                    "app": "GDrive",
                    "file_id": "17oU1n1k43x0_rJQX38Y6qCc0G7W9nKLdGccVJRuroGY",
                    "status": None,
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Most Shared Files (Non-Company Owned)",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "pluto@sweatband.org",
                    "file_owner_firstname": "Robust",
                    "file_owner_familyname": "Seabird",
                    "file_owner_emailaddress": "transit@sweatband.org",
                    "file_collaborators": "NULL",
                    "file_collaborator_count": 0,
                    "file_name": "prowler-cubic-treadmill-facial",
                    "file_count": 1,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "NULL",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-06-01 18:20:00",
                    "dt_modified": "2020-06-01 21:01:44",
                },
                {
                    "id_db": 1793708,
                    "risk_id": "5a2bc94cefc8a4f3ad6ed937d27487179690d718",
                    "risk_type_id": 3100,
                    "risk_incident_date": "2020-06-01 00:00:00",
                    "risk_target": "Tissue Reform",
                    "severity": 6,
                    "app": "GDrive",
                    "file_id": "NULL",
                    "status": "active",
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Many files downloaded in 24 hours by employee",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "NULL",
                    "file_owner_firstname": "NULL",
                    "file_owner_familyname": "NULL",
                    "file_owner_emailaddress": "NULL",
                    "file_collaborators": "NULL",
                    "file_collaborator_count": 0,
                    "file_name": "NULL",
                    "file_count": 230,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "NULL",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-06-01 21:00:49",
                    "dt_modified": "2020-06-12 21:01:01",
                },
                {
                    "id_db": 1793709,
                    "risk_id": "c8e6abdce140347e0be92285376be530f8c01233",
                    "risk_type_id": 3100,
                    "risk_incident_date": "2020-06-01 00:00:00",
                    "risk_target": "Unwind Tunnel",
                    "severity": 6,
                    "app": "GDrive",
                    "file_id": "NULL",
                    "status": "active",
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Many files downloaded in 24 hours by employee",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "NULL",
                    "file_owner_firstname": "NULL",
                    "file_owner_familyname": "NULL",
                    "file_owner_emailaddress": "NULL",
                    "file_collaborators": "NULL",
                    "file_collaborator_count": 0,
                    "file_name": "NULL",
                    "file_count": 280,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "NULL",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-06-01 21:00:49",
                    "dt_modified": "2020-07-28 23:17:50",
                },
                {
                    "id_db": 1675894,
                    "risk_id": "940ff5f910dc47879aa4c2adb017dac7",
                    "risk_type_id": 10,
                    "risk_incident_date": "2020-05-01 22:01:07",
                    "risk_target": "NULL",
                    "severity": 5,
                    "app": "GDrive",
                    "file_id": "1lptkw6x7q8RQF3GQfkXj9cMzlEmEEkAA",
                    "status": None,
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Most Shared Files (Non-Company Owned)",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "michael@thoughtlabs.io",
                    "file_owner_firstname": "NULL",
                    "file_owner_familyname": "NULL",
                    "file_owner_emailaddress": "nyah@thoughtlabs.io",
                    "file_collaborators": "NULL",
                    "file_collaborator_count": 0,
                    "file_name": "befriend-preclude-blockade-upset.pdf",
                    "file_count": 1,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "NULL",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-05-01 22:01:07",
                    "dt_modified": "2020-05-06 20:46:39",
                },
                {
                    "id_db": 1675895,
                    "risk_id": "bf70ab207d66443799a50fbc420dd636",
                    "risk_type_id": 10,
                    "risk_incident_date": "2020-05-01 22:01:07",
                    "risk_target": "NULL",
                    "severity": 5,
                    "app": "GDrive",
                    "file_id": "0BzQ0cfYeQbDdUm1qRmJaT2hOc0U",
                    "status": None,
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Most Shared Files (Non-Company Owned)",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "michael@thoughtlabs.io",
                    "file_owner_firstname": "NULL",
                    "file_owner_familyname": "NULL",
                    "file_owner_emailaddress": "michael@thoughtlabs.io",
                    "file_collaborators": "NULL",
                    "file_collaborator_count": 0,
                    "file_name": "frighten-deckhand-optic-stagehand",
                    "file_count": 1,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "NULL",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-05-01 22:01:07",
                    "dt_modified": "2020-05-06 20:46:39",
                },
                {
                    "id_db": 1550253,
                    "risk_id": "e2903471dd7d46af8b28eb1e87a0742c",
                    "risk_type_id": 0,
                    "risk_incident_date": "2020-04-01 22:02:08",
                    "risk_target": "NULL",
                    "severity": 5,
                    "app": "GDrive",
                    "file_id": "1OejnMx23B1r0QMAr1CigZLr7rMPSuUTSGfkuGdgKl1s",
                    "status": None,
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Most Shared Files (Company Owned)",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "nyah@thoughtlabs.io",
                    "file_owner_firstname": "Ratchet",
                    "file_owner_familyname": "Flytrap",
                    "file_owner_emailaddress": "michael@thoughtlabs.io",
                    "file_collaborators": "NULL",
                    "file_collaborator_count": 0,
                    "file_name": "trauma-spellbind-backfield-reform",
                    "file_count": 1,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "michael@thoughtlabs.io",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-04-01 22:02:08",
                    "dt_modified": "2020-04-06 20:46:39",
                },
                {
                    "id_db": 1402774,
                    "risk_id": "4de6a92bbebe430387fa21a3d78d5e7c",
                    "risk_type_id": 10,
                    "risk_incident_date": "2020-03-01 23:57:50",
                    "risk_target": "NULL",
                    "severity": 5,
                    "app": "GDrive",
                    "file_id": "13OQImhglEP6gaVqBt2UYz1fHD8uTDlan1NJjHnMyJGA",
                    "status": None,
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Most Shared Files (Non-Company Owned)",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "keyboard@baboon.com",
                    "file_owner_firstname": "NULL",
                    "file_owner_familyname": "NULL",
                    "file_owner_emailaddress": "michael@thoughtlabs.io",
                    "file_collaborators": "Cowbell Chatter",
                    "file_collaborator_count": 734,
                    "file_name": "prefer-repay-allow-newborn",
                    "file_count": 1,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "NULL",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-03-01 23:57:50",
                    "dt_modified": "2020-03-06 20:46:39",
                },
                {
                    "id_db": 1402775,
                    "risk_id": "3b6e9676ffc24b04bebbd1eecd7f42d2",
                    "risk_type_id": 10,
                    "risk_incident_date": "2020-03-01 23:57:50",
                    "risk_target": "NULL",
                    "severity": 5,
                    "app": "GDrive",
                    "file_id": "0B9F_kkRnIWDjaEtjckZYUnlTcDg",
                    "status": None,
                    "risk_person_id": "michael@thoughtlabs.io",
                    "risk_description": "Most Shared Files (Non-Company Owned)",
                    "permissions_id": "NULL",
                    "permissions_emailaddress": "standard@baboon.com",
                    "file_owner_firstname": "NULL",
                    "file_owner_familyname": "NULL",
                    "file_owner_emailaddress": "michael@thoughtlabs.io",
                    "file_collaborators": "Aimless Spearhead",
                    "file_collaborator_count": 681,
                    "file_name": "beaming-athens-shadow-fracture.pdf",
                    "file_count": 1,
                    "owners_displayname": "NULL",
                    "owners_emailaddress": "NULL",
                    "owners_id": "NULL",
                    "application_displayText": "NULL",
                    "dt_created": "2020-03-01 23:57:50",
                    "dt_modified": "2020-03-06 20:46:39",
                },
            ],
        )

    @pytest.fixture
    def risks_files(self, mysql_connect):
        pytest.helpers.insert_into_table(
            mysql_connect,
            "risks_files",
            [
                {
                    "risk_type_id": "1020",
                    "risk_id": "0fbc1911c7085749fd38b4d327698f3f5fa5d228",
                    "file_id": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                    "dt_created": "2019-04-05T17:30:33",
                    "dt_modified": "2020-07-10T17:48:41",
                    "permissions_id": "01418317513357223822",
                    "owners_emailAddress": "michael@thoughtlabs.io",
                    "permissions_emailAddress": "michael@thoughtlabs.io",
                }
            ],
        )

    @freeze_time("2020-06-15")
    @pytest.mark.skip(reason="dynamodb container failes intermittently on Github actions: API-169")
    def test_person_id_stats_handler_with_metrics(
        self,
        handler,
        lambda_event,
        lambda_context,
        top_risks,
        risks_files,
    ):
        # assert some cached metrics are stored in dynamo table
        assert len(list(handler.metrics_manager.scan())) == 8

        # get response
        resp = handler.handle(lambda_event, lambda_context)
        body = json_tools.loads(resp["body"])

        # assert response metrics and dynamo tables
        metric_name = "risksCreated"
        result = handler.metrics_manager.get(
            user_id="michael@thoughtlabs.io",
            metric_name=metric_name,
            metric_datetime="1590969600",
        )
        assert result == UserStatsMetricRecord(
            {
                "dt_created": ANY,
                "dt_modified": ANY,
                "metric_datetime": "1590969600",
                "metric_name": metric_name,
                "metric_value": 3,
                "pk": f"thoughtlabs_1",
                "project_id": "thoughtlabs",
                "sk": ANY,
                "user_id": "michael@thoughtlabs.io",
                "user_id_datetime": "michael@thoughtlabs.io_1590969600",
                "user_id_metric_name": f"michael@thoughtlabs.io_{metric_name}",
                "user_id_metric_name_datetime": f"michael@thoughtlabs.io_{metric_name}_1590969600",
            }
        )
        assert len(list(handler.metrics_manager.scan())) == 13

        assert resp["statusCode"] == 200
        assert body["labels"] == [
            1559347200,
            1561939200,
            1564617600,
            1567296000,
            1569888000,
            1572566400,
            1575158400,
            1577836800,
            1580515200,
            1583020800,
            1585699200,
            1588291200,
            1590969600,
        ]
        assert body["series"][metric_name] == [42, 12, 284, 349, 124, 23, 8, 94, 0, 0, 1, 2, 3]

    def test_person_id_stats_handler_with_bad_test_event(self, lambda_context, handler):
        bad_test_event = {"requestContext": {"authorizer": {"project_id": "test-project"}}}

        response = handler.handle(bad_test_event, lambda_context)
        assert response["statusCode"] == 400
