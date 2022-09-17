from dataclasses import dataclass, field
from itertools import zip_longest
from typing import Any, Dict, List, Optional, Type, TypeVar

from flavius_client_sdk.model.file_output_model import FileOutputModel
from tools.catalogs import Platform
from tools.config import Config
from tools.logger import Logger

from external_api.models.sensitive_phrases import SingleFileSensitivePhrases
from external_api.models.user import User
from external_api.models.visibility import Visibility
from external_api.user.user_generator import UserGenerator
from external_api.utils.constants import DEFAULT_ROOT_FOLDER, DEFAULT_USER_ROLE, USER_ROLE_MAP

_File = TypeVar("_File", bound="File")
_Folder = TypeVar("_Folder", bound="Folder")
_SharedDomain = TypeVar("_SharedDomain", bound="SharedDomain")


def map_role(role: str) -> str:
    logger = Logger(__name__, level=Logger.WARNING)

    if role not in USER_ROLE_MAP.keys():
        logger.warning(f"Unrecognized role: `{role}`")

    return USER_ROLE_MAP.get(role) or DEFAULT_USER_ROLE


@dataclass
class Folder:
    folder_id: str
    folder_name: str

    @classmethod
    def from_sql_dm(cls: Type[_Folder], attrs: Dict[str, Any]) -> _Folder:
        return cls(attrs.get("folder_id") or "", attrs.get("folder_name") or DEFAULT_ROOT_FOLDER)

    def to_sql_dm(self) -> Dict[str, Any]:
        return {"folder_id": self.folder_id, "folder_name": self.folder_name}

    def to_api_dm(self) -> Dict[str, Any]:
        if not self.folder_id:
            return {}

        return {"folderId": self.folder_id, "folderName": self.folder_name}


@dataclass
class SharedDomain:
    name: str
    permission_id: str

    @classmethod
    def from_sql_dm(cls: Type[_SharedDomain], attrs: Dict[str, Any]) -> _SharedDomain:
        return cls(attrs.get("name", ""), attrs.get("permission_id", ""))

    def to_sql_dm(self) -> Dict[str, Any]:
        if not self.permission_id:
            return {}

        return {"name": self.name, "permission_id": self.permission_id}

    def to_api_dm(self) -> Dict[str, Any]:
        if not self.permission_id:
            return {}

        return {"name": self.name, "permissionId": self.permission_id}


@dataclass
class File:
    project_id: Optional[str] = None
    platform: Optional[Platform] = None
    file_id: Optional[str] = None
    file_name: Optional[str] = None
    created_at: Optional[int] = None
    last_modified: Optional[int] = None
    internal_access_count: Optional[int] = None
    external_access_count: Optional[int] = None
    created_by: Optional[User] = None
    link_visibility: Optional[Visibility] = None
    mime_type: Optional[str] = None
    md5_checksum: Optional[str] = None
    last_ingested: Optional[int] = None
    icon_url: Optional[str] = None
    web_link: Optional[str] = None
    parent_folder: Optional[Folder] = None
    platform_name: Optional[str] = None
    trashed: Optional[bool] = False
    sensitive_phrases: Optional[SingleFileSensitivePhrases] = None
    shared_to_domains: List[SharedDomain] = field(default_factory=list)
    internal_access_list: List[User] = field(default_factory=list)
    external_access_list: List[User] = field(default_factory=list)

    @classmethod
    def from_sql_dm(
        cls: Type[_File], config: Config, platform: str, attrs: Dict[str, Any]
    ) -> _File:
        """
        Arguments:
            attrs: a dict object (usually an output of JSON-serialization)
                containing user attributes. Required keys:
                - project_id
                - platform
                - file_id
                - file_name
        Returns:
            a User object from specific attrs
        """
        pltfm = Platform(platform)
        external_access_list: List[User] = cls.build_access_list(
            platform=pltfm,
            config=config,
            attrs={
                "emails": attrs.get("external_access_list"),
                "roles": attrs.get("external_permissions_role"),
                "permissions": attrs.get("external_permissions_id"),
            },
        )
        internal_access_list: List[User] = cls.build_access_list(
            platform=pltfm,
            config=config,
            attrs={
                "emails": attrs.get("internal_access_list"),
                "roles": attrs.get("internal_permissions_role"),
                "permissions": attrs.get("internal_permissions_id"),
            },
        )
        link_visibility: Visibility = Visibility.get_most_severe_visibility(
            (attrs["link_visibility"].split(",")) if attrs.get("link_visibility") else ["none"]
        )
        permission_ids = attrs["permissions_id"].split(",") if attrs.get("permissions_id") else []
        permission_domains = (
            attrs["permissions_domain"].split(",") if attrs.get("permissions_domain") else []
        )
        creator_record = UserGenerator(config, platform).get_user_record(
            attrs.get("creator_email", "")
        )
        created_by = User.from_dynamo_dm(creator_record) if creator_record else None

        return cls(
            file_id=attrs["file_id"],
            file_name=attrs["file_name"],
            created_at=(attrs.get("created_at") or 0),
            last_modified=(attrs.get("last_modified") or 0),
            internal_access_count=len(internal_access_list),
            external_access_count=len(external_access_list),
            created_by=created_by,
            link_visibility=link_visibility,
            mime_type=(attrs["file_mimetype"].split(".")[-1] if attrs.get("file_mimetype") else ""),
            md5_checksum=attrs.get("md5checksum") or "",
            last_ingested=(attrs.get("last_ingested") or 0),
            icon_url=(
                attrs["icon_link"].replace("/16/", "/256/") if attrs.get("icon_link") else ""
            ),
            web_link=(attrs["web_link"] if attrs.get("web_link") else ""),
            parent_folder=Folder.from_sql_dm(attrs),
            platform_name=attrs["platform_name"],
            platform=pltfm,
            project_id=config.project_name,
            trashed=(bool(attrs.get("trashed", False))),
            sensitive_phrases=SingleFileSensitivePhrases.from_sql_dm(attrs),
            shared_to_domains=[
                SharedDomain.from_sql_dm({"name": name, "permission_id": perm_id})
                for name, perm_id in zip(permission_domains, permission_ids)
            ],
            internal_access_list=internal_access_list,
            external_access_list=external_access_list,
        )

    @classmethod
    def build_access_list(
        cls, config: Config, platform: Platform, attrs: Dict[str, Any]
    ) -> List[User]:
        """
        _maps dictionary keys from db table column names to front-end naming convention
        """
        email_list = attrs["emails"].split(",") if attrs.get("emails") else []
        roles = attrs["roles"].split(",") if attrs.get("roles") else []
        perm_ids = attrs["permissions"].split(",") if attrs.get("permissions") else []

        user_list: List[User] = []
        for email, user_role, permission_id in zip_longest(email_list, roles, perm_ids):
            user_info: Dict[str, Any] = UserGenerator(config, platform.value).get_user_record(email)
            user_info["platform"] = platform.value
            user_info["access_level"] = user_role
            user_info["permission_id"] = permission_id
            user_info["access_level"] = map_role(user_role)
            user_list.append(User.from_dynamo_dm(user_info))

        return user_list

    def to_api_dm(self) -> Dict[str, Any]:
        return {
            "createdAt": self.created_at,
            "createdBy": self.created_by.to_api_dm() if self.created_by else {},
            "externalAccessCount": self.external_access_count,
            "externalAccessList": [user.to_api_dm() for user in self.external_access_list]
            if self.external_access_list
            else [],
            "fileId": self.file_id,
            "fileName": self.file_name,
            "iconUrl": self.icon_url,
            "internalAccessCount": self.internal_access_count,
            "internalAccessList": [user.to_api_dm() for user in self.internal_access_list]
            if self.internal_access_list
            else [],
            "lastIngested": self.last_ingested,
            "lastModified": self.last_modified,
            "linkVisibility": self.link_visibility.name if self.link_visibility else "none",
            "md5Checksum": self.md5_checksum,
            "mimeType": self.mime_type,
            "parentFolder": self.parent_folder.to_api_dm() if self.parent_folder else {},
            "platformId": self.platform.value if self.platform else "gsuite",
            "platformName": self.platform_name,
            "sensitivePhrases": self.sensitive_phrases.to_api_dm()
            if self.sensitive_phrases
            else None,
            "sharedToDomains": [domain.to_api_dm() for domain in self.shared_to_domains],
            "trashed": self.trashed,
            "webLink": self.web_link,
        }

    def to_sql_dm(self) -> Dict[str, Any]:
        return {
            "created_at": self.created_at,
            "created_by": self.created_by.to_dynamo_dm() if self.created_by else {},
            "external_access_count": self.external_access_count,
            "external_access_list": [user.to_dynamo_dm() for user in self.external_access_list]
            if self.external_access_list
            else [],
            "file_id": self.file_id,
            "file_name": self.file_name,
            "icon_url": self.icon_url,
            "internal_access_count": self.internal_access_count,
            "internal_access_list": [user.to_dynamo_dm() for user in self.internal_access_list]
            if self.internal_access_list
            else [],
            "last_ingested": self.last_ingested,
            "last_modified": self.last_modified,
            "link_visibility": self.link_visibility.name if self.link_visibility else "none",
            "md5_checksum": self.md5_checksum,
            "mime_type": self.mime_type,
            "parent_folder": self.parent_folder.to_sql_dm() if self.parent_folder else {},
            "platform_id": self.platform.value if self.platform else "gsuite",
            "platform_name": self.platform_name,
            "sensitive_phrases": self.sensitive_phrases.to_sql_dm()
            if self.sensitive_phrases
            else {},
            "shared_to_domains": [d.to_sql_dm() for d in self.shared_to_domains],
            "trashed": self.trashed,
            "web_link": self.web_link,
        }

    @classmethod
    def to_api_sdk_dm(cls, config: Config, platform: str, attrs: Dict[str, Any]) -> Dict[str, Any]:
        """
        Converts the File Model data to API data model using the Client SDK.

        Arguments:
            project_id  -- Project Id
            platform    -- Platform
            attrs       -- Raw File data from SQL.

        Results:
            Serialized File Model from Client SDK
        """
        file_model = cls.from_sql_dm(config=config, platform=platform, attrs=attrs).to_sql_dm()

        file_out_model = FileOutputModel(**file_model).to_dict(serialize=True)
        if not file_out_model["parentFolder"]["folderId"]:
            file_out_model["parentFolder"] = {}

        return file_out_model


def main() -> None:
    raw_visibles = ["unknown", "external", "internal", "group"]
    visible = Visibility.get_most_severe_visibility(raw_visibles)
    assert visible.name == "external"

    raw_file_dict = {
        "file_id": "1FV0SkHK_jjQSC-NRpkyVuyqwMZKKw4aP1lNOayBL2Gw",
        "file_name": "merit",
        "tin_count": 0,
        "ccn_count": 0,
        "kw_count_data": "[]",
        "created_at": 1613693987,
        "creator_email": "amol@thoughtlabs.io",
        "base.creator_email": "amol@thoughtlabs.io",
        "last_modified": 1613693994,
        "file_mimetype": "application/vnd.google-apps.document",
        "md5checksum": None,
        "folder_id": "0AAIirW6trR84Uk9PVA",
        "folder_name": "My Drive",
        "platform": "gsuite",
        "platform_name": "Google Workspace",
        "last_ingested": 1613892643,
        "trashed": 0,
        "icon_link": "/16/type/application/vnd.google-apps.document",
        "web_link": "https://docs.google.com/document/d/0AAIirW6trR84Uk9PVA/edit?usp=drivesdk",
        "permissions_domain": "gmail.com,thoughtlabs.io",
        "permissions_id": "17663922708776835730,15578356261102364698,11995125594131066371",
        "link_visibility": "user",
        "internal_access_list": "amol@thoughtlabs.io",
        "internal_access_count": 1,
        "internal_access_firstname_list": "Amol",
        "internal_access_lastname_list": "Patel",
        "internal_permissions_role": "owner",
        "internal_permissions_id": "11995125594131066371",
        "external_access_list": "mr.amolpatel@gmail.com,amol.canvas@gmail.com",
        "external_access_count": 2,
        "external_access_firstname_list": "Amol,Amol",
        "external_access_lastname_list": "Patel,Patel",
        "external_permissions_role": "writer,writer",
        "external_permissions_id": "17663922708776835730,15578356261102364698",
        "creator_lastname": "Patel",
        "creator_firstname": "Amol",
    }

    file_info = File.from_sql_dm(
        config=Config("thoughtlabs"), platform="gsuite", attrs=raw_file_dict
    ).to_api_dm()
    print(f"File: {file_info}")

    file_sdk_info = File.to_api_sdk_dm(
        config=Config("thoughtlabs"), platform="gsuite", attrs=raw_file_dict
    )
    print(f">>SDK<<<<: {file_sdk_info}")


##########################
if __name__ == "__main__":
    main()
