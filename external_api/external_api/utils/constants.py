from enum import Enum

DEFAULT_CACHE_TTL_SEC = 3600
INGESTION_QUEUE = "files-details-etl"
UPDATE_EMAIL_QUEUE = "update-email-address"
RISK_STATUS_QUEUE = "update-risk-status"
DELETE_ORCH_QUEUE = "delete-permissions-orch"
DELETE_PERM_QUEUE = "delete-permission-id"

EMAIL_REMOVE_STATUS = "REMOVED"
EMAIL_PENDING_STATUS = "PENDING"
EMAIL_ACTIVE_STATUS = "ACTIVE"

RISK_REMOVE_STATUS = "REMOVED"
RISK_PENDING_STATUS = "PENDING"
RISK_ACTIVE_STATUS = "ACTIVE"

RISK_ERROR_STATUS = "CANNOT_BE_REMOVED"
RISK_TARGET_TYPES = [3010]
RISK_CREATOR_TYPES = [2010, 2011, 3100, 3200, 3300]

SQL_SENTINEL = "NOT_SET"

# Reference: https://developers.google.com/drive/api/v3/about-files#ownership
DEFAULT_ROOT_FOLDER = "PERSONAL DRIVE"

MAX_PERMISSION_SIZE = 1000
MAX_SENSITIVE_PHRASES = 1000
MAX_PAGE_SIZE = 2000
PERMISSION_REMOVE_SCOPE = "https://www.googleapis.com/auth/drive"

SQL_SLOW_THRESHOLD_LOW = 0.5
SQL_SLOW_THRESHOLD_MED = 1.0
SQL_SLOW_THRESHOLD_HIGH = 3.0

SUMMARY_EMAIL_ADMIN_ADDRESS = "michael@altitudenetworks.com"
SUMMARY_EMAIL_FROM_ADDRESS = "alerts@notifications.altitudenetworks.com"
SUMMARY_EMAIL_ALTITUDE_DOMAIN = "https://altitudenetworks.com"
SUMMARY_EMAIL_BLOG_DOMAIN = f"{SUMMARY_EMAIL_ALTITUDE_DOMAIN}/resources"
SUMMARY_EMAIL_REPLY_ADDRESS = "support@altitudenetworks.com"
SUMMARY_EMAIL_WORKSPACES = ["Google Workspace", "Microsoft Office 365", "Dropbox"]


# fmt: off
# Event taxonomy per <https://developers.google.com/admin-sdk/reports/v1/appendix/activity/drive>:
EVENT_TYPES_WITH_EVENT_NAMES = {
    "access": [
        "add_lock", "add_to_folder", "approval_canceled", "approval_comment_added",
        "approval_requested", "approval_reviewer_responded", "copy", "create", "delete", "download",
        "edit", "move", "preview", "print", "remove_from_folder", "remove_lock", "rename",
        "sheets_import_range", "trash", "untrash", "upload", "view",
    ],
    "acl_change": [
        "change_acl_editors", "change_document_access_scope", "change_document_visibility",
        "change_user_access",
        "shared_drive_membership_change", "shared_drive_settings_change",
        "sheets_import_range_access_change",
        "team_drive_membership_change", "team_drive_settings_change",
    ],
}
# fmt: on

# Reverse of the above mapping:
EVENT_TYPE_BY_EVENT_NAME = {
    event_name: event_type
    for event_type, event_names in EVENT_TYPES_WITH_EVENT_NAMES.items()
    for event_name in event_names
}

# ANONYMOUS user info
DEFAULT_FIRST_NAME = "Anonymous"
DEFAULT_LAST_NAME = "User"
INVALID_GSUITE_EMAIL_SUFFIX = ".test-google-a.com"

###################################################
# USER ROLE MAP
# maps access level from SQL to User Model schema
# GSUITE: shorturl.at/cdoFL
# O365:
DEFAULT_USER_ROLE = "member"
USER_ROLE_MAP = {
    "commenter": "member",
    "fileOrganizer": "manager",
    "organizer": "manager",
    "own": "owner",
    "owner": "owner",
    "admin": "admin",
    "read": "member",
    "reader": "member",
    "write": "manager",
    "writer": "manager",
}


# GOOGLE TABLE NAMES
class GoogleTableNames(Enum):
    ADMIN_USERSMETA = "admin_directory_v1_usersmeta"
    ADMIN_TOKENS = "admin_directory_v1_tokens"
    ADMIN_REPORTS = "admin_reports_v1_drive"
    FILESMETA = "drive_v3_filesmeta"
    EMAIL_IDENTIFICATION = "email_identification"
    CONTENT_INSPECTION = "files_content_inspection"
    PLATFORM = "platform"
    RISKS_FILES = "risks_files"
    RISK_REPORTS = "risk_reports"
    TOP_RISKS = "top_risks"


# O365 TABLE NAMES
class MicrosoftTableNames(Enum):
    MS_APPLICATIONS = "ms_applications"
    MS_SHAREPOINT = "ms_audit_sharepoint"
    MS_AZURE_AD = "ms_audit_azure_ad"
    MS_DRIVES_DOCS = "ms_drives_docs"
    MS_DRIVES_PERMISSIONS = "ms_drives_docs_permissions"
    MS_GROUPS = "ms_groups"
    MS_SITES = "ms_sites_drives"
    MS_USERS = "ms_users"
