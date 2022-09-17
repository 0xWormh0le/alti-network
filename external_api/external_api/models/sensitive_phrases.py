from dataclasses import dataclass
from typing import Any, Dict, List, Type, TypeVar

from tools import json_tools

from external_api.models.keyword import Keyword
from external_api.utils.constants import MAX_SENSITIVE_PHRASES

_SingleFileSensitivePhrases = TypeVar(
    "_SingleFileSensitivePhrases", bound="SingleFileSensitivePhrases"
)
_MultiFileSensitivePhrases = TypeVar(
    "_MultiFileSensitivePhrases", bound="MultiFileSensitivePhrases"
)


@dataclass
class SingleFileSensitivePhrases:
    cc_num: int
    ssn: int
    sensitive_keywords: List[Keyword]

    @classmethod
    def from_sql_dm(
        cls: Type[_SingleFileSensitivePhrases], attrs: Dict[str, Any]
    ) -> _SingleFileSensitivePhrases:
        raw_keywords = []
        if attrs.get("kw_count_data") and isinstance(attrs.get("kw_count_data"), str):
            raw_keywords = json_tools.loads(attrs.get("kw_count_data", []))

        keywords = [Keyword.from_sql_dm(kw) for kw in raw_keywords]
        # capping the number of keywords to 1000
        # to avoid overly-large response payloads
        return cls(
            int(attrs.get("ccn_count") or 0),
            int(attrs.get("tin_count") or 0),
            keywords[:MAX_SENSITIVE_PHRASES],
        )

    def to_api_dm(self) -> Dict[str, Any]:
        keywords = [kw.to_api_dm() for kw in self.sensitive_keywords]
        return {
            "ccNum": self.cc_num,
            "ssn": self.ssn,
            "sensitiveKeywords": sorted(keywords, key=lambda i: i["count"], reverse=True),
        }

    def to_sql_dm(self) -> Dict[str, Any]:
        keywords = [kw.to_api_dm() for kw in self.sensitive_keywords]
        return {
            "cc_num": self.cc_num,
            "ssn": self.ssn,
            "sensitive_keywords": sorted(keywords, key=lambda i: i["count"], reverse=True),
        }


@dataclass
class MultiFileSensitivePhrases:
    cc_num_file_count: int
    ssn_file_count: int
    sensitive_keywords_file_count: int

    @classmethod
    def from_sql_dm(
        cls: Type[_MultiFileSensitivePhrases], attrs: List[Dict[str, Any]]
    ) -> _MultiFileSensitivePhrases:
        raw_keywords = list(
            map(
                lambda cnt: len(json_tools.loads(cnt["kw_count_data"])),
                filter(
                    lambda res: isinstance(res.get("kw_count_data"), str)
                    and res.get("kw_count_data"),
                    attrs,
                ),
            )
        )

        # capping the number of keywords to 1000
        # to avoid overly-large response payloads
        return cls(
            sum([1 if int(res.get("ccn_count") or 0) > 0 else 0 for res in attrs]),
            sum([1 if int(res.get("tin_count") or 0) > 0 else 0 for res in attrs]),
            sum([1 for value in raw_keywords if value > 0]),
        )

    def to_api_dm(self) -> Dict[str, Any]:
        return {
            "ccNumFileCount": self.cc_num_file_count,
            "ssnFileCount": self.ssn_file_count,
            "sensitiveKeywordsFileCount": self.sensitive_keywords_file_count,
        }

    def to_sql_dm(self) -> Dict[str, Any]:
        return {
            "cc_num_file_count": self.cc_num_file_count,
            "ssn_file_count": self.ssn_file_count,
            "sensitive_keywords_file_count": self.sensitive_keywords_file_count,
        }
