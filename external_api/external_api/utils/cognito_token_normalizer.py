from typing import Any, Dict


class CognitoTokenNormalizer:
    def __init__(self, token: Dict[str, Any]) -> None:
        self.token: Dict[str, Any] = token
        self.token_attributes: Dict[str, Any] = {}

    def normalize_token_attributes(self) -> Dict[str, Any]:
        attrs = self.token
        for attr in attrs:
            self.token_attributes[attr] = attrs[attr]
        print(f"TOKEN ATTRIBUTES: {self.token_attributes}")

        return self.token_attributes
