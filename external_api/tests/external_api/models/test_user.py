import json
from pathlib import Path

import pytest
from flavius_client_sdk.exceptions import ApiAttributeError, ApiTypeError, ApiValueError
from flavius_client_sdk.model.person import Person
from jsonschema import FormatChecker, validate
from tools import yaml_tools

from external_api.models.schema_utils import SchemaUtils

schema_path = Path(__file__).parents[3] / "external_api/schema/user-v1.0.yml"


class TestUserModel:
    @pytest.fixture
    def user_schema(self):
        return yaml_tools.load_from_file(schema_path)

    @property
    def base_user_instance(self):
        """
        A User object should at the minimu have a projectId and
        either of altnetId or primaryEmail attributes.
        This fixture provides a base data for other test methods
        to work with.
        """
        return '"projectId": "thoughtlabs", "altnetId": "1234", '

    def test_pass_required_properties_email(self, user_schema):
        """Required properties:
        - projectId
        - any of altnetId and primaryEmail
        """
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"primaryEmail": {'
            '"accessCount": 2, "address": "bobbie@thoughtlabs.io", '
            '"kind": "work", "primary": true, '
            '"riskCount": 1, "lastDeletedPermissions": 0'
            "}"
            "}"
        )
        test_ds = json.loads(data)
        val_res = SchemaUtils.validate_api_dm(test_ds, user_schema)
        assert val_res

    def test_pass_required_properties_altnetid(self, user_schema):
        """Required properties:
        - projectId
        - any of altnetId and primaryEmail
        """
        data = "{" '"projectId": "thoughtlabs", ' '"altnetId": "1234" ' "}"
        test_ds = json.loads(data)
        val_res = SchemaUtils.validate_api_dm(test_ds, user_schema)
        assert val_res

    def test_fail_missing_required_properties_email(self, user_schema):
        """Required properties:
        - projectId
        - any of altnetId and primaryEmail
        """
        data = "{" '"projectId": "thoughtlabs" ' "}"
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()

    def test_pass_all_properties(self, user_schema):
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"internal": true, '
            '"primaryEmail": {'
            '"address": "bobbie@thoughtlabs.io", '
            '"kind": "work", "primary": true'
            "}, "
            '"name": {'
            '"givenName": "Bobbie", '
            '"familyName": "Hawaii", '
            '"fullName": "Bobbie Hawaii"'
            "}, "
            '"accessLevel": "member", '
            '"avatar": {'
            '"url": "https://avatar.jpg", '
            '"urlEtag": "abcdefg" '
            "}, "
            '"recoveryEmail": {'
            '"address": "bobbie@gmail.com", '
            '"kind": "personal", "primary": false, '
            '"accessCount": 2, "riskCount": 1, "lastDeletedPermissions": 0'
            "}, "
            '"emails": ['
            "{"
            '"address": "bobbie@gmail.com", '
            '"kind": "personal", "primary": false, '
            '"accessCount": 2, "riskCount": 1, "lastDeletedPermissions": 0'
            "}, "
            "{"
            '"address": "bobbie@thoughtlabs.io", '
            '"kind": "work", "primary": true, '
            '"accessCount": 2, "riskCount": 1, "lastDeletedPermissions": 0'
            "} "
            "], "
            '"phones": ['
            "{"
            '"number": "123456789", '
            '"kind": "work", "primary": true'
            "}, "
            "{"
            '"number": "987654321", '
            '"kind": "personal", "primary": false'
            "} "
            "], "
            '"externalIds": ['
            "{"
            '"platform": "gsuite", '
            '"value": "1234"'
            "}, "
            "{"
            '"platform": "o365", '
            '"value": "4321"'
            "} "
            "], "
            '"lastLoginTime": 1542170340, '
            '"orgUnitPath": "engineering/developers", '
            '"isEnrolledInMFA": true, '
            '"etag": "1234abcd", '
            '"creationTime": 1479098340, '
            '"lastModifiedTime": 1621529188, '
            '"notes": {'
            '"content": "Bobbie is our test user", '
            '"contentType": "text"'
            "} "
            "}"
        )
        test_ds = json.loads(data)
        val_res = validate(test_ds, user_schema, format_checker=FormatChecker())
        val_res = SchemaUtils.validate_api_dm(test_ds, user_schema)
        assert val_res

    def test_bad_user_kind(self, user_schema):
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"primaryEmail": {'
            '"address": "bobbie@thoughtlabs.io", '
            '"kind": "work", "primary": true, '
            '"accessCount": 2, "riskCount": 1, "lastDeletedPermissions": 0'
            "}"
            "}"
        )
        test_ds = json.loads(data)
        val_res = validate(test_ds, user_schema)
        assert not val_res  # a valid schema returns None

    def test_bad_email(self, user_schema):
        data = "{" '"projectId": "thoughtlabs", ' '"altnetId": "1234", ' '"primaryEmail": 123' "}"
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()

    def test_bad_email_kind(self, user_schema):
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"primaryEmail": {'
            '"address": "bobbie@thoughtlabs.io", '
            '"kind": "business", "primary": true '
            "}"
            "}"
        )
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()

    def test_bad_email_array_second_element(self, user_schema):
        """
        NOTE: for array elements, ensure to set the array `items` entry properly:
        https://stackoverflow.com/questions/51557138/
        json-schema-reporting-error-only-for-first-element-of-array
        Args:
            user_schema:

        Returns:

        """
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"emails": ['
            "{"
            '"address": "bobbie@gmail.com", '
            '"kind": "personal", "primary": false'
            "}, "
            "{"
            '"address": "bobbie@thoughtlabs.io", '
            '"kind": "business", "primary": true'
            "} "
            "] "
            "}"
        )
        test_ds = json.loads(data)
        with pytest.raises(ApiValueError):
            Person(**test_ds).check_validations()

    def test_bad_boolean_type(self, user_schema):
        """
        a boolean property can either access true or false values, without quotation marks
        """
        data = "{" '"projectId": "thoughtlabs", ' '"altnetId": "1234", ' '"internal": "true" ' "}"
        test_ds = json.loads(data)
        with pytest.raises(ApiTypeError):
            Person(**test_ds).check_validations()

    def test_bad_avatar(self, user_schema):
        """
        url is required property
        """
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"avatar": {'
            '"url": "1234567890abcdefg" '
            "} "
            "}"
        )
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()

    def test_bad_platform(self, user_schema):
        """
        platform is an enum. values are all lowercase
        """
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"externalIds": [{'
            '"platform": "gsuite", '
            '"value": "1234" '
            "}] "
            "}"
        )
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()

    def test_bad_last_login_time(self, user_schema):
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"lastLoginTime": "2020:10:01T01:01:01" '
            "}"
        )
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()

    def test_bad_org_unit_path(self, user_schema):
        data = "{" '"projectId": "thoughtlabs", ' '"altnetId": "1234", ' '"orgUnitPath": 123 ' "}"
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()

    def test_bad_is_enrolled_in_mfa(self, user_schema):
        """
        platform is an enum. values are all lowercase
        """
        data = (
            "{"
            '"projectId": "thoughtlabs", '
            '"altnetId": "1234", '
            '"isEnrolledInMFA": "True" '
            "}"
        )
        test_ds = json.loads(data)
        with pytest.raises(ApiAttributeError):
            Person(**test_ds).check_validations()
