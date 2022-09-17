from tools.config import Config
from tools.logger import Logger

from external_api.utils.constants import PERMISSION_REMOVE_SCOPE


class ApiScopesHelper:  # pylint: disable=too-few-public-methods
    def __init__(self, configs: Config) -> None:
        self.logger = Logger(__name__)
        self.configs = configs

    def has_valid_permission_scopes(self) -> bool:
        """Verifies Altitude has valid delete file permission scopes

        Arguments: None

        Returns:
                boolean
        """
        file_scopes = self.configs.get_scopes(api="drive", version="v3", application="file_actions")
        self.logger.json(file_scopes, name="permitted file scopes")
        return PERMISSION_REMOVE_SCOPE in file_scopes


def main() -> None:
    api_scope = ApiScopesHelper(configs=Config("thoughtlabs", "dev", "us-west-2"))
    print(f"Has valid permission scope: {api_scope.has_valid_permission_scopes()}")


if __name__ == "__main__":
    main()
