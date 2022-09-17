from unittest.mock import ANY, patch

import pytest
from tools.catalogs import Platform
from tools.sql import SQLConnect

from external_api.user.user_generator import UserGenerator
from external_api.utils.constants import GoogleTableNames


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestUserGenerator:
    @pytest.fixture
    def test_email(self):
        return "nyah@thoughtlabs.io"

    @pytest.fixture
    def user_record(self):
        return {
            "access_level": "admin",
            "altnet_id": ANY,
            "dt_created": "2021-01-29T00:27:14.951351",
            "dt_modified": ANY,
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
            "sk": ANY,
            "platform": "gsuite",
            "primary_email_address": "nyah@thoughtlabs.io",
            "project_id": "thoughtlabs",
            "scrape": "1",
            "status": "active",
            "user_email": "nyah@thoughtlabs.io",
            "user_id": "392049420449203948243",
            "project_id": "thoughtlabs",
            "internal": True,
            "user_kind": "user",
            "usage_kind": "work",
            "internal_count": 1,
            "external_count": 1,
        }

    @pytest.fixture
    def admin_usersmeta(self, mysql_connect, admin_directory_v1_usersmeta_data):
        pytest.helpers.insert_into_table(
            mysql_connect,
            GoogleTableNames.ADMIN_USERSMETA.value,
            admin_directory_v1_usersmeta_data,
        )

    @pytest.fixture
    def mysql_connect(self, mysql_with_schema, table_names):
        mysql_connect = SQLConnect(mysql_with_schema)
        pytest.helpers.clear_tables(mysql_connect, table_names)
        return mysql_connect

    @pytest.fixture
    def handler(self, users_manager, mysql_connect):
        sql_connect_p = patch.object(UserGenerator, "sql_connect", mysql_connect)
        users_mgr_p = patch.object(UserGenerator, "users_manager", users_manager)
        with sql_connect_p, users_mgr_p:
            handler = UserGenerator
            yield handler

    def test_user_from_gsuite(
        self,
        test_email,
        user_record,
        handler,
        admin_usersmeta,
        mock_config,
    ) -> None:
        user_resp = handler(config=mock_config, platform="gsuite").get_user_record(test_email)
        assert user_resp == user_record

        # assert none type emails
        assert not handler(config=mock_config, platform="gsuite").is_internal("")
        assert handler(config=mock_config, platform="gsuite").is_internal("test@thoughtlabs.io")
