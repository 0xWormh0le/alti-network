import pytest

from external_api.utils.api_scopes_helper import ApiScopesHelper


class TestApiScopesHelper:
    def test_has_valid_permission_scopes(self, mock_config):
        permission_scopes = ApiScopesHelper(configs=mock_config).has_valid_permission_scopes()

        assert permission_scopes
