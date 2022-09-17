from unittest.mock import ANY, Mock, patch

import pytest
from dynamo_query.data_table import DataTable
from tools import datetime_tools
from tools.dynamo.risks_table.risk_metrics_manager import RiskMetricRecord, RiskMetricsManager
from tools.dynamo.risks_table.risks_table import RisksTable
from tools.dynamo.user_stats_metrics_table.user_stats_metric_record import UserStatsMetricRecord
from tools.dynamo.user_stats_metrics_table.user_stats_metrics_manager import UserStatsMetricsManager
from tools.dynamo.user_stats_metrics_table.user_stats_metrics_table import UserStatsMetricsTable
from tools.dynamo.users_table.user_record import UserRecord
from tools.dynamo.users_table.users_manager import UsersManager
from tools.dynamo.users_table.users_table import UsersTable

from external_api.user.user_generator import UserGenerator


@pytest.fixture
def mock_user_records(mock_user_records_data):
    user_records = DataTable(record_class=UserRecord)
    user_records.add_record(*mock_user_records_data)
    return user_records


@pytest.fixture
def users_manager(mock_config, mock_user_records):
    configs_p = patch.object(UsersManager, "config", mock_config)
    with configs_p:
        table_manager = UsersTable(env=mock_config.env, aws_region=mock_config.aws_region)
        metrics_manager = UsersManager(config=mock_config)
        table_manager.create_table()
        table_manager.clear_records()
        metrics_manager.batch_upsert(mock_user_records)
        yield metrics_manager
        table_manager.delete_table()


@pytest.fixture
def user_generator(mysql_connect, users_manager):
    sql_connect_p = patch.object(UserGenerator, "sql_connect", mysql_connect)
    users_mgr_p = patch.object(UserGenerator, "users_manager", users_manager)
    with sql_connect_p, users_mgr_p:
        user_gen = UserGenerator
        yield user_gen


@pytest.fixture
def mock_metric_records():
    metric_records = DataTable(record_class=UserStatsMetricRecord)
    metric_records.add_record(
        *[
            UserStatsMetricRecord(
                {
                    "project_id": "thoughtlabs",
                    "user_id": "michael@thoughtlabs.io",
                    "metric_name": "risksCreated",
                    "metric_datetime": datetime,
                    "metric_value": metric_value,
                }
            )
            for datetime, metric_value in [
                ("1559347200", 42),
                ("1561939200", 12),
                ("1564617600", 284),
                ("1567296000", 349),
                ("1569888000", 124),
                ("1572566400", 23),
                ("1575158400", 8),
                ("1577836800", 94),
            ]
        ]
    )
    return metric_records


@pytest.fixture
def risk_metrics_manager(mock_config, mock_risk_metric_records):
    table_manager = RisksTable(env=mock_config.env, aws_region=mock_config.aws_region)
    metrics_manager = RiskMetricsManager(env=mock_config.env, aws_region=mock_config.aws_region)
    table_manager.create_table()
    table_manager.clear_records()
    metrics_manager.batch_upsert(mock_risk_metric_records)
    yield metrics_manager
    table_manager.delete_table()


@pytest.fixture
def user_stats_metrics_manager(mock_config, mock_metric_records):
    configs_p = patch.object(UserStatsMetricsManager, "config", mock_config)
    with configs_p:
        table_manager = UserStatsMetricsTable(
            env=mock_config.env, aws_region=mock_config.aws_region
        )
        metrics_manager = UserStatsMetricsManager(config=mock_config)
        table_manager.create_table()
        table_manager.clear_records()
        metrics_manager.batch_upsert(mock_metric_records)
        yield metrics_manager
        table_manager.delete_table()


@pytest.fixture
def mock_risk_metric_records():
    risk_metric_records = DataTable(record_class=RiskMetricRecord)
    risk_metric_records.add_record(
        *[
            RiskMetricRecord(
                {
                    "metric_id": "highest_risk_file",
                    "metric_value": "6",
                    "metric_datetime": datetime_tools.get_curr_utc_time(),
                    "project_id": "thoughtlabs",
                    "person_id": "NULL",
                    "file_id": "1lCkT-e66TNCzFo6LEw696tqJj9ozzhP7qY2uy-5p1ZI",
                    "app_id": "NULL",
                    "platform": "gsuite",
                    "dt_str": "2020-12-13T00:00:00Z",
                    "metric_suffix": "NULL",
                }
            ),
            RiskMetricRecord(
                {
                    "metric_id": "most_at_risk_files_owned",
                    "metric_value": "4",
                    "metric_datetime": datetime_tools.get_curr_utc_time(),
                    "project_id": "thoughtlabs",
                    "person_id": "michael@thoughtlabs.io",
                    "file_id": "NULL",
                    "app_id": "NULL",
                    "dt_str": "2020-12-13T00:00:00Z",
                    "metric_suffix": "NULL",
                }
            ),
            RiskMetricRecord(
                {
                    "metric_id": "most_external_access",
                    "metric_value": "5",
                    "metric_datetime": datetime_tools.get_curr_utc_time(),
                    "project_id": "thoughtlabs",
                    "person_id": "yasuke@shogun.jp",
                    "file_id": "NULL",
                    "app_id": "NULL",
                    "dt_str": "2020-12-13T00:00:00Z",
                    "metric_suffix": "NULL",
                }
            ),
            RiskMetricRecord(
                {
                    "metric_id": "most_risks_created",
                    "metric_value": "10",
                    "metric_datetime": datetime_tools.get_curr_utc_time(),
                    "project_id": "thoughtlabs",
                    "person_id": "michael@thoughtlabs.io",
                    "file_id": "NULL",
                    "app_id": "NULL",
                    "dt_str": "2020-12-13T00:00:00Z",
                    "metric_suffix": "NULL",
                }
            ),
        ]
    )
    return risk_metric_records


@pytest.fixture
def mock_user_records_data():
    return [
        UserRecord(
            {
                "access_level": "admin",
                "altnet_id": "4i2oeli2oe-el23ielwe-elgefd-32",
                "dt_created": "2021-01-29T00:27:14.951351",
                "dt_modified": "2021-03-12T21:04:00.524807",
                "emails": [
                    {"address": "mwcoates@gmail.com", "kind": "personal"},
                    {"address": "mwcoates@thoughtlabs.biz", "kind": "work"},
                ],
                "family_name": "Coates",
                "family_name_lc": "coates",
                "given_name": "Michael",
                "given_name_lc": "michael",
                "identity_master": "1",
                "phones": [{"kind": "personal", "phone": "+15555555555"}],
                "pk": "thoughtlabs_1",
                "platform": "gsuite",
                "primary_email_address": "michael@thoughtlabs.io",
                "project_id": "thoughtlabs",
                "scrape": "1",
                "status": "active",
                "user_email": "michael@thoughtlabs.io",
                "user_id": "392049420449203948243",
            }
        ),
        UserRecord(
            {
                "access_level": "admin",
                "altnet_id": "fdfk-dfke-dldfi-fdfaeigrlt-3839",
                "dt_created": "2021-02-29T00:27:14.951351",
                "dt_modified": "2021-03-12T21:04:00.524807",
                "emails": [
                    {"address": "bobbieh@gmail.com", "kind": "personal"},
                    {"address": "bobbie@thoughtlabs.biz", "kind": "work"},
                ],
                "family_name": "Hawaii",
                "family_name_lc": "bobbie",
                "given_name": "Bobbie",
                "given_name_lc": "bobbie",
                "identity_master": "1",
                "phones": [{"kind": "personal", "phone": "+15555555555"}],
                "pk": "thoughtlabs_1",
                "platform": "gsuite",
                "primary_email_address": "bobbie@thoughtlabs.io",
                "project_id": "thoughtlabs",
                "scrape": "1",
                "status": "active",
                "user_email": "bobbie@thoughtlabs.io",
                "user_id": "392049420449203948243",
            }
        ),
        UserRecord(
            {
                "access_level": "owner",
                "altnet_id": "60202oe-el23ielwe-elgefd-32",
                "dt_created": "2021-01-29T00:27:14.951351",
                "dt_modified": "2021-03-12T21:04:00.524807",
                "emails": [
                    {"address": "yasuke@tech.info", "kind": "personal"},
                    {"address": "pluto@sweatband.org", "kind": "personal"},
                ],
                "family_name": "Daimyo",
                "family_name_lc": "daimyo",
                "given_name": "Yasuke",
                "given_name_lc": "yasuke",
                "identity_master": "1",
                "phones": [{"kind": "personal", "phone": "+15555555555"}],
                "pk": "thoughtlabs_1",
                "platform": "gsuite",
                "primary_email_address": "yasuke@shogun.jp",
                "project_id": "thoughtlabs",
                "scrape": "1",
                "status": "active",
                "user_email": "yasuke@shogun.jp",
                "user_id": "989494842848293",
            },
        ),
        UserRecord(
            {
                "access_level": "admin",
                "altnet_id": "4i2oeli2oe-el23ielwe-elgefd-32",
                "dt_created": "2021-01-29T00:27:14.951351",
                "dt_modified": "2021-03-12T21:04:00.524807",
                "emails": [
                    {"address": "neeya@tech.biz", "kind": "personal"},
                ],
                "family_name": "Check",
                "family_name_lc": "check",
                "given_name": "Nyah",
                "given_name_lc": "nyah",
                "identity_master": "1",
                "phones": [{"kind": "personal", "phone": "+15555555555"}],
                "pk": "thoughtlabs_1",
                "platform": "gsuite",
                "primary_email_address": "nyah@thoughtlabs.io",
                "project_id": "thoughtlabs",
                "scrape": "1",
                "status": "active",
                "user_email": "nyah@thoughtlabs.io",
                "user_id": "392049420449203948243",
            }
        ),
        UserRecord(
            {
                "access_level": "admin",
                "altnet_id": "2384lel2-4213l-4owlek2-4o42o",
                "dt_created": "2021-01-29T00:27:14.951351",
                "dt_modified": "2021-10-12T21:04:00.524807",
                "emails": [
                    {"address": "amol@altitudenetworks.com", "kind": "personal"},
                    {"address": "mr.amolpatel@gmail.com", "kind": "personal"},
                    {"address": "amol.canvas@gmail.com", "kind": "personal"},
                    {"address": "amol@thoughtlabs.io.test-google-a.com", "kind": "work"},
                ],
                "family_name": "Patel",
                "family_name_lc": "patel",
                "given_name": "Amol",
                "given_name_lc": "amol",
                "identity_master": "1",
                "phones": [{"kind": "personal", "phone": "+15555555555"}],
                "pk": "thoughtlabs_1",
                "platform": "gsuite",
                "primary_email_address": "amol@thoughtlabs.io",
                "project_id": "thoughtlabs",
                "scrape": "1",
                "status": "active",
                "user_email": "amol@thoughtlabs.io",
                "user_id": "848424858429438492",
            }
        ),
        UserRecord(
            {
                "access_level": "admin",
                "altnet_id": "f4lf-4i4o2.e-23i434-4i42o",
                "dt_created": "2021-03-29T00:27:14.951351",
                "dt_modified": "2021-05-12T21:04:00.524807",
                "emails": [
                    {"address": "pkhetrapal@gmail.com", "kind": "personal"},
                    {"address": "pulkit@thoughtlabs00.onmicrosoft.com", "kind": "work"},
                ],
                "family_name": "Khetrapal",
                "family_name_lc": "khetrapal",
                "given_name": "Pulkit",
                "given_name_lc": "pulkit",
                "identity_master": "1",
                "phones": [{"kind": "personal", "phone": "+15555555555"}],
                "pk": "thoughtlabs_1",
                "platform": "o365",
                "primary_email_address": "pulkit@thoughtlabs.io",
                "project_id": "thoughtlabs",
                "scrape": "1",
                "status": "active",
                "user_email": "Pulkit@thoughtlabs.io",
                "user_id": "944848420458530",
            }
        ),
    ]
