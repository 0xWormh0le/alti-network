import pytest
from tools.sql import SQLConnect


class TestMySQLWithSchema:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema):
        return SQLConnect(mysql_with_schema)

    def test_schema(self, mysql_connect):
        with mysql_connect.open() as sql_connect:
            results = sql_connect.execute_simple_select_query(
                "SELECT count(*) FROM series WHERE n >= 0 and n <= 1024"
            )
            assert results == [{"count(*)": 1024}]
