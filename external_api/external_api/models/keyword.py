from dataclasses import dataclass
from typing import Any, Dict, Type, TypeVar

_Keyword = TypeVar("_Keyword", bound="Keyword")


@dataclass
class Keyword:
    count: int
    keyword: str

    @classmethod
    def from_sql_dm(cls: Type[_Keyword], attrs: Dict[str, Any]) -> _Keyword:
        return cls(int(attrs.get("count") or 0), attrs.get("keyword", ""))

    def to_api_dm(self) -> Dict[str, Any]:
        return {"count": self.count, "keyword": self.keyword}
