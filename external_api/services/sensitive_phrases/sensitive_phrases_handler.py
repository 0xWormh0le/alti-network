from typing import Any, Dict, List, Optional, Set

from tools.class_tools import cached_property
from tools.dynamo.data_state_table.risk_engine_keyword_record import RiskEngineKeywordRecord
from tools.dynamo.data_state_table.risk_engine_keywords_manager import RiskEngineKeywordsManager
from tools.lambda_handler import LambdaEvent, LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger
from tools.uuid_generator import UuidGenerator

from external_api.exceptions import (
    BadRequest,
    ForbiddenError,
    InternalServerError,
    InvalidSensitivePhrase,
)
from external_api.utils.external_api_handler_template import ExternalApiHandlerTemplate


class SensitivePhrasesHandler(ExternalApiHandlerTemplate):
    name = __name__
    event: LambdaEvent

    def __init__(self, enable_sentry: bool, raise_errors: bool) -> None:
        super().__init__(
            enable_sentry=enable_sentry,
            raise_errors=raise_errors,
        )
        self._event: Optional[LambdaEvent] = None
        self._existing_keywords: Optional[Set[str]] = None

    @property
    def job_name(self) -> str:
        return "sensitive_phrases"

    @cached_property
    def risk_engine_keywords_manager(self) -> RiskEngineKeywordsManager:
        if not self.event:
            raise InternalServerError(
                "RiskEngineKeywordsManager cannot be invoked before SensitivePhrasesHandler"
            )
        return RiskEngineKeywordsManager(self.configs)

    @cached_property
    def phrase_records(self) -> List[RiskEngineKeywordRecord]:
        result = list(self.risk_engine_keywords_manager.query_visible_keywords())
        self.logger.json(result, name="Phrase records")
        return result

    @property
    def existing_keywords(self) -> Set[str]:
        if not self._existing_keywords:
            self._existing_keywords = set(
                self.risk_engine_keywords_manager.get_sensitive_keywords()
            )

        return self._existing_keywords

    def validate_sensitive_phrase(self, phrase: str) -> bool:
        """
        Validates sensitive phrase follows the required formats.
        String of ASCII characters which are considered printable.
        It contains digits, ascii_letters, punctuation, and whitespace.clear; clear;

        Arguments:
            phrase -- sensitive phrase

        Returns:
            bool True or False if phrase is valid or not.
        """
        if len(phrase) < 3 or len(phrase) > 50:
            self.logger.error(f"FAIL (char cnt): original string: '{phrase}'")
            return False

        if len([ch for ch in phrase if ch and not ch.isprintable()]) > 0:
            self.logger.error(f"FAIL (non-print char): original string: '{phrase}'")
            return False

        return True

    def _call_data_state_get(self) -> List[Dict[str, Any]]:
        phrases = []
        for word in self.phrase_records:
            phrases.append(
                {
                    "id": word["uuid"],
                    "phrase": word["keyword"],
                    "exact": bool(word["exact_match"]),
                }
            )

        return phrases

    def _call_data_state_delete(self, event: LambdaEvent) -> str:
        key_id = event.get_query_parameter("id")
        sensitive_phrase = [word for word in self.phrase_records if word["uuid"] == key_id]

        if not sensitive_phrase:
            raise ForbiddenError("Sensitive phrase does not exist")

        self.risk_engine_keywords_manager.delete_by_uuids(key_id)

        return f"Successfully deleted phrase: {sensitive_phrase[0]['keyword']}"

    def _call_data_state_post(self, event: LambdaEvent) -> str:
        phrase = event.get_query_parameter("phrase", "")
        exact = event.get_query_parameter("exact", "false").lower() == "true"

        if len(self.phrase_records) > 20:
            raise ForbiddenError("Maximum sensitive phrase limit reached!")

        if not self.validate_sensitive_phrase(phrase=phrase):
            raise InvalidSensitivePhrase(f"Unprocessable sensitive phrase: {phrase}")

        if phrase in self.existing_keywords:
            raise ForbiddenError(f"Sensitive phrase '{phrase}' exists")

        self.risk_engine_keywords_manager.upsert(
            uuid=UuidGenerator.generate_uuid_str(),
            keyword=phrase,
            exact_match=exact,
        )
        self.existing_keywords.add(phrase)
        return f"Successfully added {phrase}"

    def call_data_state(self) -> Any:
        """
        Invokes data state manager method
        """
        method_name = self.event.get("httpMethod").lower()

        response: Any = None
        if method_name == "get":
            response = self._call_data_state_get()
        elif method_name == "delete":
            response = self._call_data_state_delete(self.event)
        elif method_name == "post":
            response = self._call_data_state_post(self.event)
        else:
            raise BadRequest("Invalid value for httpMethod")

        return response

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        return self.call_data_state()


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return SensitivePhrasesHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(
        resources.read_text(payloads, "test_event_sensitive_phrases.json")
    )
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    main_handler(test_event, context)


##########################
if __name__ == "__main__":
    main()
