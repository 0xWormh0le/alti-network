from abc import ABC, abstractmethod
from typing import Any, Dict, TypeVar

_R = TypeVar("_R")


class ModelBase(ABC):
    @classmethod
    @abstractmethod
    def from_dynamo_dm(cls: _R, attrs: Dict[str, Any]) -> _R:
        ...

    @abstractmethod
    def to_dynamo_dm(self) -> Dict[str, Any]:
        ...

    @classmethod
    @abstractmethod
    def from_sql_dm(cls: _R, attrs: Dict[str, Any]) -> _R:
        ...

    @abstractmethod
    def to_sql_dm(self) -> Dict[str, Any]:
        ...

    @abstractmethod
    def to_api_dm(self) -> Dict[str, Any]:
        ...
