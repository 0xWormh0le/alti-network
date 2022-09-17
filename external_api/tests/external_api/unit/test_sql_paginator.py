from inspect import cleandoc as trim
from unittest.mock import ANY, patch

import pytest
from tools.sql import SQLConnect

from external_api.utils.sql_paginator import SQLPaginator


@pytest.mark.usefixtures("no_retry", "dynamodb_local")
class TestSQLPaginator:
    @pytest.fixture
    def mysql_connect(self, mysql_with_schema):
        mysql_connect = SQLConnect(mysql_with_schema)
        return mysql_connect

    def test_sql_paginator_with_success(self, mysql_connect):
        with mysql_connect.open() as sql_connect:
            sql_paginator = SQLPaginator(
                sql_connect=mysql_connect,
                query_string=trim(
                    """
                    SELECT * FROM series LIMIT 0,5
                    """
                ),
            )

            print(sql_paginator.page_of_results)
            assert sql_paginator.page_of_results == [
                {"n": 0},
                {"n": 1},
                {"n": 2},
                {"n": 3},
                {"n": 4},
            ]
            assert sql_paginator.row_count == 5
            assert sql_paginator.page_count == 1
