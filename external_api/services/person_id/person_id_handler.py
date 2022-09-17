from pathlib import Path
from typing import Any, Dict

from tools.lambda_handler import LambdaResponse, LambdaResponseData, get_dummy_context
from tools.lambda_handler.lambda_event_base import LambdaEventBase
from tools.logger import Logger

from external_api.utils.external_api_handler_template import BadRequest, ExternalApiHandlerTemplate


class PersonIdHandler(ExternalApiHandlerTemplate):
    name = __name__

    sql_path: Path = Path(__file__).resolve().parent / "sql"

    @property
    def job_name(self) -> str:
        return "person_id"

    def get_response(self, event: LambdaEventBase) -> LambdaResponseData:
        """
        Get person details

        Arguments:
            event - LambdaEvent body

        Returns:
            A dict of person details.
        """
        if not self.person_id:
            raise BadRequest("Invalid personId path parameter")

        if not self.platform_is_supported(self.platform):
            return {}

        return self.get_user_record(platform=self.platform.value, email=self.person_id)


def main_handler(event: Dict[str, Any], context: Any) -> LambdaResponse:
    Logger.main(formatter=Logger.JSONFormatter())
    return PersonIdHandler(enable_sentry=True, raise_errors=False).handle(event, context)


def main() -> None:
    from importlib import resources  # pylint: disable=import-outside-toplevel

    from tools import json_tools  # pylint: disable=import-outside-toplevel

    from tests import payloads  # pylint: disable=import-outside-toplevel

    logger = Logger.main(level=Logger.DEBUG)
    test_event = json_tools.loads(resources.read_text(payloads, "test_event_person_id.json"))
    logger.json(test_event, name="test_event")

    context = get_dummy_context()
    context.function_name = "person-id"
    main_handler(event=test_event, context=context)


##########################
if __name__ == "__main__":
    main()
