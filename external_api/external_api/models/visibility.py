from enum import Enum, auto, unique
from functools import total_ordering
from typing import Any, Dict, List, Type, TypeVar

from tools.config import Config

_Visibility = TypeVar("_Visibility", bound="Visibility")


@unique
@total_ordering
class Visibility(Enum):
    unknown = auto()
    user = auto()
    group = auto()
    internal = auto()
    internal_discoverable = auto()
    external = auto()
    external_discoverable = auto()

    def __ge__(self, other: Enum) -> bool:
        if self.__class__ is other.__class__:
            return self.value >= other.value  # pylint: disable=W0143
        return NotImplemented

    def __gt__(self, other: Enum) -> bool:
        if self.__class__ is other.__class__:
            return self.value > other.value  # pylint: disable=W0143
        return NotImplemented

    def __le__(self, other: Enum) -> bool:
        if self.__class__ is other.__class__:
            return self.value <= other.value  # pylint: disable=W0143
        return NotImplemented

    def __lt__(self, other: Enum) -> bool:
        if self.__class__ is other.__class__:
            return self.value < other.value  # pylint: disable=W0143
        return NotImplemented

    @classmethod
    def get_most_severe_visibility(cls: Type[_Visibility], visibilities: List[str]) -> _Visibility:
        """
        Rank a list of visibilities returning the most severe/risky of them all.

        Note:
        - A List of visibilities comes from a File SQL or Dynamo response data based on
            events that occurred on a file by users or apps.
        - This list is processed providing the most severe of them all.

        Arguments:
            visibilities (List[str]) - List of Visibility strings

        Returns:
            Most severe Visibility
        """
        visibilities = [v if v != "none" else "unknown" for v in visibilities]
        visibilities.sort(key=lambda x: Visibility[x], reverse=True)
        return cls[visibilities[0]]

    @classmethod
    def get_visibility_from_event_attrs(
        cls: Type[_Visibility], configs: Config, attrs: Dict[str, Any]
    ) -> _Visibility:
        """
        Generate Visibility from Event attributes.

        Note:
        - A dictionary of event attributes from a file, person or app is fetched
            from SQL and this is processed to determine the file exposure.

        Arguments:
            configs (Config)        - Config object
            attrs (Dict[str, Any])  - A dictionary of attributes for a event on a file.

        Returns:
            Visibility exposure.
        """
        event_types = ["access", "acl_change", "sharepointfileoperation", "sharepoint"]
        event_type = attrs["event_type"].lower() if attrs.get("event_type") else None
        target_user_domain = (
            attrs["target_user_domain"].lower() if attrs.get("target_user_domain") else None
        )

        visibility = "unknown"
        if event_type in event_types:
            visibility = "external"
            if target_user_domain in configs.domains:
                visibility = "internal"

        return cls.get_most_severe_visibility([visibility])
