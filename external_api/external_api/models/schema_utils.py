from jsonschema import FormatChecker, validate
from jsonschema.exceptions import ValidationError


class SchemaUtils:
    @classmethod
    def validate_api_dm(cls, instance: dict, schema: dict) -> bool:
        response = True
        try:
            validate(instance=instance, schema=schema, format_checker=FormatChecker())
        except ValidationError:
            response = False

        return response
