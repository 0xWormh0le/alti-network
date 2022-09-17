from dataclasses import dataclass
from enum import Enum, unique
from pathlib import Path
from typing import Any, Dict, List, Optional, Type, TypeVar

from dynamo_query.sentinel import SentinelValue
from flavius_client_sdk.model.person import Person
from tools import yaml_tools
from tools.catalogs import Platform
from tools.datetime_tools import parse
from tools.logger import Logger

from external_api.models.model_base import ModelBase
from external_api.models.schema_utils import SchemaUtils

_User = TypeVar("_User", bound="User")
_Id = TypeVar("_Id", bound="Id")
_Name = TypeVar("_Name", bound="Name")
_Avatar = TypeVar("_Avatar", bound="Avatar")
_Email = TypeVar("_Email", bound="Email")
_Notes = TypeVar("_Notes", bound="Notes")
_Phone = TypeVar("_Phone", bound="Phone")

none_email: Dict[str, Any] = {"address": None, "kind": "personal", "primary": False}


###################################
# Exceptions
class BadUserData(Exception):
    def __init__(self, var_name: str, var_value: Any) -> None:
        super().__init__()
        self.var_name = var_name
        self.var_value = var_value

    def to_str(self) -> str:
        return f"Variable {self.var_name} has bad value '{self.var_value}'."


def skip_none_values(data: dict) -> dict:
    return {k: v for k, v in data.items() if v}


###################################
# Enums
@unique
class UsageKind(Enum):
    personal = "personal"
    work = "work"


@unique
class UserKind(Enum):
    user = "user"
    person = "person"
    service_account = "service_account"


@unique
class AccessLevel(Enum):
    member = "member"
    manager = "manager"
    owner = "owner"
    admin = "admin"


###################################
# Attribute data classes
@dataclass
class Id:
    platform: Platform
    value: str

    @classmethod
    def from_dynamo_dm(cls: Type[_Id], attrs: Dict[str, Any]) -> _Id:
        return cls(Platform(attrs["platform"]), attrs["value"])

    def to_api_dm(self) -> Dict[str, Any]:
        if not self.value:
            return dict()

        d = {"platform": self.platform.value, "value": self.value}
        return skip_none_values(d)


@dataclass
class Name:
    given_name: str
    family_name: str
    full_name: str

    @classmethod
    def from_dynamo_dm(cls: Type[_Name], attrs: Dict[str, Any]) -> _Name:
        return cls(
            attrs.get("given_name", ""),
            attrs.get("family_name", ""),
            f"{attrs.get('given_name', '')} {attrs.get('family_name')}",
        )

    def to_api_dm(self) -> Dict[str, Any]:
        d = {
            "givenName": self.given_name,
            "familyName": self.family_name,
            "fullName": self.full_name,
        }
        return skip_none_values(d)

    def to_sql_dm(self) -> Dict[str, Any]:
        d = {
            "given_name": self.given_name,
            "family_name": self.family_name,
            "full_name": self.full_name,
        }
        return skip_none_values(d)


@dataclass
class Email:
    address: str
    kind: UsageKind
    primary: bool
    access_count: int
    risk_count: int
    last_deleted_permissions: int

    @classmethod
    def from_dynamo_dm(cls: Type[_Email], attrs: Dict[str, Any]) -> _Email:
        return cls(
            attrs["address"],
            UsageKind(attrs["kind"]),
            attrs.get("primary", False),
            attrs.get("access_count", 0),
            attrs.get("risk_count", 0),
            attrs.get("last_deleted_permissions", 0),
        )

    def to_api_dm(self) -> Dict[str, Any]:
        if not self.address:
            return dict()

        d = {
            "address": self.address,
            "kind": self.kind.value,
            "primary": self.primary,
            "accessCount": self.access_count,
            "riskCount": self.risk_count,
            "lastDeletedPermissions": self.last_deleted_permissions,
        }
        return skip_none_values(d)

    def to_sql_dm(self) -> Dict[str, Any]:
        if not self.address:
            return dict()

        d = {
            "address": self.address,
            "kind": self.kind.value,
            "primary": self.primary,
            "access_count": self.access_count,
            "risk_count": self.risk_count,
            "last_deleted_permissions": self.last_deleted_permissions,
        }
        return skip_none_values(d)


@dataclass
class Phone:
    number: str
    kind: UsageKind
    primary: bool

    @classmethod
    def from_dynamo_dm(cls: Type[_Phone], attrs: Dict[str, Any]) -> _Phone:
        return cls(
            attrs.get("phone", ""),
            UsageKind(attrs.get("kind", "personal")),
            attrs.get("primary", False),
        )

    def to_api_dm(self) -> Dict[str, Any]:
        if not self.number:
            return dict()

        d = {"number": self.number, "kind": self.kind.value, "primary": self.primary}
        return skip_none_values(d)


@dataclass
class Avatar:
    url: str
    url_etag: str

    @classmethod
    def from_dynamo_dm(cls: Type[_Avatar], attrs: Dict[str, Any]) -> _Avatar:
        return cls(attrs.get("url", ""), attrs.get("url_etag", ""))

    def to_api_dm(self) -> Dict[str, Any]:
        d = {"url": self.url, "url_etag": self.url_etag}
        return skip_none_values(d)


@dataclass
class Notes:
    content: str
    content_type: str

    @classmethod
    def from_dynamo_dm(cls: Type[_Notes], attrs: Dict[str, Any]) -> _Notes:
        return cls(attrs.get("content", ""), attrs.get("content_type", ""))

    def to_api_dm(self) -> Dict[str, Any]:
        d = {"url": self.content, "url_etag": self.content_type}
        return skip_none_values(d)


###################################
# Main data class
class User(ModelBase):
    schema_path = Path(__file__).parents[1] / "schema/user-v1.0.yml"

    def __init__(
        self,
        project_id: str,
        primary_email: Optional[Email] = None,
        altnet_id: Optional[str] = None,
        access_count: Optional[int] = None,
        risk_count: Optional[int] = None,
        external_count: Optional[int] = None,
        internal_count: Optional[int] = None,
        internal: Optional[bool] = None,
        name: Optional[Name] = None,
        user_kind: Optional[UserKind] = None,
        access_level: Optional[AccessLevel] = None,
        avatar: Optional[Avatar] = None,
        recovery_email: Optional[Email] = None,
        emails: Optional[List[Email]] = None,
        phones: Optional[List[Phone]] = None,
        external_ids: Optional[List[Id]] = None,
        last_login_time: Optional[int] = None,
        last_removed_permissions: Optional[int] = None,
        org_unit_path: Optional[str] = None,
        is_enrolled_in_mfa: Optional[bool] = None,
        creation_time: Optional[int] = None,
        last_modified_time: Optional[int] = None,
        etag: Optional[str] = None,
        notes: Optional[Notes] = None,
    ) -> None:
        if not (primary_email or altnet_id):
            raise BadUserData("altnet_id, primary_email", None)

        self._access_count = access_count
        self._access_level = access_level
        self._altnet_id = altnet_id
        self._avatar = avatar
        self._creation_time = creation_time
        self._emails = emails
        self._external_count = external_count
        self._external_ids = external_ids
        self._etag = etag
        self._internal = internal
        self._internal_count = internal_count
        self._is_enrolled_in_mfa = is_enrolled_in_mfa
        self._last_login_time = last_login_time
        self._last_modified_time = last_modified_time
        self._last_removed_permissions = last_removed_permissions
        self._name = name
        self._notes = notes
        self._org_unit_path = org_unit_path
        self._phones = phones
        self._primary_email = primary_email
        self._project_id = project_id
        self._recovery_email = recovery_email
        self._risk_count = risk_count
        self._user_kind = user_kind

        self.logger = Logger.for_object(self)

    ###################################
    @property
    def schema(self) -> str:
        return yaml_tools.load_from_file(self.schema_path)

    ###################################
    # Interface methods
    @classmethod
    def from_dynamo_dm(cls: Type[_User], attrs: Dict[str, Any]) -> _User:
        """
        Arguments:
            attrs: a dict object (usually an output of JSON-serialization)
                containing user attributes. Required keys:
                - primary_email_address
                - project_id
        Returns:
            a User object from specific attrs
        """
        user_kind: UserKind = UserKind(attrs.get("user_kind"))
        access_level_data = attrs.get("access_level", "member")
        if isinstance(access_level_data, SentinelValue):
            access_level_data = "member"

        access_level: AccessLevel = AccessLevel[access_level_data]
        avatar: Avatar = Avatar.from_dynamo_dm(attrs.get("avatar", {}))
        recovery_email: Email = Email.from_dynamo_dm(attrs.get("recovery_email", none_email))
        emails: List[Email] = (
            [Email.from_dynamo_dm(email) for email in attrs["emails"]]
            if attrs.get("emails")
            else []
        )
        name: Name = Name.from_dynamo_dm(attrs)
        phones: List[Phone] = [Phone.from_dynamo_dm(phone) for phone in attrs.get("phones", [])]
        external_ids: List[Id] = (
            [Id.from_dynamo_dm({"value": attrs["permission_id"], "platform": attrs["platform"]})]
            if attrs.get("permission_id")
            else []
        )
        last_login_time = int(
            parse(attrs["last_login_time"]).timestamp() if attrs.get("last_login_time") else 0
        )
        creation_time = int(
            parse(attrs["creation_time"]).timestamp() if attrs.get("creation_time") else 0
        )
        last_modified_time = int(
            parse(attrs["last_modified_time"]).timestamp() if attrs.get("last_modified_time") else 0
        )

        last_removed = attrs.get("last_removed_permissions")
        last_removed_permissions = int(
            parse(last_removed).timestamp()
            if last_removed and isinstance(last_removed, str)
            else last_removed
            if last_removed and isinstance(last_removed, int)
            else 0
        )
        primary_email: Email = Email.from_dynamo_dm(
            {
                "address": attrs["primary_email_address"],
                "kind": UsageKind(attrs.get("usage_kind")),
                "primary": attrs["internal"],
                "access_count": attrs["access_count"] if attrs.get("access_count") else 0,
                "risk_count": attrs["risk_count"] if attrs.get("risk_count") else 0,
                "last_deleted_permissiion": last_removed_permissions,
            }
        )
        notes = Notes.from_dynamo_dm(attrs["notes"]) if attrs.get("notes") else None

        return cls(
            access_count=attrs["access_count"] if attrs.get("access_count") else 0,
            access_level=access_level,
            altnet_id=attrs["altnet_id"] if attrs.get("altnet_id") else None,
            avatar=avatar,
            creation_time=creation_time,
            emails=emails,
            external_count=attrs["external_count"] if attrs.get("external_count") else 0,
            external_ids=external_ids,
            etag=None,
            internal=bool(attrs["internal"]),
            internal_count=attrs["internal_count"] if attrs.get("internal_count") else 0,
            is_enrolled_in_mfa=bool(attrs.get("is_enrolled_in_mfa")),
            last_login_time=last_login_time,
            last_modified_time=last_modified_time,
            last_removed_permissions=last_removed_permissions,
            name=name,
            notes=notes,
            org_unit_path=attrs.get("org_unit_path"),
            phones=phones,
            primary_email=primary_email,
            project_id=attrs["project_id"],
            recovery_email=recovery_email,
            risk_count=attrs["risk_count"] if attrs.get("risk_count") else 0,
            user_kind=user_kind,
        )

    def to_api_dm(self) -> Dict[str, Any]:
        """
        The to_api_dm() method transforms the data to a format that could be used by external APIs.
        This includes transforming the attribute keys to camelCase, as well some data validation.
        In the specific case of `Flavius`, use `to_api_sdk_dm()` method.
        """
        d = {
            "accessCount": self.access_count,
            "accessLevel": self.access_level.value if self.access_level else None,
            "altnetId": self.altnet_id,
            "avatar": self.avatar.to_api_dm() if self.avatar else None,
            "creationTime": self.creation_time,
            "emails": [d.to_api_dm() for d in self.emails] if self.emails else None,
            "externalCount": self.external_count,
            "externalIds": [d.to_api_dm() for d in self.external_ids]
            if self.external_ids
            else None,
            "etag": self.etag,
            "internal": self.internal,
            "internalCount": self.internal_count,
            "isEnrolledInMfa": self.is_enrolled_in_mfa,
            "lastLoginTime": self.last_login_time,
            "lastModifiedTime": self.last_modified_time,
            "lastRemovedPermissions": self.last_removed_permissions,
            "name": self.name.to_api_dm() if self.name else None,
            "notes": self.notes,
            "orgUnitPath": self.org_unit_path,
            "phones": [d.to_api_dm() for d in self.phones] if self.phones else None,
            "primaryEmail": self.primary_email.to_api_dm() if self.primary_email else None,
            "projectId": self.project_id,
            "recoveryEmail": self.recovery_email.to_api_dm() if self.recovery_email else None,
            "riskCount": self.risk_count,
            "userKind": self.user_kind.value if self.user_kind else None,
        }
        data = skip_none_values(d)
        self.validate_api_dm(data)
        return data

    def to_dynamo_dm(self) -> Dict[str, Any]:
        d = {
            "access_count": self.access_count,
            "access_level": self.access_level.value if self.access_level else None,
            "altnet_id": self.altnet_id,
            "avatar": self.avatar.to_api_dm() if self.avatar else None,
            "creation_time": self.creation_time,
            "emails": [d.to_sql_dm() for d in self.emails] if self.emails else None,
            "external_count": self.external_count,
            "external_ids": [d.to_api_dm() for d in self.external_ids]
            if self.external_ids
            else None,
            "etag": self.etag,
            "internal": self.internal,
            "internal_count": self.internal_count,
            "is_enrolled_in_mfa": self.is_enrolled_in_mfa,
            "last_login_time": self.last_login_time,
            "last_modified_time": self.last_modified_time,
            "last_removed_permissions": self.last_removed_permissions,
            "name": self.name.to_sql_dm() if self.name else None,
            "notes": self.notes,
            "org_unit_path": self.org_unit_path,
            "phones": [d.to_api_dm() for d in self.phones] if self.phones else None,
            "primary_email": self.primary_email.to_sql_dm() if self.primary_email else None,
            "project_id": self.project_id,
            "recovery_email": self.recovery_email.to_sql_dm() if self.recovery_email else None,
            "risk_count": self.risk_count,
            "user_kind": self.user_kind.value if self.user_kind else None,
        }

        data = skip_none_values(d)
        return data

    @classmethod
    def to_api_sdk_dm(cls, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Converts the User Model data to API data model using the Client SDK.
        This method uses our Flavius Client SDK to validate the User model in the following steps:
        (a) Load the data into `User` class using `from_dynamo_dm()`, which also validates the data.
        (b) Cast the user data in snake_case using the `to_dynamo_dm()` method.
        (c) Serialize the user data using the Client SDK for consumption by flavius.

        For returning the data for consumption by any API except Flavius, use `to_api_dm()` method.
        In the specific case of Flavius, the Flavius Client SDK also performs the same
        task as this method (transforming attributes to camelCase to be consumed bu Flavius).
        Therefore, we don't use `to_api_dm()` method when returning the response to Flavius.
        Instead, we use the `Person` class which is the Client SDK definition of the User class.

        Arguments:
            attrs -- raw user data from Dynamo

        Response:
            Serialized User Model from Client SDK
        """
        user_model = cls.from_dynamo_dm(attrs=attrs).to_dynamo_dm()
        return Person(**user_model).to_dict(serialize=True)

    def validate_api_dm(self, data: dict) -> bool:
        return SchemaUtils.validate_api_dm(
            instance=data, schema=yaml_tools.load_from_file(self.schema_path)
        )

    @classmethod
    def from_sql_dm(cls: Type[_User], attrs: Dict[str, Any]) -> _User:
        ...

    def to_sql_dm(self) -> Dict[str, Any]:
        ...

    ###################################
    # Properties
    @property
    def access_count(self) -> Optional[int]:
        return self._access_count

    @access_count.setter
    def access_count(self, value: int) -> None:
        self._access_count = value

    @property
    def risk_count(self) -> Optional[int]:
        return self._risk_count

    @risk_count.setter
    def risk_count(self, value: int) -> None:
        self._risk_count = value

    @property
    def internal_count(self) -> Optional[int]:
        return self._internal_count

    @internal_count.setter
    def internal_count(self, value: int) -> None:
        self._internal_count = value

    @property
    def external_count(self) -> Optional[int]:
        return self._external_count

    @external_count.setter
    def external_count(self, value: int) -> None:
        self._external_count = value

    @property
    def last_removed_permissions(self) -> Optional[int]:
        return self._last_removed_permissions

    @last_removed_permissions.setter
    def last_removed_permissions(self, value: int) -> None:
        self._last_removed_permissions = value

    @property
    def altnet_id(self) -> Optional[str]:
        return self._altnet_id

    @altnet_id.setter
    def altnet_id(self, value: str) -> None:
        self._altnet_id = value

    @property
    def project_id(self) -> str:
        return self._project_id

    @project_id.setter
    def project_id(self, value: str) -> None:
        self._project_id = value

    @property
    def internal(self) -> Optional[bool]:
        return self._internal

    @internal.setter
    def internal(self, value: bool) -> None:
        self._internal = value

    @property
    def name(self) -> Optional[Name]:
        return self._name

    @name.setter
    def name(self, value: Name) -> None:
        self._name = value

    @property
    def user_kind(self) -> Optional[UserKind]:
        return self._user_kind

    @user_kind.setter
    def user_kind(self, value: UserKind) -> None:
        self._user_kind = value

    @property
    def access_level(self) -> Optional[AccessLevel]:
        return self._access_level

    @access_level.setter
    def access_level(self, value: AccessLevel) -> None:
        self._access_level = value

    @property
    def avatar(self) -> Optional[Avatar]:
        return self._avatar

    @avatar.setter
    def avatar(self, value: Avatar) -> None:
        self._avatar = value

    @property
    def primary_email(self) -> Optional[Email]:
        return self._primary_email

    @primary_email.setter
    def primary_email(self, value: Email) -> None:
        self._primary_email = value

    @property
    def recovery_email(self) -> Optional[Email]:
        return self._recovery_email

    @recovery_email.setter
    def recovery_email(self, value: Email) -> None:
        self._recovery_email = value

    @property
    def emails(self) -> Optional[List[Email]]:
        return self._emails

    @emails.setter
    def emails(self, value: List[Email]) -> None:
        self._emails = value

    @property
    def phones(self) -> Optional[List[Phone]]:
        return self._phones

    @phones.setter
    def phones(self, value: List[Phone]) -> None:
        self._phones = value

    @property
    def external_ids(self) -> Optional[List[Id]]:
        return self._external_ids

    @external_ids.setter
    def external_ids(self, value: List[Id]) -> None:
        self._external_ids = value

    @property
    def last_login_time(self) -> Optional[int]:
        return self._last_login_time

    @last_login_time.setter
    def last_login_time(self, value: int) -> None:
        self._last_login_time = value

    @property
    def org_unit_path(self) -> Optional[str]:
        return self._org_unit_path

    @org_unit_path.setter
    def org_unit_path(self, value: str) -> None:
        self._org_unit_path = value

    @property
    def is_enrolled_in_mfa(self) -> Optional[bool]:
        return self._is_enrolled_in_mfa

    @is_enrolled_in_mfa.setter
    def is_enrolled_in_mfa(self, value: bool) -> None:
        self._is_enrolled_in_mfa = value

    @property
    def creation_time(self) -> Optional[int]:
        return self._creation_time

    @creation_time.setter
    def creation_time(self, value: int) -> None:
        self._creation_time = value

    @property
    def last_modified_time(self) -> Optional[int]:
        return self._last_modified_time

    @last_modified_time.setter
    def last_modified_time(self, value: int) -> None:
        self._last_modified_time = value

    @property
    def etag(self) -> Optional[str]:
        return self._etag

    @etag.setter
    def etag(self, value: str) -> None:
        self._etag = value

    @property
    def notes(self) -> Optional[Notes]:
        return self._notes

    @notes.setter
    def notes(self, value: Notes) -> None:
        self._notes = value


def main() -> None:
    raw_user_dict = {
        "access_level": "admin",
        "altnet_id": "adfke2lei-34239-e3e2-eeefdalfkel-dlfei2-edfl",
        "dt_created": "2021-01-29T00:27:14.951351",
        "dt_modified": "2021-05-17T18:34:12.220337",
        "emails": [
            {
                "address": "nyah@thoughtlabs.io.test-google-a.com",
                "kind": "work",
                "access_count": 1,
                "risk_count": 2,
                "last_deleted_permissions": 0,
            },
            {
                "address": "m-14827@thoughtlabs.io",
                "kind": "work",
                "access_count": 1,
                "risk_count": 2,
                "last_deleted_permissions": 0,
            },
            {
                "address": "nyahc+test@gmail.com",
                "kind": "personal",
                "access_count": 1,
                "risk_count": 2,
                "last_deleted_permissions": 0,
            },
            {
                "address": "n-776@thoughtlabs.io.test-google-a.com",
                "kind": "work",
                "access_count": 1,
                "risk_count": 2,
                "last_deleted_permissions": 0,
            },
        ],
        "external_count": 1,
        "family_name": "Check",
        "family_name_lc": "check",
        "given_name": "Nyah",
        "given_name_lc": "nyah",
        "identity_master": "1",
        "internal": True,
        "internal_count": 4,
        "phones": [{"kind": "personal", "phone": "+14154154415"}],
        "pk": "thoughtlabs_1",
        "platform": "gsuite",
        "primary_email_address": "nyah@thoughtlabs.io",
        "access_count": 12,
        "risk_count": 5,
        "last_deleted_permissions": 0,
        "project_id": "thoughtlabs",
        "scrape": "1",
        "sk": "altuser_f3b944aitbie2i32oelr8239fl",
        "status": "active",
        "usage_kind": "work",
        "user_email": "nyah@thoughtlabs.io",
        "user_id": "4893382458539448239455820",
        "user_kind": "user",
    }

    print(f"Info: {User.to_api_sdk_dm(raw_user_dict)}")


##########################
if __name__ == "__main__":
    main()
