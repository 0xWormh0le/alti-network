import re
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from tools.catalogs import Platform
from tools.class_tools import cached_property
from tools.config import Config
from tools.dynamo.users_table.users_manager import UsersManager
from tools.logger import Logger
from tools.param_store import ParamStore
from tools.sql.sql_connect import SQLConnect
from tools.sql.stereo import SQLOrStereoConnect

from external_api.models.user import BadUserData
from external_api.utils.constants import (
    DEFAULT_FIRST_NAME,
    DEFAULT_LAST_NAME,
    INVALID_GSUITE_EMAIL_SUFFIX,
)
from external_api.utils.sql_paginator import SQLPaginator


class UserGenerator:
    """
    A class to fetch User related information from Dynamo and SQL and
    generates a dict representing the User information for easy consumption by the User Model class.

    ...

    Attributes
    ----------
    project_id : str
        Project Id of the user
    platform : str
        platform Id of requested user information

    Methods
    -------
    get_user_record(email=""):
        Fetches user record from SQL and/or Dynamo and returns a user attribute dictionary.
    """

    def __init__(
        self,
        config: Config,
        platform: str,
    ) -> None:
        self.configs = config
        self.project_id: str = config.project_name
        self.platform: Platform = Platform(platform)
        self.sql_path: Path = Path(__file__).resolve().parent / "sql"
        self.logger = Logger.for_object(self)

    @cached_property
    def users_manager(self) -> UsersManager:
        return UsersManager(config=self.configs)

    @cached_property
    def param_store(self) -> ParamStore:
        """Provide access to ParamStore."""
        return ParamStore(
            aws_region=self.configs.aws_region, boto3_session=self.configs.boto3_session
        )

    @cached_property
    def sql_connect(self) -> SQLOrStereoConnect:
        """Provides access to SQLConnect."""
        return SQLConnect.from_config(
            config=self.configs,
            boto3_session=self.configs.boto3_session,
            param_store=self.param_store,
        )

    @cached_property
    def query_lookup_by_email(self) -> str:
        """Query to lookup user_email from SQL for Google emails"""
        query = ""
        if self.platform == Platform.GSUITE:
            query = """
            SELECT DISTINCT
                COALESCE(adu.primaryEmail, eid.company_emailAddress) AS primary_email
            FROM
                admin_directory_v1_usersmeta AS adu
                LEFT JOIN email_identification AS eid
                    ON adu.primaryEmail = eid.company_emailAddress
            WHERE (
                adu.primaryEmail = %(person_id)s
                OR eid.company_emailAddress = %(person_id)s
            ) OR (
                eid.personal_emailAddress = %(person_id)s
                AND false_positive = 0
            ) OR adu.emails_primary REGEXP concat('(^|,)', %(person_id_pattern)s, '(,|$)')
            """
        elif self.platform == Platform.O365:
            query = """
            """

        return query

    def get_user_info_from_dynamo(self, primary_email: str, user_email: str) -> Dict[str, Any]:
        """
        Fetch all records from Dynamo that correspond to specific `user_email`
        and unify them into a dict index by user_email since this corresponds to what the
        flavius app is interested in.
        """
        user_record = dict(self.users_manager.search_by_user_email(primary_email) or {})
        if not user_record:
            return {}

        unify_index = user_record["user_email"].index(primary_email)
        unified_user_records: Dict[str, Any] = {
            k: v[unify_index] if v else None for k, v in user_record.items()
        }
        unified_user_records["phones"] = (
            [
                record
                for sub_list in user_record["phones"]
                for record in sub_list
                if isinstance(sub_list, list)
            ]
            if user_record.get("phones")
            else []
        )
        unified_user_records["emails"] = [
            {
                "address": email,
                "kind": "work",
            }
            for email in user_record["user_email"]
            if email != user_email
        ]

        user_emails = (
            [
                record
                for sub_list in user_record["emails"]
                if isinstance(sub_list, list)
                for record in sub_list
                if not record["address"].endswith(INVALID_GSUITE_EMAIL_SUFFIX)
                and record["address"] != user_email
            ]
            if user_record.get("emails")
            else []
        )
        unified_user_records["emails"].extend(user_emails)
        unified_user_records["primary_email_address"] = user_email

        # backward compatible fields to email list
        updated_emails: List[Dict[str, Any]] = []
        for email in unified_user_records["emails"]:
            email.update(self.get_access_and_risk_metrics_for_email(email["address"]))
            updated_emails.append(email)
        unified_user_records["emails"] = updated_emails
        unified_user_records.update(self.get_access_and_risk_metrics_for_email(user_email))

        return unified_user_records

    def get_access_and_risk_metrics_for_email(self, email: str) -> Dict[str, Any]:
        """
        Get access, risk and permissions deleted details for event on a specific platform.

        Note:
        - A of `access_count`, `risk_count`, `last_deleted_permissions` for a provided email address
            from SQL database and fed to the user model schema.

        Arguments:
            email       (str)       -- Email address.

        Returns:
            A dict with email activity metrics.
        """
        with self.sql_connect.open() as sql_connect:
            query_string = sql_connect.get_query_string(
                self.sql_path / self.platform.value / "user_activity_data_query.sql"
            )
            sql_paginator = SQLPaginator(  # type: ignore
                sql_connect=sql_connect,
                query_string=query_string,
                query_params={"person_id": email},
            )
            results = sql_paginator.page_of_results
            return results[0] if results else {}

    def is_internal(self, email: str) -> bool:
        """Verifies email is internal to organization"""
        internal = False
        if email:
            email_domain = email.split("@")[-1]
            return email_domain in self.configs.domains if email else False

        return internal

    @staticmethod
    def compute_email_counts(emails: List[Dict[str, Any]]) -> Tuple[int, int]:
        """
        Calculates the internal and external email count from a list of emails.
        """
        internal_count = sum([1 for em in emails if em["kind"] == "work"])
        external_count = len(emails) - internal_count
        return (internal_count, external_count)

    def get_user_email_for_dynamo_call(self, email: str) -> Optional[str]:
        """
        For GSuite accounts we need fetch the `user_email` from admin directory table
        while for o365 the email address corresponds to the user_id since we have mostly one
        email per record.
        """
        if self.platform == Platform.O365:
            return email

        if self.platform == Platform.GSUITE:
            if self.is_internal(email):
                return email

            with self.sql_connect.open() as sql_connect:
                sql_paginator = SQLPaginator(  # type: ignore
                    sql_connect=sql_connect,
                    query_string=self.query_lookup_by_email,
                    query_params={
                        "person_id": email,
                        "person_id_pattern": re.escape(email),
                    },
                )
            results = sql_paginator.page_of_results
            return results[0]["primary_email"] if results else None

        raise BadUserData("Platform not supported", email)

    def get_user_record(self, email: str) -> Dict[str, Any]:
        """
        `get_user_record` fetches the `user_email` for `gsuite` emails needed for
        the `get_user_email_for_dynamo_call`. Then calls `get_user_info_from_dynamo`
        which fetches all matching user records from dynamo; which is then
        normalized for `User` Model schema by adding fields like:
            `internal_count`, `external_count`, `internal` and `user_kind`.

        Arguments:
            email - email address.

        Response:
            Normalized user dict attributes compatible with User Model schema.
        """
        if not email:
            return {}

        default_user_dict: Dict[str, Any] = {
            "given_name": DEFAULT_FIRST_NAME,
            "family_name": DEFAULT_LAST_NAME,
            "project_id": self.project_id,
            "primary_email_address": email,
            "user_email": email,
        }
        primary_email = self.get_user_email_for_dynamo_call(email) if email else None

        user_dict = dict()
        if email and primary_email:
            user_dict = self.get_user_info_from_dynamo(
                primary_email=primary_email, user_email=email
            )

        if not user_dict:
            self.logger.json(user_dict, name="user-dict-info")
            user_dict = default_user_dict

        # compute internal and internal email counts;
        # add +1 to count for primary email address
        email_count = (
            self.compute_email_counts(user_dict["emails"])
            if user_dict.get("emails")
            else tuple([0, 0])
        )

        # TODO: Remove `internal` after https://altitudenetworks.atlassian.net/browse/ENG-626
        user_dict["internal"] = self.is_internal(user_dict["primary_email_address"])
        user_dict["user_kind"] = "user" if user_dict["internal"] else "person"
        user_dict["usage_kind"] = "work" if user_dict["internal"] else "personal"
        user_dict["internal_count"] = (
            email_count[0] + 1 if user_dict["internal"] else email_count[0]
        )
        user_dict["external_count"] = (
            email_count[1] + 1 if not user_dict["internal"] else email_count[1]
        )

        return user_dict


def main() -> None:
    email = "nyah@thoughtlabs.io"
    config = Config("thoughtlabs")
    user_records = UserGenerator(config, "o365").get_user_record(email)
    print(f"Info: {user_records}")


##########################
if __name__ == "__main__":
    main()
