from dataclasses import dataclass, field
from typing import Any, Dict, List, Optional, Type, TypeVar

from flavius_client_sdk.model.authorized_app_events_output_model import (
    AuthorizedAppEventsOutputModel,
)
from flavius_client_sdk.model.file_events_output_model import FileEventsOutputModel
from flavius_client_sdk.model.person_events_output_model import PersonEventsOutputModel
from tools.catalogs import Platform
from tools.config import Config

from external_api.models.file import File
from external_api.models.user import User
from external_api.models.visibility import Visibility
from external_api.user.user_generator import UserGenerator

_Event = TypeVar("_Event", bound="Event")


@dataclass
class Event:
    project_id: Optional[str] = None
    platform: Optional[Platform] = None
    actor: Optional[User] = None
    datetime: Optional[int] = None
    destination_folder_title: Optional[str] = None
    event_description: Optional[str] = None
    event_id: Optional[str] = None
    event_name: Optional[str] = None
    exposure: Optional[Visibility] = None
    files: List[File] = field(default_factory=list)
    ip_address: Optional[str] = None
    membership_change_type: Optional[str] = None
    new_value: Optional[str] = None
    new_visibility: Optional[str] = None
    old_value: Optional[str] = None
    old_visibility: Optional[str] = None
    source_folder_title: Optional[str] = None
    target_people: List[User] = field(default_factory=list)
    visibility_change: Optional[str] = None

    @classmethod
    def from_sql_dm(
        cls: Type[_Event], config: Config, platform: Platform, attrs: Dict[str, Any]
    ) -> _Event:
        """
        Arguments:
            attrs: a dict object (usually an output of JSON-serialization)
                containing user attributes. Required keys:
                - project_id
                - platform
                - event_id
                - event_name
                - event_description
                - datetime
        Returns:
            _Event object.
        """
        user_obj = UserGenerator(config, platform.value)
        target_emails: List[str] = (
            attrs["target_email"].split(",") if attrs.get("target_email") else []
        )
        target_persons: List[User] = [
            User.from_dynamo_dm(user_obj.get_user_record(person)) for person in target_emails
        ]
        actor: Optional[User] = (
            User.from_dynamo_dm(user_obj.get_user_record(attrs["actor_email"]))
            if attrs.get("actor_email")
            else None
        )

        return cls(
            project_id=config.project_name,
            platform=platform,
            actor=actor,
            datetime=attrs["datetime"],
            destination_folder_title=attrs["destination_folder_title"],
            event_id=attrs["event_id"],
            event_name=attrs["event_name"],
            event_description=attrs["event_description"],
            exposure=Visibility.get_visibility_from_event_attrs(config, attrs),
            files=[File.from_sql_dm(config, platform.value, attrs)],
            ip_address=attrs["ipaddress"],
            membership_change_type=attrs["membership_change_type"],
            new_value=attrs["new_value"],
            new_visibility=attrs["new_visibility"],
            old_value=attrs["old_value"],
            old_visibility=attrs["old_visibility"],
            source_folder_title=attrs["source_folder_title"],
            target_people=target_persons,
            visibility_change=attrs["visibility_change"],
        )

    def to_api_dm(self) -> Dict[str, Any]:
        return {
            "actor": self.actor.to_api_dm() if self.actor else {},
            "datetime": self.datetime,
            "destinationFolderTitle": self.destination_folder_title,
            "eventDescription": self.event_description,
            "eventId": self.event_id,
            "eventName": self.event_name,
            "exposure": self.exposure.name if self.exposure else "none",
            "files": [fil.to_api_dm() for fil in self.files],
            "ipAddress": self.ip_address,
            "membershipChangeType": self.membership_change_type,
            "newValue": self.new_value,
            "newVisibility": self.new_visibility,
            "oldValue": self.old_value,
            "oldVisibility": self.old_visibility,
            "sourceFolderTitle": self.source_folder_title,
            "targetPeople": [p.to_api_dm() for p in self.target_people],
            "visibilityChange": self.visibility_change,
        }

    def to_sql_dm(self) -> Dict[str, Any]:
        return {
            "actor": self.actor.to_dynamo_dm() if self.actor else {},
            "datetime": self.datetime,
            "destination_folder_title": self.destination_folder_title,
            "event_description": self.event_description,
            "event_id": self.event_id,
            "event_name": self.event_name,
            "exposure": self.exposure.name if self.exposure else "none",
            "files": [fil.to_sql_dm() for fil in self.files],
            "ip_address": self.ip_address,
            "membership_change_type": self.membership_change_type,
            "new_value": self.new_value,
            "new_visibility": self.new_visibility,
            "old_value": self.old_value,
            "old_visibility": self.old_visibility,
            "source_folder_title": self.source_folder_title,
            "target_people": [p.to_dynamo_dm() for p in self.target_people],
            "visibility_change": self.visibility_change,
        }

    @classmethod
    def to_app_event_api_sdk_dm(
        cls, config: Config, platform: Platform, attrs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Converts the Authorized App Events Model data to API data model using the Client SDK.

        Arguments:
            project_id  -- Project Id
            platform    -- Platform
            attrs       -- Raw App Id Events data from SQL.

        Results:
            Serialized Application Event Model from Client SDK
        """
        app_event_model = cls.from_sql_dm(config=config, platform=platform, attrs=attrs).to_sql_dm()

        return AuthorizedAppEventsOutputModel(**app_event_model).to_dict(serialize=True)

    @classmethod
    def to_file_event_api_sdk_dm(
        cls, config: Config, platform: Platform, attrs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Converts the File Events Model data to API data model using the Client SDK.

        Arguments:
            project_id  -- Project Id
            platform    -- Platform
            attrs       -- Raw File Id Events data from SQL.

        Results:
            Serialized File Event Model from Client SDK
        """
        file_event_model = cls.from_sql_dm(
            config=config, platform=platform, attrs=attrs
        ).to_sql_dm()

        return FileEventsOutputModel(**file_event_model).to_dict(serialize=True)

    @classmethod
    def to_person_event_api_sdk_dm(
        cls, config: Config, platform: Platform, attrs: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Converts the Person Events Model data to API data model using the Client SDK.

        Arguments:
            project_id  -- Project Id
            platform    -- Platform
            attrs       -- Raw Person Id Events data from SQL.

        Results:
            Serialized Person Event Model from Client SDK
        """
        person_event_model = cls.from_sql_dm(
            config=config, platform=platform, attrs=attrs
        ).to_sql_dm()

        return PersonEventsOutputModel(**person_event_model).to_dict(serialize=True)


def main() -> None:
    raw_event_dict = {
        "event_id": "7567771728085732868",
        "event_name": "download",
        "event_type": "access",
        "event_description": "unknown",
        "file_id": "1t7jWcnCxSbE8FJHl4uzSw87xoa_qb7hW",
        "file_name": "CMakeLists.txt",
        "datetime": 1609288723,
        "ipaddress": "35.155.135.135",
        "membership_change_type": None,
        "old_value": None,
        "new_value": None,
        "source_folder_title": None,
        "destination_folder_title": None,
        "old_visibility": None,
        "new_visibility": "private",
        "visibility_change": None,
        "creator_email": "bobbie@thoughtlabs.io",
        "folder_id": "1bqFCpP4meC3vVnuYL0PQZpIgi5pak8fe",
        "folder_name": "ch3-4",
        "platform_name": "Google Workspace",
        "creator_firstname": "Bobbie",
        "creator_lastname": "Hawaii",
        "actor_email": "bobbie@thoughtlabs.io",
        "actor_firstname": "Bobbie",
        "actor_lastname": "Hawaii",
        "target_email": None,
        "target_firstname": None,
        "target_lastname": None,
        "target_user_domain": None,
    }

    event_info = Event.from_sql_dm(
        config=Config("thoughtlabs"), platform=Platform.GSUITE, attrs=raw_event_dict
    ).to_api_dm()
    print(f"Event: {event_info}")


##########################
if __name__ == "__main__":
    main()
