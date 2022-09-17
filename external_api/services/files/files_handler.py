import re
from pathlib import Path
from typing import Any, Dict, List, Tuple

from tools.catalogs import Platform
from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class FilesHandler(
    ExternalApiHandlerTemplate,
    orderable_by={"lastModified"},
):
    name = __name__
    event: LambdaEvent

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"
        self._files_response: List[Dict] = []

    @property
    def job_name(self) -> str:
        return "files"

    @property
    def order_by(self) -> str:
        return "lastModified"

    def build_query(self, platform: Platform) -> Tuple[str, str, Dict[str, Any]]:
        """
        Build SQL Query

        Returns:
            Tuple containing (query file name, query count file name and query fragments dictionary)
        """
        query_fragments = {
            "order": self.order_by,
            "sort": self.sort,
        }
        query_count_file_name = "file_risk_count.sql"
        query_file_name = "files_base_query.sql"

        if platform.GSUITE:
            query_fragments["person_id_predicate"] = (
                "df.owners_emailAddress = %(person_id)s" if self.owner_id else "true"
            )

        if platform.O365:
            query_fragments["person_id_predicate"] = (
                "mdd.created_by_email = %(person_id)s" if self.owner_id else "true"
            )

        query_fragments["risk_id_predicate"] = (
            "rf.risk_id = %(risk_id)s" if self.risk_id else "true"
        )
        if self.owner_id or self.person_id:
            query_file_name = "files_by_person.sql"
            query_count_file_name = "file_person_count.sql"

        return query_file_name, query_count_file_name, query_fragments

    def render_query(
        self,
        platform: str,
        query_file_name: str,
        query_count_file_name: str,
        query_fragments: Dict[str, Any],
    ) -> Tuple[str, str]:
        """
        Render base and count queries.

        Returns
            Tuple containing rendered base query and count queries
        """
        count_query = self.render_jinja_template(
            file_path=self.sql_path / platform / query_count_file_name,
            query_fragments=query_fragments,
        )
        rendered_query = self.render_jinja_template(
            file_path=self.sql_path / platform / query_file_name, query_fragments=query_fragments
        )

        return count_query, rendered_query

    def execute_query(self, platform: str, rendered_query: str, count_query: str) -> None:
        """
        Execute SQL base and count queries and parse results.

        Arguments:
            platform        -- Platform id
            rendered_query  -- rendered sql base query
            count_query     -- rendered count query

        Response
            Parsed Files response.
        """
        self._files_response.extend(
            self.run_read_query(
                query_string=rendered_query,
                count_query_string=count_query,
                query_params={
                    "domains": "|".join([re.escape(domain) for domain in self.configs.domains]),
                    "platform": platform,
                    "risk_id": self.risk_id,
                    "is_owner": 1 if self.owner_id else 0,
                    "person_id": self.person_id or self.owner_id,
                    "offset": (self.page_number - 1) * self.page_size,
                    "limit": self.page_size,
                },
                response_mapper=self.get_file_record,
            )
        )

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get files details

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict with a list of files and file metadata.
        """
        if not event.get("queryStringParameters"):
            raise BadRequest("NoneType query string parameter")

        if not self.risk_id and not self.person_id and not self.owner_id:
            raise BadRequest("NoneType query string parameters risk-id and person-id")

        # build and execute files queries
        platforms = tuple(plt.value for plt in self.platforms)
        for pltfm in platforms:
            if self.platform_is_supported(Platform(pltfm)):
                query_file_name, query_count_file_name, query_fragments = self.build_query(
                    Platform(pltfm)
                )
                self.logger.debug(f"{query_file_name}, {query_count_file_name}, {query_fragments}")

                count_query, rendered_query = self.render_query(
                    pltfm, query_file_name, query_count_file_name, query_fragments
                )

                self.logger.debug(f"{count_query}, {rendered_query}")
                self.execute_query(pltfm, rendered_query, count_query)
                self._query_stats = {}

        return {
            "files": self._files_response,
            "orderBy": self.order_by,
            "pageCount": self.page_count,
            "pageCountCacheTTL": self.page_count_cache_ttl,
            "pageCountLastUpdated": self.page_count_last_updated,
            "pageNumber": self.page_number,
            "pageSize": self.page_size,
            "platformIds": [plt.value for plt in self.platforms],
            "riskId": self.risk_id,
            "sort": self.sort,
        }


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return FilesHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_files.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "files"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
