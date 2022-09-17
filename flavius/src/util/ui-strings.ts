import startCase from 'lodash/startCase'
import toLower from 'lodash/toLower'
import { FileActivityType } from 'types/common'

export const COMMON = {
  ARE_YOU_SURE_TO_REMOVE: (permissionCount: string, grantee: any, fileCount: string) =>
    `Are you sure you want to delete ${permissionCount}, removing ${grantee} from up to ${fileCount}?`,
  RESOLVE_RISK_TITLE_BASE: 'Files Accessible by',
  LOG_IN: 'Log in'
}

export const UI_STRINGS = {
  PAGING: {
    DISPLAYING: 'Displaying',
    ITEMS_PER_PAGE: 'Items Per Page',
    PAGE_SIZE: 'Page Size',
    DISPLAY_ITEMS_PER_PAGE: (items: number) => `Displaying ${items} Items Per Page`
  },
  HEADER_BAR: {
    HELP: 'Help',
    SUPPORT: 'Support',
    SUPPORT_DIALOG_TITLE: 'Submit support request',
    ABOUT: 'About',
    HOME: 'Home',
    LOGGED_IN_AS: (name: string) => `Logged in as: ${name}`
  },
  HELP: {
    TITLE: 'Have a Question?',
    SHARING_RISKS: 'What are the different types of sharing risks?',
    RELATIONSHIP_RISKS: 'What are the different types of relationship risks?',
    ACTIVITY_RISKS: 'What are the different types of activity risks?',
    INFORMATIONAL_RISKS: 'What are the different types of informational risks?'
  },
  SIDEBAR: {
    MAIN_MENU: 'Main menu',
    SUPPORT: 'Support',
    PAGE_NOT_ACTIVATED: 'This page has not yet been activated',
    CONFIRM: 'Confirm'
  },
  BUTTON_LABELS: {
    ALL: 'All',
    APPLY: 'Apply',
    ADD: 'Add',
    ADD_A_NEW_ACCOUNT: 'Add a new account',
    CANCEL: 'Cancel',
    CONFIRM: 'Confirm',
    CORRECT: 'Correct',
    YES: 'Yes',
    NO: 'No',
    DELETE: 'Delete',
    EXPORT: 'Export',
    EXPORT_ALL: 'Export All',
    FETCH_RECORDS: 'Fetch Records',
    GO: 'GO',
    NEXT: 'Next',
    OK: 'OK',
    REMOVE: 'Remove',
    REMOVE_ACCESS: 'REMOVE ALL FILE ACCESS',
    EDIT_RISK_TYPE_NOTIFICATION_SETTING: 'Edit Risk Type Notification Setting',
    RESET_FILTERS: 'Reset Filters',
    START: 'Start',
    VERIFY: 'Verify',
    RESET: 'Reset'
  },
  SENSITIVE_PHRASES: {
    YES_REMOVE: 'YES, REMOVE',
    YES_DELETE: 'YES, DELETE',
    NO_DELETE: 'NO, CANCEL',
    CONFIRM_NEW_PHRASE: 'Confirm New Phrase',
    CONFIRM_DELETION: 'Confirm Deletion',
    SENSITIVE_PHRASES_UPDATED: 'Sensitive Phrases Updated',
    HAS_BEEN_ADDED: 'has been added',
    HAS_BEEN_DELETED: 'has been deleted',
    ERROR: 'Error',
    WE_ENCOUNTERED: 'We encountered an error',
    THIS_PHRASE: 'this phrase',
    PLEASE_TRY_AGAIN: 'Please try again',
    PHRASE_ALREADY_ADDED: 'This phrase has already been added',
    ENTER_DIFFERENT_PHRASE: 'Please enter a different phrase',
    MAXIMUM_OF_20: 'A maximum of 20 sensitive phrases may be added',
    REMOVE_EXISTING_PHRASE: 'Remove an existing phrase to add more',
    MANAGE_SENSITIVE_PHRASES_IN_FILENAMES: 'Manage Sensitive Phrases in Filenames',
    YUP: 'Please enter a phrase'
  },
  APPSPOTLIGHT: {
    VIEW_IN_GSUITE: 'View in G Suite Marketplace',
    NOT_AVAILABLE_ON: 'Not Available on',
    GSUITE_MARKET: 'G Suite Marketplace',
    AUTHORIZED_BY: 'Authorized By',
    OF_USERS: 'of Users',
    INDIVIDUAL_EMPLOYEES: 'individual employees',
    INDIVIDUALS_AUTHORIZED: 'Individuals who have authorized this App',
    USER_UNIT: 'user',
    FILE_DOWNLOADS: 'File Downloads',
    DOWNLOADS: 'Downloads',
    ARE_SENSITIVE_FILES: 'are sensitive files',
    FILE_DOWNLOADS_BY_APP: 'File downloads made by this App',
    DOWNLOAD_UNIT: 'download',
    ASSOCIATED_RISKS: 'Associated Risks',
    RISKS: 'Risks',
    SEVERITY: 'Severity',
    RISKS_ASSOCIATED_BY_APP: 'Risk associated with this App',
    RISK_UNIT: 'risk',
    RISK_STTINGS: 'Risk Setting',
    THIS_APP_GRANTED_TO: 'This app has been granted access to:',
    UNABLE_TO_DETERMINE: 'Unable to determine the services this app has been granted access to',
    OF_TOTAL_USERS: (total: any) => `of ${total} total users`,
    TOTAL_SENSITIVE_FILES: (total: any) => `${total} sensitive files`,
    UNKNOWN: 'Unknown'
  },
  DASHBOARD: {
    TITLE: 'Dashboard',
    OWNER: 'Owner',
    UNKNOWN: 'Unknown',
    CREATOR_OF_MOST_RISKS: 'Creator of Most Risks',
    RISKS_CREATED: 'risks created',
    FILE_WITH_MOST_RISKS: 'File with Most Risks',
    RISKS_ASSOCIATED: 'risks associated',
    OWNER_OF_MOST_AT_RISK_FILES: 'Owner of Most At-Risk Files',
    AT_RISK_FILES_OWNED: 'at-risk files owned',
    EXTERNAL_ACCOUNT_WITH_MOST_FILES: 'External Account with Most File Access',
    FILES_ACCESSIBLE_BY_EXTERNAL: 'files accessible by external account',
    SHARING_RISKS: 'Sharing Risks',
    RELATIONSHIP_RISKS: 'Relationship Risks',
    ACTIVITY_RISKS: 'Activity Risks',
    INFORMATIONAL_RISKS: 'Informational Risks',
    SEE_ALL: 'See all',
    RISK_SEVERITY: 'Risk severity',
    RISK_SUMMARY: 'Risk Summary',
    RISK_INSIGHTS: 'Risk Insights',
    FILE_SHARING: "Company's File Sharing Stats",
    RISK_TYPE: 'Risk type',
    RISK_COUNT: 'Risk count',
    NO_RISK_TYPES_FOUND_FOR_CATEGORY: 'No risk types found for this category.',
    SHOW_ALL_BY: (label: string) => `Show All ${label}`
  },
  DASHBOARD_GRAPH: {
    USER_ACCOUNTS: 'User Accounts',
    EXTERNAL_APPS_ACCESSING_FILES: 'External apps accessing files',
    COMPANY_FILES: 'Company Files',
    EXTERNAL_USERS_ACCESSING_FILES: 'External users accessing files',
    EXTERNAL_USERS_WITH_POTENTIAL_FILE_ACCESS: 'External users with potential file access',
    FILES_SHARED_BY_LINK_INTERNALLY: 'Files shared by link internally',
    FILES_SHARED_BY_LINK_EXTERNALLY: 'Files shared by link externally to anyone',
    FILES_SHARED_TO_PERSONAL_ACCOUNT: 'Files shared to personal account',
    SENSITIVE_FILES_AT_RISK_INTERNALLY: 'Sensitive files at risk internally',
    SENSITIVE_FILES_AT_RISK_EXTERNALLY: 'Sensitive files at risk externally',
    SENSITIVE_FILES_SHARED_TO_PERSONAL_ACCOUNT: 'Sensitive files shared to personal account'
  },
  EDIT_PERMISSIONS: {
    FILE_PERMISSIONS: 'File Permissions',
    EDIT_FILE_PERMISSIONS: 'Edit File Permissions',
    REMOVING_PERMISSION: 'Removing Permission',
    OWNED_BY: 'Owned by',
    CREATED_ON: 'Created on',
    LAST_MODIFIED: 'Last modified',
    ERROR_ENCOUNTERED_TRY_AGAIN: 'We encountered an error. Please try again.',

    PERMISSIONS_CANNOT_BE_REMOVED_DIRECT_REMOVE: (platformId: string = 'gsuite') =>
      `Permissions for files owned by a shared drive cannot be removed here, go to the ${
        platformId === 'gsuite' ? `Google Drive` : `Microsoft 365`
      } directly to resolve`,
    PERMISSIONS_FOR_EXTERNALLY_OWNED_CANT_BE_REMOVED: (platformId: string = 'gsuite') =>
      `Permissions for externally owned files cannot be removed here, go to the  ${
        platformId === 'gsuite' ? `Google Drive` : `Microsoft 365`
      } directly to resolve`,
    OWNER_CANT_BE_REMOVED: 'The owner of a file cannot be removed from accessing it',
    SHARED_BY_LINK_EX_DISCOVER_BY_ANYONE: 'Shared by Link Externally and Discoverable by Anyone',
    SHARED_BY_LINK_IN_DISCOVER_BY_ANYONE: 'Shared by Link Internally and Discoverable by Anyone',
    DISCOVERABLE_BY_ANYONE: 'Discoverable by Anyone',
    SHARED_BY_LINK_EXTERNALLY: 'Shared by Link Externally',
    SHARED_BY_LINK_INTERNALLY: 'Shared by Link Internally',
    ANYONE_WITH_THE_LINK_CAN: (role: string) => `Anyone with the Link can ${role}`,
    ANYONE_CAN: (role: string) => `Anyone can ${role}`,
    SHARED_BY_LINK_EX_DISCOVER_BY_ANYONE_AT_COMPANY:
      'Shared by Link Externally and Discoverable by Anyone at the Company',
    SHARED_BY_LINK_IN_DISCOVER_BY_ANYONE_AT_COMPANY:
      'Shared by Link Internally and Discoverable by Anyone at the Company',
    DISCOVERABLE_BY_ANYONE_AT_COMPANY: 'Discoverable by Anyone at the Company',
    ANYONE_AT_COMPANY_WITH_THE_LINK_CAN: (role: string) => `Anyone at the Company with the Link can ${role}`,
    ANYONE_AT_COMPANY_CAN: (role: string) => `Anyone at the Company with the Link can ${role}`,
    EMAIL_IS_THE_OWNER: (email: string) => `${email} is the owner`,
    EMAIL_CAN_READ: (email: string) => `${email} can Read`,
    EMAIL_CAN_WRITE: (email: string) => `${email} can Write`,
    ANYONE_CAN_READ: 'Anyone can Read',
    ANYONE_CAN_WRITE: 'Anyone can Write',
    YOUR_ORG_HASNT_ENABLED_THIS_FEATURE:
      'Your organization has not enabled this feature. Contact us for more information.',
    ANYONE_WITH_THE_LINK: 'anyone with the link',
    CONFIRM_EDIT: 'Confirm Edit',
    SUCCESS: 'Success',
    ERROR: 'Error',
    ARE_YOU_SURE_TO_REMOVE_THIS_PERMISSION: 'Are you sure you want to remove this permission?',
    FILENAME_CAN_NOLONGER_BE_ACCESSED_BY: (fileName: string, removeMessage: string) =>
      `The file ${fileName} can no longer be accessed by ${removeMessage}.`,
    TOOLTIP_OFFICE_365_SUPPORT: 'Office 365 support will be coming soon',
    REMOVAL_IN_PROGRESS: 'Removal in progress',
    CANNOT_BE_REMOVED: 'Permission can not be removed',
    PERMISSIONS_TOTAL: 'permissions in total',
    REMOVE_ALL_FILE_ACCESS: 'Remove All File Access',
    SHARED_DRIVE: 'Shared Drive'
  },
  FILES: {
    THIS_FILE_IS_OWNED_BY_EXTERNAL_ACC: (email: string) => `This file is owned by the external account ${email}.`,
    SEE_OTHER_ACTIVITY: 'See other activity for this file',
    DETAILS: 'more details',
    ACTION_TIMELINE_NOTAVAILABLE_OUTSIDE:
      'Action Timeline not available for Files owned by accounts outside your company.'
  },
  FILE: {
    UNKNOWN: 'unknown',
    GSUITE_VIEW_ORIGINAL_FILE_IN_DRIVE: 'View Original File in Drive',
    GSUITE_VIEW_ORIGINAL_FOLDER_IN_DRIVE: 'View Original Folder in Drive',
    GSUITE_VIEW_UKNOWN: 'View Original Content in Drive',
    O365_VIEW_ORIGINAL_FILE_IN_DRIVE: 'View Original File in Microsoft 365',
    O365_VIEW_ORIGINAL_FOLDER_IN_DRIVE: 'View Original Folder in Microsoft 365',
    O365_VIEW_UNKNOWN: 'View Original Content in Microsoft 365',
    BOX_VIEW_ORIGINAL_FILE_IN_DRIVE: 'View Original File in Box',
    BOX_VIEW_ORIGINAL_FOLDER_IN_DRIVE: 'View Original Folder in Box',
    BOX_VIEW_UNKNOWN: 'View Original Content in Box',
    FILE_SHARING: 'File sharing',
    FILE_SHARING_STATUS: (internal: number, external: number) => `${internal} Internal, ${external} External`,
    LINK_SHARING: 'Link sharing',
    CREATED: 'Created',
    MODIFIED: 'Modified',
    LAST_MODIFIED: 'Last Modified',
    ANALYZED: 'Analyzed',
    ANALYZE_FILE: 'Analyze File',
    FILE_ACTION_TIMELINE: 'File Action Timeline',
    FILE_SENSITIVE_CONTENTS: 'Sensitive Content',
    INTERNAL_COLLABORATORS: 'Internal Collaborators',
    EXTERNAL_COLLABORATORS: 'External Collaborators',
    FILES_IN_FOLDER: 'Folder Contents',
    ALL_FOLDER_CONTENTS: 'All Folder Contents',
    FOLDER: 'Folder',
    NAME: 'Name',
    PERSON: 'Person',
    PRIMARY_EMAIL: 'Primary Email',
    FILES_AT_RISK: 'Files At Risk',
    FILE_OWNER: 'File Owner',
    FILE_CREATOR: 'File Creator',
    DETECTED_ON: 'Detected On',
    FILE_NAME: 'File Name',
    PHRASE: 'phrase',
    EXACT_MATCH: 'exact match',
    RESULTS: 'results',
    PATTERNS: 'patterns',
    FILE_DETAILS: 'File Details',
    EXTERNAL_OR_UNKNOWN: 'External or Unknown',
    PARENT_FOLDER: 'Parent Folder',
    PLATFORM: 'Platform',
    FILE_ID: 'File ID',
    DESCRIPTION: 'Description',
    SIZE: 'Size',
    VERSION: 'Version',
    PATH_COLLECTION: 'Path Collection'
  },
  VISIBILITY: {
    NONE: 'No Link Sharing',
    INTERNAL: 'Internal Link Sharing',
    INTERNAL_TOOLTIP: 'This file can be viewed by anyone inside the company who has the URL for the file.',
    INTERNAL_DISCOVERABLE: 'Internal & Discoverable',
    EXTERNAL: 'External',
    EXTERNAL_LINK_SHARING: 'External Link Sharing',
    EXTERNAL_TOOLTIP: 'This file can be viewed by anyone, inside or outside the company, who has the URL for the file.',
    EXTERNAL_DISCOVERABLE: 'External & Discoverable',
    UNKNOWN: 'Unknown',
    SENSITIVE_CONTENT: 'Sensitive Content'
  },
  PEOPLE: {
    PEOPLE_ASSOCIATED_WITH_RISK: 'People associated with this risk'
  },
  SEARCH: {
    TITLE: 'Search',
    SEARCH_BY: 'Search for internal people, emails and files...',
    SEARCH_BY_LABEL:
      'Search for internal employees by name or email, external people by email, or files by exact file id.',
    NO_MATCHES_FOUND:
      'No internal employees found. Enter a complete email address to find an external employee, or an exact file id to find a file.',
    SELECT_SEARCH_TYPE: 'Select search type',
    SELECT_PLATFORM: 'Select a platform',
    ENTER_FILE_ID: 'Enter the file ID',
    SEARCH_BY_EMAIL: 'Search by email',
    SEARCH_EMAIL_PLACEHOLDER: 'Type email',
    SEARCH_BY_FILE: 'Search for file by ID',
    SEARCH_BY_FILE_LABEL: 'Enter the exact platform specific folder or file ID',
    SEARCH_FILE_PLACEHOLDER: 'Type file ID',
    SEARCH_BY_NAME: "Search by the person's name",
    SEARCH_NAME_PLACEHOLDER: 'Type name',
    ENTER_PERSONS_NAME: "Enter the person's name",
    ENTER_EMAIL_ADDRESS: 'Enter email address',
    SEARCHING_FOR_FILE: 'Searching for file...',
    FILE_NOT_LOCATED: 'File could not be located'
  },
  RESOLVE_RISK: {
    PERMISSIONS_EXTERNALLY_OWNED_CANT_BE_REMOVED_HERE: (platformId: string = 'gsuite') =>
      `Permissions for externally owned files cannot be removed here, go to the ${
        platformId === 'gsuite' ? `Google Drive` : `Microsoft 365`
      } directly to resolve`,
    PERMISSIONS_SHARED_CANT_BE_REMOVED_HERE: (platformId: string = 'gsuite') =>
      `Permissions for files owned by a shared drive cannot be removed here, go to the ${
        platformId === 'gsuite' ? `Google Drive` : `Microsoft 365`
      } directly to resolve`,
    NONE_CAN_BE_REMOVED:
      'None of the existing permissions can be removed by our system. Please inspect the files associated with this risk individually.',
    ARE_YOU_SURE_TO_REMOVE: COMMON.ARE_YOU_SURE_TO_REMOVE,
    PERMISSIONS_GRANTING_OR_SHARED_CAN_BE_REMOVED:
      'Permissions granting access to files owned by an external account or shared drive can only be removed from the application.',
    REQUESTING_FILE_ACCESS_REMOVAL: 'Requesting File Access Removal',
    REMOVAL_ACCESS_TO_IN_PROGRESS: (name: string, permissionCount: string, perissionPluralized: string) =>
      `Removal of ${name}'s access to ${permissionCount} ${perissionPluralized} in progress.`,
    REMOVAL_SHARING_IN_PROGRESS: (internal = false) =>
      `Removal of ${internal ? 'internal' : 'external'} link sharing in progress.`,
    RESOLVE_RISK_TITLE: 'This Risk was the result of',
    RESOLVE_RISK_TITLE_FILES_ACCESSIBLE: (fileCount: number) => `having permission to access ${fileCount} files.`,
    RESOLVE_RISK_TITLE_FILES_SHARED_BY_LINK: (fileCount: number, internal = false) =>
      `${fileCount} files being shared by link ${internal ? 'internally' : 'externally'}.`,
    RESOLVE_RISK_TITLE_APP: `${COMMON.RESOLVE_RISK_TITLE_BASE} App`,
    RESOLVE_RISK_TITLE_EXTERNAL: `${COMMON.RESOLVE_RISK_TITLE_BASE} External Account`,
    RESOLVE_RISK_TITLE_LINK: `${COMMON.RESOLVE_RISK_TITLE_BASE} Link`
  },
  DROPDOWN: {
    RESOLVE: 'Resolve',
    ACTIONS: 'Actions'
  },
  RISK_SETTINGS: {
    SENSITIVE_FILE_CLASSIFICATION: {
      TITLE: 'How do we classify Sensitive Files in Altitude Networks',
      AUTOMATICALLY_CLASSIFIES:
        'The Altitude Networks Risk Engine automatically classifies and surfaces sensitive content based on analysis of file names and file contents.',
      THE_CLASSIFIER_ENGINE:
        'The classifier engine can be enhanced with specific sensitive phrases that are unique to your organization.'
    },
    DOWNLOADS_RISK_THRESHOLD_APPLIED: {
      TITLE: 'What are these download thresholds and how are they applied?',
      DOWNLOAD_THRESHOLD:
        'The download thresholds specify the number of downloads in a 24 hour period by a user or an app that would trigger a risk. The threshold can be set separately for internal and external users and apps.',
      INTERNAL_DOWNLAOD:
        'Internal download thresholds apply to employees and users within the internal domains, and sanctioned internal apps.',
      EXTERNAL_DOWNLOAD: 'External download thresholds apply to all external users and apps.'
    },
    RISK_TYPE_SETTINGS: {
      TITLE: 'What are these risk type settings?',
      DESCRIPTION:
        "Risk type settings allows for enabling only the risk types you are interested in. If you disable a risk type, the system will avoid risk calculations for that type. While risks won't be generated the activity is still recorded and viewable on an individual person’s page. ",
      MORE_DETAIL: 'For more details about the risk categories and types, see the Help section.'
    },
    WHAT_ARE_WHITELIST_HOW_APPLIED: {
      TITLE: 'What are whitelists and how are whitelists applied to domains and apps?',
      INTRODUCTION:
        "You can add specific domains or app IDs as whitelists. A whitelist is considered as an exclusion and any activity originating from that domain or app is ignored. A domain or app added to the whitelist is excluded from all risk calculations, so consider carefully before adding to this list. While risks won't be generated the activity is still recorded and viewable on an individual person’s page.",
      EXAMPLE:
        'For example, if a file is owned by an external user whose domain is in the whitelist, a risk will not be triggered in this case. If a file is shared to a personal account and the domain of the personal account is in the whitelist, no risk will be triggered. And if we detect file downloads that exceed the specified threshold, no risk will be reported if the domain or the app that the downloads originated from is in the whitelist.'
    },
    WHAT_ARE_INTERNAL_DOMAINS_HOW_DIFFERENT: {
      TITLE: 'What are internal domains and how are they different from whitelists?',
      INTRODUCTION:
        'Domains listed as part of the internal domains list are treated as internal company related addresses. Any activity originating from these internal domains are treated as internal company activity and applied to the internal risk calculations. They are different from whitelists in that domains in whitelists don’t trigger any risk, while ones in the internal domains list can still trigger internal risks that can be monitored and remediated.'
    },
    WHITELIST_DIALOG_TITLE: {
      ADD_CONFIRM: (type: string) => `Confirm New ${startCase(type)}`,
      DELETE_CONFIRM: (type: string) => `Confirm Delete ${startCase(type)}`,
      ADD_PENDING: (type: string) => `Adding New ${startCase(type)}`,
      DELETE_PENDING: (type: string) => `Deleting ${startCase(type)}`,
      ADD_SUCCESS: (type: string) => `${startCase(toLower(type))} Added`,
      DELETE_SUCCESS: (type: string) => `${startCase(toLower(type))} Deleted`
    },
    WHITELIST_DIALOG_MESSAGE: {
      ADD_PENDING: (type: string, list: string) => `Adding new ${toLower(type)} to the ${list}`,
      DELETE_PENDING: (type: string, list: string) => `Deleting ${toLower(type)} from the ${list}`,
      ADD_SUCCESS: (type: string, list: string) => `${type} added successfully to the ${list}`,
      DELETE_SUCCESS: (type: string, list: string) => `${type} deleted successfully from the ${list}`,
      UPDATE_CONFIRM: (type: string, action: string) =>
        `Are you sure you want to continue?${
          type === 'App' && action === 'addConfirm' ? ' Please verify that you have the right App ID.' : ''
        }`
    },
    RIKS_TYPE_NO_ENABLED: 'You have currently not enabled any risk types.',
    RISK_TYPE_EDIT: "Select the risk types you'd like to enable",
    RISK_TYPE_STATE: 'The following risk types are currently enabled',
    HELPER_TEXT_NOTMATCH:
      'For example, "int" would match the filename "Number or int" but would NOT match  "Internal Review".',
    HELPER_TEXT_MATCH: 'For example, "int" would match the filenames "Integer List" and "Internal Review".',
    SENSITIVE_PHRASE: 'Sensitive Phrase',
    SENSITIVE_PHRASES: 'Sensitive Phrases',
    CONFIGURATION: 'Configuration',
    WHITELISTS: 'Whitelists',
    WHITELISTED_DOMAINS: 'Whitelisted Domains',
    WHITELISTED_APPS: 'Whitelisted Apps',
    INTERNAL_DOMAINS: 'Internal Domains',
    DOMAIN_NAME: 'Domain name',
    APP_ID: 'App ID',
    APP_DESC: 'Description',
    ADD_NEW_DOMAIN: 'Add a new domain',
    ADD_NEW_APP: 'Add a new app',
    CON: 'Sensitive Phrases',
    EXACT_MATCH: 'Exact Matching',
    PARTIAL_MATCH: 'Partial Matching',
    EDIT_RISK_TYPE_SETTING: 'Edit Risk Type Setting',
    UNABLE_TO_RETRIEVE_SENSITIVE_PHRASE: 'Unable to retrieve Sensitive Phrases at this time.',
    NO_SENSITIVE_PHRASES_CREATED: 'No Sensitive Phrases created.',
    SUBMITTING_PHRASES: 'Submitting phrases',
    DELETING_PHRASES: 'Deleting phrases',
    MAXIMUM_PHASES: 'A maximum of 20 phrases are supported.',
    MANAGING_SENSITIVE_PHRASES: {
      TITLE: 'How to manage Sensitive Phrases in filenames',
      RISK_ENGINE_LOOKS_FOR_THESE_PHRASE:
        'The Risk Engine looks for these phrases in all filenames in your connected document storage platforms. When a match is found for any of these phrases, a Risk will be generated.',
      FILENAMES_AND_FILE_CONTENT: 'Filenames and file content are both considered for matches to sensitive phrases',
      ANY_CHARACTERS_WILL_BE_TREATED_LITERALLY:
        'Any characters entered will be treated literally. There are no wildcard characters.',
      SENSITIVE_PHRASES_IGNORE_CAPITALIZATION:
        'Sensitive Phrases ignore capitalization, i.e. "Internal" and "internal" are handled identically.',
      EXACT_MATCHING:
        'Exact Matching (default), your phrase will be matched exactly (i.e., "internal" would not match the word "internally").',
      PARTIAL_MATCHING:
        'Partial Matching, select the checkbox below when creating your phrase. With partial matching enabled, "internal" would match both "internal" and "internally"',
      MAXIMUM_20_PHRASES_SUPPORTED: 'A maximum of 20 phrases are supported.'
    }
  },
  RISKS: {
    TITLE: 'Risks',
    RISK_SETTINGS: 'Risk Settings',
    MULTIPLE: 'Multiple',
    SHARED_DRIVE: 'Shared Drive',
    NOT_ENABLED_MESSAGE: 'not enabled in this version',
    NOT_ENABLED_FOR_THIS_RISK_MESSAGE: 'not enabled for this type of Risk',
    ALERT_FILE_OWNER: 'Alert File Owner',
    EDIT_PERMISSIONS: 'Edit Permissions',
    RESOLVE_RISK: 'Resolve Risk',
    LOCK_DOCUMENT: 'Lock Document',
    IGNORE_RISK: 'Ignore Risk',
    PUT_BACK_AS_ACTIVE: 'Put Back As Active',
    RISK_STATE_MODAL: {
      IGNORE_TITLE: 'Continue Ignore',
      IGNORE_MESSAGE: 'Ignore this risk?',
      IGNORE_CONFIRM: 'YES, IGNORE',
      IGNORE_DESC: 'The risk could still get updated if new activiy is detected.',
      ACTIVE_TITLE: 'Confirm Put Back',
      ACTIVE_MESSAGE: 'Put risk back to active state?'
    },
    CLICK_TO_LEARN_MORE_ANONYMOUS: 'Click to learn more about Anonymous Users',
    DOWNLOAD_RISK_THRESHOLD: (actorType: RiskThresholdActorType) => `${startCase(actorType)} Download Risk Threshold`,
    DOWNLOAD_RISK_THRESHOLD_UPDATE_ERROR: 'Something went wrong updating threshold',
    DOWNLOAD_RISK_THRESHOLD_LOWER_LIMIT_ERROR: 'Should be greater than 0',
    DOWNLOAD_RISK_THRESHOLD_UPPER_LIMIT_ERROR: 'Should be less than 1000',
    DOWNLOAD_RISKS_SETTING: 'Settings for Download Risks',
    DOWNLOAD_RISK_THRESHOLD_DESCRIPTION: (actorType: RiskThresholdActorType) =>
      `You will be notified when ${actorType} employees or company owned apps are downloading more than the specified number of files. The default is 25 files`,
    ANONYMOUS_USER: 'Anonymous User',
    UNKNOWN_APP: 'Unknown App',
    RESET_FILTER: 'Reset filter',
    ACTION_REQUIRED: '[Action Required] Sensitive File at risk',
    SENSITIVE_SSN: 'Social Security Number',
    SENSITIVE_CCN: 'Credit Card Number',
    EMAIL_CONTENT: (ownerEmail: string, fileName: string, fileLink: string) => `Hello,

    Our security system has detected a file you own that can be accessed by unauthorized people.
    
    File Details
    file name: ${fileName}
    file owner: ${ownerEmail}
    link to file: ${fileLink}
    
    
    Why is this a risk?
    This file is configured with 'sharing by link' which allows any user to open the document if they possess the link to the file. This setting is undesirable and places data at risk since links may be inadvertently forwarded or shared to unintended individuals (e.g. mailing lists, forwarded email chains, etc).
    
    Action Needed
    In order to protect access to this file, please take the following steps
    1. Open the identified file here: ${fileLink}
    2. Click 'Share' or 'Share Add' people.
    3. At the bottom right of the 'Share with others' window, click Advanced.
    4. Find the row with 'anyone who has the link' or 'Public on the web' and click 'change'
    5. Within 'Link Sharing' Select 'off' and hit 'Save'
    6. Click Done.
    
    `,
    TOOLTIP_MULTIPLE:
      'The files associated with this Risk belong to multiple people. Click on the "Files At Risk" link to explore all file owners',
    TOOLTIP_MULTIPLE_TITLE: 'Sensitive Content detected in this risk',
    TOOLTIP_SHARED_DRIVE:
      'This file belongs to a Shared Drive. Access to this file is determined by membership of this shared drive',
    TOOLTIP_FILES_AT_RISK: 'Sensitive Content',
    TOOLTIP_SENSITIVE_PATTERNS: 'Sensitive patterns',
    TOOLTIP_SENSITIVE_PHRASES: 'Sensitive phrases',
    TOOLTIP_SENSITIVE_SSN: 'SSN: Social Security Number',
    TOOLTIP_SENSITIVE_CCN: 'CC#: Credit Card Number',
    TOOLTIP_SENSITIVE_PHRASES_SP: 'SP: Sensitive Phrases',
    TOOLTIP_SENSITIVE_NONE_DETECTED: 'None detected',
    TOOLTIP_PLATFORM_FILTER: 'Press "apply" after selections are made to update Risks table',
    TOOLTIP_SENSITIVE_IN_DETECTION: 'Sensitive content detection in progress',
    TOOLTIP_SENSITIVE_FOUND: 'Sensitive content found in this risk',
    TOOLTIP_SENSITIVE_FAILED: 'Sensitive content detection failed in this risk',
    TOOLTIP_SENSITIVE_CONTENT_IN_FILES:
      'Some files in this risk contain sensitive information. Click on the files at risk for more details',
    VIEW_FILES: 'View Files',
    TOOLTIP_FILTER: 'Press "apply" after selections are made to update Risks table',
    ACTIVITY_DATE_LABEL: 'Activity Date'
  },
  SETTINGS: {
    TITLE: 'Settings',
    NOTIFICATIONS: 'Notifications',
    ACCOUNTS: 'Accounts',
    ACCOUNTS_NOTE:
      'The settings on this page is only applicable if you choose to log in with the Altitude Networks’ username and password option.',
    SLACK_NOTIFICATION_NOTE: 'Support for the disabled risk types will be added in the future versions.',
    CHANGE_PASSWORD: 'Change Password',
    CHANGE_PASSWORD_SUCCESS: 'You have successfully changed your password',
    CURRENT_PASSWORD_INVALID: 'Your current password is not valid. You are not authorized to perform this operation.',
    PASSWORD_MUST_MATCH: 'Passwords must match',
    CURRENT_PASSWORD: 'Current Password',
    NEW_PASSWORD: 'New Password',
    CONFIRM_NEW_PASSWORD: 'Confirm New Password',
    SAVE_CHANGES: 'Save changes',
    SAVE: 'Save',
    SAVING_CHANGES: 'Saving changes…',
    VERIFYING: 'Verifying…',
    CHANGING_PASSWORD: 'Changing password…',
    CONGRATS_ENROLL: 'Congratulations, you are enrolled!',
    CHANGE_WILL_AFFECT_NEXT_TIME: 'The changes will take effect the next time you log in.',
    WE_WILL_ASK_CONFIRMATION:
      'After that, whenever you log in to Altitude Networks app, we will ask you for a confirmation code.',
    THRESHOLD_Files_CHANGE_CONFIRM:
      'Are you sure you want to change this setting? This change will affect the system behavior.',
    DISABLE_TWO_FACTOR_AUTH: 'Disable Two-Factor Authentication',
    ENTER_YOUR_CURRENT_PW_AND_CONFIRM:
      'You will need to enter your current password and your confirmation code to disable this feature.',
    CHANGES_WILL_TAKE_EFFECT_NEXT_TIME:
      'The changes will take effect the next time you log in. After that, whenever you log in to Altitude Networks app, we will ask you for your username and password only.',
    PASSWORD: 'Password',
    CONFIRMATION_CODE: 'Confirmation Code',
    HOW_TWO_FACTOR_AUTH_WORKS: 'How Two-Factor Authentication works',
    WHEN_LOGGING_IN_YOU_WILL_NEED: "When logging in, you'll need to provide a login code.",
    LOGIC_CODE_WILL_BE_SENT: 'The logic code will be sent to you via a mobile app, which uses TOTP protocol.',
    WHEN_YOU_TYPE_YOU_WILL_KNOW: "When you type in the login code, we'll know it's really you.",
    SCAN_QR_CODE: 'Scan QR code',
    FROM_SECURITY_APP_FOLLOW_THE_STEPS:
      "From your security app, follow the steps to set up a new account. When prompted, scan the following QR with your camera. After, you'll need to perform a quick test.",
    IF_YOU_DONT_HAVE_APP_YOU_WILL_NEED_TO_DOWNLOAD:
      "If you don't have a security app, you will need to download one, have a look at",
    GOOGLE_AUTHENTICATOR: 'Google Authenticator',
    CANT_SCAN_CODE_COPY_AND_PASTE: "Can't scan code? Just copy and paste it on your security app instead:",
    TWO_FACTOR_AUTH_DISABLED: 'Two-Factor Authentication was successfully disabled',
    SETUP_2FA_USING_TOTP: 'Set up 2FA using Time-based One-time Password (TOTP)',
    ENABLE_DISABLE_2FA_FOR_USER: (enabled: boolean) => `${enabled ? 'Disable' : 'Enable'} 2FA for this user`,
    TRY_YOUR_CODE: 'Try your code',
    USE_YOUR_SECURITY_APP_TO_GENERATE: 'Use your security app to generate a code and enter it below.',
    SLACK_SECTION_TITLE: 'Slack Integration',
    SLACK_GET_STARTED: 'Configure settings for risk notifications in Slack',
    SLACK_GET_STARTED_CTA: 'Add to Slack',
    SLACK_GET_STARTED_CTA_LOADING: 'Adding to Slack',
    SLACK_POPUP_TITLE: 'Altitude Networks Slack Application',
    SLACK_SELECT_CHANNEL:
      'No channel selected. In order to receive notifications, select a channel from your Slack workspace below.',
    SLACK_SELECT_CHANNEL_CTA: 'Select a new channel',
    SLACK_SELECT_CHANNEL_CANCEL: 'Cancel',
    SLACK_WAITING_FOR_CHANNELS: 'Loading current channels',
    SLACK_CURRENT_CHANNEL: (channelName: string) => `Currently installed in channel: ${channelName}`,
    SLACK_CURRENT_NOTIFICATIONS: 'You are currently receiving Slack notifications for the following risk types:',
    SLACK_NO_CURRENT_NOTIFICATIONS: 'You have currently not enabled Slack notifications for any risk types.',
    SLACK_EDIT_NOTIFICATIONS_CTA: 'Edit Risk Type Notification Setting',
    SLACK_SELECT_NOTIFICATIONS: "Select the risk types you'd like to receive Slack notifications for:",
    CHANGE_SUCCESS: 'Successfully changed',
    ADD_SUCCESS: 'Successfully added',
    DELETE_SUCCESS: 'Successfully deleted',
    TWO_FACTOR_AUTHENTICATION: 'Two-Factor Authentication (2FA)',
    UNSUPPORTED_PLATFORM: `Slack notifications are not yet supported for this platform`
  },
  SPOTLIGHT: {
    EMAIL_COPIED_TO_CLIPBOARD: 'Email copied to clipboard',
    COPY_EMAIL: 'Copy email',
    EXTERNAL: 'External',
    EXTERNAL_TOOLTIP: 'This is an external account',
    EXT: 'EXT',
    ACCESSIBLE: 'Accessible',
    ALL: 'All',
    PERSON_DOWNLOADS: `Downloads (non-app)`,
    APP_DOWNLOADS: 'App Downloads',
    OWNED_AND_ATRISK: 'Owned & At-Risk',
    CREATED: 'Created',
    FAILED: 'Failed',
    COLLABORATOR_ADDS: 'Collaborator Adds',
    COLLABORATOR: 'Collaborator',
    EVENT: 'Event',
    TARGET: 'Target',
    RECEIVED: 'Received',
    SHARED: 'Shared',
    SHARED_DRIVE: 'Shared Drive',
    SHARED_WITH: 'Shared With',
    SHARED_TO: 'Shared To',
    DATE_TIME: 'DateTime',
    DATE_DOWNLOADED: 'Date Downloaded',
    ARE_YOU_SURE_TO_REMOVE: COMMON.ARE_YOU_SURE_TO_REMOVE,
    ALL_FILE_EVENTS: 'All File Events',
    NO_RESULT_FOUND: 'No result found. Please try a different Email Address.',
    NONE_PERMISSION_CAN_BE_REMOVED_INSPECT_BY_EMAIL: (email?: string) =>
      `None of the existing permissions can be removed by our system. Please inspect the files accessible by ${email} individually.`,
    PERMISSIONS_GRANTING_ACCESS_CAN_ONLY_BE_REMOVED:
      'Permissions granting access to files owned by an external account or shared drive can only be removed from the application.',
    FILE_ADDED_TO_DESTINATION_FOLDER: (dest: string) => `File added to folder '${dest}'`,
    RENAME_FROM_OLD_NAME_TO_NEW_NAME: (oldName: string, newName: string) => `Renamed from '${oldName}' to '${newName}'`,
    FILE_MOVD_FROM_SRC_TO_DEST: (srcFolder: string, destFolder: string) =>
      `File moved from ${srcFolder} to ${destFolder}`,
    CHANGE_USER_ACCESS: (oldValue: string, newValue: string) => `Access changed from '${oldValue}' to '${newValue}'`,
    CHANGE_DOCUMENT_ACCESS_SCOPE: (oldVisibility: string, oldValue: string, visibility: string, newValue: string) =>
      `Access changed from '${oldVisibility}': ${oldValue} to '${visibility}: ${newValue}'`,
    CHANGE_ACL_EDITORS: (oldVisibility: string, visibility: string) =>
      visibility === oldVisibility ? '' : `Access changed from '${oldVisibility}' to '${visibility}'`,
    CHANGE_DOCUMENT_VISIBILITY: (oldVisibility: string, visibility: string) =>
      `Access changed from '${oldVisibility}' to '${visibility}'`,
    COPY: (oldValue: string) => `This file is a copy of '${oldValue}'`,
    ANONYMOUS_USER_INFO: 'No details available for Anonymous Users'
  },
  LOGIN: {
    INVALID_EMAIL_PW: 'Invalid email or password.',
    TRY_AGAIN: 'Please try again',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    LOGIN: COMMON.LOG_IN,
    LOGGING_IN: 'Logging in…',
    LOGINS_FROM_PERSONAL_ACC_NOT_SUPPORTED: 'Logins from personal accounts are not supported',
    CONFIRMATION_CODE: 'Confirmation Code',
    USE_GENERATOR_AND_ENTER: 'Use your code generator app to generate a code and enter it above',
    CONFIRM_LOGIN: 'Confirm login',
    CONFIRMING: 'Confirming…'
  },
  EXTERNAL_LOGIN_SHARED: {
    ENTER_EMAIL: (provider: string | null) => `Enter your ${provider ?? 'external'} email`,
    CHANGE_EMAIL: 'Change your external email',
    GO_BACK: 'Go back'
  },
  OKTA_LOGIN: {
    CONTINUE_WITH_OKTA: `${COMMON.LOG_IN} with Okta`,
    LOGGING_IN: 'Logging in Okta…'
  },
  MICROSOFT_LOGIN: {
    CONTINUE_WITH_MICROSOFT: `${COMMON.LOG_IN} with Microsoft`,
    LOGGING_IN: 'Logging in Microsoft…'
  },
  GOOGLE_LOGIN: {
    INVALID_LOGIN: 'Your credentials were invalid, please try again',
    LOGIN_DISABLED:
      "Unable to connect to Google's OAuth service. This may have been caused by using an incogntio window or content blocker.",
    CONTINUE_WITH_GOOGLE: `${COMMON.LOG_IN} with Google`
  },
  LOGOUT: {
    LOGOUT: 'Log out',
    LOGOUT_SUCCESS: 'You have successfully logged out',
    LOGOUT_FAIL: 'Logout failed'
  },
  NOT_FOUND: {
    PAGE_NOTFOUND: 'Sorry, page not found!'
  },
  SIGNUP: {
    USER_ALREADY_EXISTS: 'User already exists, the verification email has been sent again',
    PLEASE_CHECK_EMAIL_FOR_CODE: 'Please check your email for the code',
    FULL_NAME: 'Full Name',
    PHONE_NUMBER: 'Phone Number',
    USERNAME: 'Username',
    CONFIRM_PASSWORD: 'Confirm Password',
    SIGNUP: 'Sign up',
    SIGNING_UP: 'Signing up…'
  },
  TOOLTIP_IP: {
    IP_DETAILS: 'IP details',
    IP: 'IP',
    NO_IP: 'Unknown IP address',
    UNKNOWN: 'Unknown',
    NO_IP_ERROR: "We couldn't find the IP for this event",
    LOCATION_ERROR: "We couldn't find the details for this IP address",
    LOCATION: 'Location',
    ORG: 'Org',
    NO_MAP: 'No map data available for this IP address',
    MAP_COORDINATES_ERROR: 'Exact location not found'
  },
  PLATFORMS: {
    GSUITE_ID: 'gsuite',
    GSUITE_NAME: 'Google Workspace',
    O365_ID: 'o365',
    O365_NAME: 'Microsoft 365',
    BOX_ID: 'box',
    BOX_NAME: 'Box'
  },
  GOOGLE_APP: {
    CONTACT_US: 'GoogleApp__contactus',
    RAPID_ASSESSMENT: 'Altitude Networks Rapid Security Assessment',
    ALL_SET: 'All set! Ready to analyze your',
    WORKSPACE_ENVIRONMENT: 'Google Workspace environment.',
    START_ASSESSMENT: 'Start Risk Assessment',
    ESTABLISHING_CONNECTION: 'Just a moment, we are establishing connection',
    FORRESTER_STATS:
      'Forrester research in February 2021 found that 74% of business leaders are more concerned with data loss due to insider risks than before the pandemic, and 82% are now more focused on protecting company data. ',
    CREATING_INFRA: 'Creating the infrastructure',
    FINANCES_ONLINE_STATS:
      'Finances Online reports that data loss is a top security concern for 63% of BYOD (Bring Your Own Device) organizations.',
    GOOD_HANDS: 'You are in good hands. These organizations trust us to protect their data.',
    PREPARING_DATA: 'Preparing your data',
    WE_DISCOVERED: (risksNumber: number) =>
      `We also discovered ${risksNumber} more risks you can remediate immediately after a full onboarding process with us.`,
    LETS_TALK: 'Interested in learning more about our product? Let’s talk!',
    PLEASE_LOGIN: 'Please log in with your Google Workspace account.'
  },
  ERROR_MESSAGES: {
    SOMETHING_WRONG: 'Something went wrong.',
    OUR_END: 'This is likely on our end.',
    NO_RESULTS: 'No results found.',
    NO_ENTRIES: 'No entries.'
  },
  EXPLORE_PLATFORMS_HEADER: {
    VIEW_PLATFORM: (platformName: string) => `View ${platformName}`,
    VIEW_MAIN_SPOTLIGHT: `View Main Spotlight`,
    THIS_CONTAINS_ONE_PLATFORM: `This is the user’s Spotlight page with only Box data, to view this user’s main Spotlight page that contains Google Workspace and Microsoft 365 data, please click here.`,
    THIS_IS_MAIN_SPOTLIGHT: `This is the user’s main Spotlight page with Google Workspace and Microsoft 365 data, click on the corresponding button to view user Spotlight for each platform.`
  },
  MANAGE_PLATFORMS: {
    TITLE: 'Manage Platforms',
    DESCRIPTION:
      'This page lists all platforms that are available to be connected to Altitude Networks. You can connect a new platform, or disconnect an existing platform ',
    YES_DISCONNECT: 'Yes, disconnect',
    SURE_DISCONNECT: (platform: string) => `Are you sure you want to disconnect ${platform}?`,
    ERROR_FETCHING_PLATFORMS: 'Error fetching platforms information'
  },
  ACVITITY: {
    TITLE: 'Security Posture',
    TAB_LABELS: {
      FILE_ACTIVITY: 'File Activity',
      ACCOUNTS_ACTIVITY: 'Accounts Activity'
    },
    FILE: {
      DESCRIPTION_CONNECTED: (platformName: string) =>
        `Find file or folder activities and associated accounts in ${platformName}.`,
      DESCRIPTION_NOT_CONNECTED: (platformName: string) => `You are not connected yet to ${platformName}`
    },
    FILTER_LABELS: {
      FILE_ACTIVITY: 'File Activity',
      TIME_OF_ACTIVITY: 'Time of Activity',
      NUMBER_OF_ENTIRES: 'Number of Entries',
      ASSOCIATED_USER_ACCOUNTS: (platformName: string) => `Associated ${platformName} user accounts`
    },
    ACTIVITY_TYPE_LABEL: {
      [FileActivityType.ACCESS_GRANTED]: 'Access granted',
      [FileActivityType.CHANGE_FOLDER_PERMISSION]: 'Folder permission changed',
      [FileActivityType.CONTENT_ACCESS]: 'Content accessed',
      [FileActivityType.DOWNLOAD]: 'File or folder downloaded',
      [FileActivityType.FILE_WATERMARKED_DOWNLOAD]: 'Watermarked file downloaded',
      [FileActivityType.ITEM_DOWNLOAD]: 'Item downloaded',
      [FileActivityType.ITEM_PREVIEW]: 'Item preview',
      [FileActivityType.ITEM_SHARED]: 'Item shared',
      [FileActivityType.ITEM_SHARED_CREATE]: 'Shared link created',
      [FileActivityType.ITEM_SHARED_UPDATE]: 'Shared link updated',
      [FileActivityType.ITEM_SYNC]: 'Item synced',
      [FileActivityType.SHARE]: 'File or folder shared'
    }
  },
  VALIDATION: {
    INVALID: 'Invalid value',
    REQUIRED: 'This field is required',
    INTEGER: 'Should be integer',
    GREATER_THAN: (min: number) => `Should be greater than ${min}`,
    LESS_THAN: (max: number) => `Should be less than ${max}`
  },
  PLATFORM_CARD: {
    STATUS: 'Status',
    ACCOUNT: 'Account',
    EMAIL: 'Email',
    CONNECTED_ON: 'Connected On',
    RESOURCES: 'Resources',
    DISCONNECT: 'Disconnect',
    CONNECT: 'Connect',
    ACTIVE: 'Active',
    INACTIVE: 'Not Connected'
  },
  CSV_HEADERS: {
    IP_ADDRESS: 'IP Address',
    LINK_INSPECTOR: 'Link to Inspector',
    LINK_STORAGE: 'Link to Storage',
    SEVERITY: 'Severity',
    RISK_TYPE: 'Risk Type',
    FILES_AT_RISK: 'Files At Risk',
    LINK_TO_FILE: 'Link To File',
    FILE_ID: 'File ID',
    FILE_NAME: 'File Name',
    PLATFORM: 'Platform',
    RISK_CREATOR: 'Risk Creator',
    FILE_OWNER: 'File Owner',
    LINK_OWNERS_SPOTLIGHT: "Link to Owner's Spotlight",
    DETECTED_ON: 'Detected On',
    CREATED_AT: 'Created At',
    LAST_MODIFIED: 'Last Modified',
    DOWNLOADED_ON: 'Downloaded On',
    NAME: 'Name',
    EMAIL: 'Email',
    DATE: 'Date',
    EVENT: 'Event',
    ACTOR: 'Actor',
    TARGET: 'Target',
    ACTOR_LINK: 'Actor Link'
  }
}

export default UI_STRINGS
