from pathlib import Path
from typing import Any, Dict, List, Optional

from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.exceptions import InternalServerError
from external_api.models.sensitive_phrases import (
    MultiFileSensitivePhrases,
    SingleFileSensitivePhrases,
)
from external_api.utils.constants import RISK_CREATOR_TYPES, RISK_TARGET_TYPES
from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class RisksHandler(
    ExternalApiHandlerTemplate,
    orderable_by={"severity", "datetime"},
):
    name = __name__

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self._risks_response: List[Dict[str, Any]] = []
        self._risks_output: Optional[Dict[str, Any]] = None
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "risks"

    def verify_risk_creator(self) -> bool:
        """Verify that specific risk_types have a risk creator."""
        for risk in self._risks_response:
            creator = risk.get("creator", {}).get("primaryEmail")
            if risk["riskTypeId"] in RISK_CREATOR_TYPES and not creator:
                return False

        return True

    def add_multi_file_sensitive_phrases(
        self, risks_response: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Add multi-file sensitive phrases

        Arguments:
            risks_response - risks response

        Returns:
            risks response with multi-file sensitive phrases.
        """
        new_risks = []
        for risk in risks_response:
            if int(risk["fileCount"]) > 1:
                raw_phrases = self.run_read_query(
                    file_path=(
                        self.sql_path / risk["platformId"] / "multi_file_sensitive_phrases.sql"
                    ),
                    query_params={"risk_id": risk["riskId"]},
                )
                risk["sensitivePhrases"] = MultiFileSensitivePhrases.from_sql_dm(
                    raw_phrases
                ).to_api_dm()

            new_risks.append(risk)

        return new_risks

    def get_risks_by_platform(self, platform: str) -> List[Dict[str, Any]]:
        """Select and run base queries by platform.

        Arguments:
            platform -- Platform

        Returns:
            List of `Risks` results

        Raises:
            `PyMySQL` error
        """
        base_query_file = "risks_base_query.sql"
        count_query_file = "risks_count_query.sql"
        query_params = {
            "severity": self.severity,
            "order": self.order_by,
            "sort": self.sort,
            "risk_type_ids": self.risk_type_ids or None,
            "creator_id": self.creator_id,
            "person_id": self.person_id,
            "platform": platform,
            "platform_id": self.platform_ids_map[platform],
            "sensitive_content": self.sensitive_content_only,
            "app_id": self.app_id,
            "offset": (self.page_number - 1) * self.page_size,
            "limit": self.page_size,
        }

        rendered_risks_base_query = self.render_jinja_template(
            file_path=self.sql_path / platform / base_query_file,
            query_fragments=query_params,
        )

        # get risk count query
        rendered_risks_count_query = self.render_jinja_template(
            file_path=self.sql_path / platform / count_query_file,
            query_fragments=query_params,
        )

        risks_response = self.run_read_query(
            query_string=rendered_risks_base_query,
            query_params=query_params,
            count_query_string=rendered_risks_count_query,
            response_mapper=self.to_api_sdk_dm,
        )
        return risks_response

    def to_api_sdk_dm(self, results: Dict[str, Any]) -> Dict[str, Any]:
        """Maps dictionary keys from db table column names to Flavius SDK format."""
        self.logger.debug(f"risk-row-results: {results}")

        owner_email = (results["owners_emailaddress"] or "").lower()
        if not owner_email:
            self.logger.error(f"Owner email does not exist for {results['risk_id']}")

        risk_person_id = (results["risk_person_id"] or "").lower()
        risk_target_data = (
            {"id": results["risk_target"], "name": results["risk_target_name"]}
            if results["risk_target"]
            else None
        )
        return {
            "owner": self.get_user_record(platform=results["platform"], email=owner_email)
            if owner_email
            else {},
            "creator": self.get_user_record(platform=results["platform"], email=risk_person_id)
            if risk_person_id
            else {},
            "riskId": results["risk_id"],
            "datetime": results["datetime"],
            "riskTypeId": results["risk_type_id"],
            "severity": results["severity"],
            "fileName": results["file_name"],
            "fileId": results["file_id"],
            "fileCount": results["file_count"],
            "mimeType": (
                results["file_mimetype"].split(".")[-1]
                if results.get("file_mimetype")
                else "document"
            ),
            "riskDescription": results["risk_description"],
            "riskTarget": [risk_target_data]
            if risk_target_data and results["risk_type_id"] not in RISK_TARGET_TYPES
            else [],
            "platformId": results["platform"],
            "plugin": risk_target_data
            if risk_target_data and results["risk_type_id"] in RISK_TARGET_TYPES
            else None,
            "sensitivePhrases": SingleFileSensitivePhrases.from_sql_dm(results).to_api_dm(),
            "webLink": results["web_link"],
        }

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get Risks response for API
        """
        # run platform based queries and get results
        risk_count = 0
        for platform in self.platforms:
            if self.platform_is_supported(platform):
                self._risks_response.extend(self.get_risks_by_platform(platform.value))
                risk_count += self._query_stats.get("found_rows", 0)
                self._query_stats = {}

        # add multi-file sensitive phrases
        self._risks_response = self.add_multi_file_sensitive_phrases(
            risks_response=self._risks_response
        )

        # build risks output
        self._risks_output = {
            "risks": self._risks_response,
            "severityThreshold": self.severity,
            "pageCount": self.page_count,
            "pageCountCacheTTL": self.page_count_cache_ttl,
            "pageCountLastUpdated": self.page_count_last_updated,
            "pageNumber": self.page_number,
            "pageSize": self.page_size,
            "riskCount": risk_count,
            "sensitiveContentOnly": self.sensitive_content_only,
            "personId": self.person_id,
            "platformIds": [plt.value for plt in self.platforms],
            "applicationId": self.app_id,
            "orderBy": self.order_by,
            "sort": self.sort,
            "riskTypeIds": self.risk_type_ids,
        }

        # verify risks creator exists for all risks
        if not self.verify_risk_creator():
            self.logger.error("Risk creator missing for some of the risks")
        elif not self._risks_output:
            raise InternalServerError("Unknown risks service error")

        return self._risks_output


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return RisksHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_risks.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "risks"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
