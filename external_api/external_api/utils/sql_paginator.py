import math
from typing import Any, Dict, List, Optional

from tools.logger import Logger
from tools.sql import DatabaseType, QueryParams, SQLConnect


class SQLPaginator:
    def __init__(
        self,
        sql_connect: SQLConnect,
        query_string: str,
        pg_query_string: Optional[str] = None,
        count_query_string: Optional[str] = None,
        pg_count_query_string: Optional[str] = None,
        query_params: Optional[QueryParams] = None,
        client_row_count: Optional[int] = None,
        client_page_size: Optional[int] = None,
        client_page_number: Optional[int] = None,
    ):
        self.logger = Logger.for_object(self)
        self.sql_connect: SQLConnect = sql_connect
        self.query_string: str = query_string
        self.pg_query_string: str = pg_query_string or ""
        self.count_query_string: str = count_query_string or ""
        self.pg_count_query_string: str = pg_count_query_string or ""
        self.query_params: Optional[QueryParams] = query_params
        self.page_size: int = client_page_size or 10
        self.page_number: int = client_page_number or 1
        self._row_count: Optional[int] = client_row_count

    @property
    def page_of_results(self) -> List[Dict[str, Any]]:
        if self.sql_connect.route.database_type == DatabaseType.POSTGRESQL and self.pg_query_string:
            results = self.sql_connect.get_dict_query_results(
                query_string=self.pg_query_string,
                query_params=self.query_params,
            )
        else:
            results = self.sql_connect.get_dict_query_results(
                query_string=self.query_string,
                query_params=self.query_params,
            )

        return list(results)

    @property
    def row_count(self) -> int:
        if self.count_query_string or self.pg_count_query_string:
            # Determines the total row_count from database.
            if (
                self.sql_connect.route.database_type == DatabaseType.POSTGRESQL
                and self.pg_count_query_string
            ):
                count_results_list = self.sql_connect.get_dict_query_results(
                    self.pg_count_query_string, self.query_params
                )
            else:
                count_results_list = self.sql_connect.get_dict_query_results(
                    self.count_query_string, self.query_params
                )

            count_results = count_results_list[0] if count_results_list else {}
            self._row_count = count_results.get("found_rows", 0) if count_results else 0
        elif not self._row_count:
            self._row_count = self.sql_connect.get_row_count()

        self.logger.debug(f">>>row_count: row_count<<<<: {self._row_count}")
        return self._row_count  # type: ignore

    @property
    def page_count(self) -> int:
        self.logger.debug(
            f">>>page_count: row_count<<<<: {self.row_count}, page_size: {self.page_size}"
        )
        return math.ceil(self.row_count / self.page_size)
