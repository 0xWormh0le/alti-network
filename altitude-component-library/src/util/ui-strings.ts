const COMMON = {
  ARE_YOU_SURE_TO_REMOVE: (permissionCount: string, grantee: any, fileCount: string) =>
    `Are you sure you want to delete ${permissionCount}, removing ${grantee} from up to ${fileCount}?`,
  RESOLVE_RISK_TITLE_BASE: 'Files Accessible by',
  STATE_DESCRIPTIONS: {
    FILE: 'File',
    COMPANY_OWNED: 'Company Owned',
    COMPANY_OWNED_NEGATIVE: 'Externally Owned',
    SENSITIVE: 'Potentially Sensitive File',
    MOST_SHARED: 'Most Shared Files',
    MOST_SHARED_SHORT: 'Most Shared',
    MANY_DOWNLOADS_SHORT: 'Many Recent Downloads',
    MANY_DOWNLOADS: 'Many Files Downloaded in 24 hours',
    DOWNLOADS_BY_APP: 'by Authorized App',
    DOWNLOADS_BY_APP_SHORT: 'by App',
    INTERNAL_LINK_SHARE: 'Shared by Link Internally',
    EXTERNAL_LINK_SHARE: 'Shared by Link Externally',
    PERSONAL_SHARE: 'Shared to Personal Email Account',
    PERSONAL_SHARE_SHORT: 'Shared to Personal',
    INTERNAL_ACCOUNT: 'Internal Account',
    EXTERNAL_ACCOUNT: 'External Account',
    OLD_RISK: 'Created Over 180 Days Ago',
    INTERNAL_LINK: 'Internal Link',
    EXTERNAL_LINK: 'External Link',
    SESNITIVE_TAG: '(sensitive)',
    COMPANY_OWNED_NEGATIVE_TAG: '(externally owned)',
    SENSITIVE_EXTERNAL_TAG: '(externally owned, sensitive)',
    OLD_TAG: '(6 mo. old)',
    SESNITIVE_OLD_TAG: '(sensitive, 6 mo. old)'
  },
  LOG_IN: 'Log in'
}

export const UI_STRINGS = {
  HEADER_BAR: {
    SUPPORT: 'Support',
    SUPPORT_DIALOG_TITLE: 'Submit support request',
    ABOUT: 'About',
    HOME: 'Home',
    LOGGED_IN_AS: (name: string) => `Logged in as: ${name}`
  },
  SIDEBAR: {
    MAIN_MENU: 'Main menu',
    SUPPORT: 'Support',
    PAGE_NOT_ACTIVATED: 'This page has not yet been activated',
    CONFIRM: 'Confirm'
  },
  BUTTON_LABELS: {
    CONFIRM: 'OK',
    CANCEL: 'Cancel',
    CORRECT: 'Correct',
    REMOVE: 'Remove'
  },
  SENSITIVE_PHRASES: {
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
    REMOVE_EXISTING_PHRASE: 'Remove an existing phrase to add more'
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
    THIS_APP_GRANTED_TO: 'This app has been granted access to:',
    UNABLE_TO_DETERMINE: 'Unable to determine the services this app has been granted access to',
    OF_TOTAL_USERS: (total: any) => `of ${total} total users`,
    TOTAL_SENSITIVE_FILES: (total: any) => `${total} sensitive files`,
    UNKNOWN: 'Unknown'
  },
  DASHBOARD: {
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
    RISK_TYPE: 'Risk type',
    RISK_COUNT: 'Risk count',
    NO_RISK_TYPES_FOUND_FOR_CATEGORY: 'No risk types found for this category.',
    SHOW_ALL_BY: (label: string) => `Show All ${label}`
  },
  EDIT_PERMISSIONS: {
    FILE_PERMISSIONS: 'File Permissions',
    OWNED_BY: 'Owned by',
    CREATED_ON: 'Created on',
    LAST_MODIFIED: 'Last modified',
    ERROR_ENCOUNTERED_TRY_AGAIN: 'We encountered an error. Please try again.',
    PERMISSIONS_CANNOT_BE_REMOVED_DIRECT_REMOVE:
      'Permissions for files owned by a shared drive cannot be removed here, go to the Google Drive directly to resolve',
    PERMISSIONS_FOR_EXTERNALLY_OWNED_CANT_BE_REMOVED:
      'Permissions for externally owned files cannot be removed here, go to the Google Drive directly to resolve',
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
      `The file ${fileName} can no longer be accessed by ${removeMessage}.`
  },
  FILES: {
    THIS_FILE_IS_OWNED_BY_EXTERNAL_ACC: (email: string) => `This file is owned by the external account ${email}.`,
    ACTION_TIMELINE_NOTAVAILABLE_OUTSIDE:
      'Action Timeline not available for Files owned by accounts outside your company.'
  },
  FILE: {
    UNKNOWN: 'unknown',
    VIEW_ORIGINAL_FILE_IN_DRIVE: 'View Original File in Drive',
    VIEW_ORIGINAL_FOLDER_IN_DRIVE: 'View Original Folder in Drive',
    FILE_SHARING: 'File sharing',
    FILE_SHARING_STATUS: (internal: number, external: number) => `${internal} Internal, ${external} External`,
    LINK_SHARING: 'Link sharing',
    CREATED: 'Created',
    MODIFIED: 'Modified',
    ANALYZED: 'Analyzed',
    ANALYZE_FILE: 'Analyze File',
    FILE_ACTION_TIMELINE: 'File Action Timeline',
    FILE_SENSITIVE_CONTENTS: 'Sensitive Content',
    INTERNAL_COLLABORATORS: 'Internal Collaborators',
    EXTERNAL_COLLABORATORS: 'External Collaborators',
    FILES_IN_FOLDER: 'Folder Contents',
    ALL_FOLDER_CONTENTS: 'All Folder Contents'
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
    SEARCH_BY: 'Search for internal people, emails and files...',
    SEARCH_BY_LABEL:
      'Search for internal employees by name or email, external people by email, or files by exact file id.',
    NO_MATCHES_FOUND:
      'No internal employees found. Enter a complete email address to find an external employee, or an exact file id to find a file.'
  },
  RESOLVE_RISK: {
    PERMISSIONS_EXTERNALLY_OWNED_CANT_BE_REMOVED_HERE:
      'Permissions for externally owned files cannot be removed here, go to the Google Drive directly to resolve',
    PERMISSIONS_SHARED_CANT_BE_REMOVED_HERE:
      'Permissions for files owned by a shared drive cannot be removed here, go to the Google Drive directly to resolve',
    NONE_CAN_BE_REMOVED:
      'None of the existing permissions can be removed by our system. Please inspect the files associated with this risk individually.',
    ARE_YOU_SURE_TO_REMOVE: COMMON.ARE_YOU_SURE_TO_REMOVE,
    PERMISSIONS_GRANTING_OR_SHARED_CAN_BE_REMOVED:
      'Permissions granting access to files owned by an external account or shared drive can only be removed from the Goole Drive application.',
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
  RISK_SETTINGS: {
    SENSITIVE_FILE_CLASSIFICATION: {
      TITLE: 'Sensitive File Classification',
      AUTOMATICALLY_CLASSIFIES:
        'The Altitude Networks Risk Engine automatically classifies and surfaces sensitive content based on analysis of file names and file contents.',
      THE_CLASSIFIER_ENGINE:
        'The classifier engine can be enhanced with specific sensitive phrases that are unique to your organization.'
    },
    HELPER_TEXT_NOTMATCH:
      'For example, "int" would match the filename "Number or int" but would NOT match  "Internal Review".',
    HELPER_TEXT_MATCH: 'For example, "int" would match the filenames "Integer List" and "Internal Review".',
    SENSITIVE_PHRASE: 'Sensitive Phrase',
    EXACT_MATCH: 'Exact Matching',
    UNABLE_TO_RETRIEVE_SENSITIVE_PHRASE: 'Unable to retrieve Sensitive Phrases at this time.',
    NO_SENSITIVE_PHRASES_CREATED: 'No Sensitive Phrases created.',
    SUBMITTING_PHRASES: 'Submitting phrases',
    DELETING_PHRASES: 'Deleting phrases',
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
  },
  RISKS: {
    MULTIPLE: 'Multiple',
    SHARED_DRIVE: 'Shared Drive',
    NOT_ENABLED_MESSAGE: 'not enabled in this version',
    NOT_ENABLED_FOR_THIS_RISK_MESSAGE: 'not enabled for this type of Risk',
    ALERT_FILE_OWNER: 'Alert File Owner',
    EDIT_PERMISSIONS: 'Edit Permissions',
    RESOLVE_RISK: 'Resolve Risk',
    LOCK_DOCUMENT: 'Lock Document',
    CLICK_TO_LEARN_MORE_ANONYMOUS: 'Click to learn more about Anonymous Users',
    ANONYMOUS_USER: 'Anonymous User',
    UNKNOWN_APP: 'Unknown App',
    ACTION_REQUIRED: '[Action Required] Sensitive File at risk',
    EMAIL_CONTENT: (fname: string, ownerEmail: string, fileName: string, fileLink: string) => `Hello ${fname},

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
    TOOLTIP_SENSITIVE_NONE_DETECTED: 'None detected'
  },
  SETTINGS: {
    CHANGE_PASSWORD_SUCCESS: 'You have successfully changed your password',
    CURRENT_PASSWORD_INVALID: 'Your current password is not valid. You are not authorized to perform this operation.',
    PASSWORD_MUST_MATCH: 'Passwords must match',
    CURRENT_PASSWORD: 'Current Password',
    CONFIRM_NEW_PASSWORD: 'Confirm New Password',
    SAVE_CHANGES: 'Save changes',
    SAVING_CHANGES: 'Saving changes…',
    CHANGING_PASSWORD: 'Changing password…',
    CONGRATS_ENROLL: 'Congratulations, you are enrolled!',
    CHANGE_WILL_AFFECT_NEXT_TIME: 'The changes will take effect the next time you log in.',
    WE_WILL_ASK_CONFIRMATION:
      'After that, whenever you log in to Altitude Networks app, we will ask you for a confirmation code.',
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
    SLACK_CURRENT_CHANNEL: (channelName: string) => `Currently installed in channel: ${channelName}`
  },
  SPOTLIGHT: {
    EMAIL_COPIED_TO_CLIPBOARD: 'Email copied to clipboard',
    CLICK_TO_COPY: 'Click to copy',
    EXTERNAL: 'External',
    EXT: 'EXT',
    ACCESSIBLE: 'Accessible',
    ALL: 'All',
    PERSON_DOWNLOADS: `Downloads (non-app)`,
    APP_DOWNLOADS: 'App Downloads',
    OWNED_AND_ATRISK: 'Owned & At-Risk',
    CREATED: 'Created',
    COLLABORATOR_ADDS: 'Collaborator Adds',
    RECEIVED: 'Received',
    SHARED: 'Shared',
    SHARED_DRIVE: 'Shared Drive',
    ARE_YOU_SURE_TO_REMOVE: COMMON.ARE_YOU_SURE_TO_REMOVE,
    ALL_FILE_EVENTS: 'All File Events',
    NO_RESULT_FOUND: 'No result found. Please try a different Email Address.',
    NONE_PERMISSION_CAN_BE_REMOVED_INSPECT_BY_EMAIL: (email?: string) =>
      `None of the existing permissions can be removed by our system. Please inspect the files accessible by ${email} individually.`,
    PERMISSIONS_GRANTING_ACCESS_CAN_ONLY_BE_REMOVED:
      'Permissions granting access to files owned by an external account or shared drive can only be removed from the Goole Drive application.',
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
    ENTER_EMAIL: (provider: string | null) => `Enter your ${provider || 'external'} email`,
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
  RISK_CATALOG: {
    RISK_0_NAME: `${COMMON.STATE_DESCRIPTIONS.MOST_SHARED} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED}`,
    RISK_0_SHORT: COMMON.STATE_DESCRIPTIONS.MOST_SHARED_SHORT,
    RISK_10_NAME: `${COMMON.STATE_DESCRIPTIONS.MOST_SHARED} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE}`,
    RISK_10_SHORT: `${COMMON.STATE_DESCRIPTIONS.MOST_SHARED_SHORT} ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE_TAG}`,
    RISK_1011_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.INTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED}`,
    RISK_1011_SHORT: `${COMMON.STATE_DESCRIPTIONS.INTERNAL_LINK} ${COMMON.STATE_DESCRIPTIONS.SESNITIVE_TAG}`,
    RISK_1013_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.INTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE}`,
    RISK_1013_SHORT: `${COMMON.STATE_DESCRIPTIONS.INTERNAL_LINK} ${COMMON.STATE_DESCRIPTIONS.SESNITIVE_TAG} ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE_TAG}`,
    RISK_1020_NAME: `${COMMON.STATE_DESCRIPTIONS.FILE} ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED}`,
    RISK_1020_SHORT: COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK,
    RISK_1021_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED}`,
    RISK_1021_SHORT: `${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK} ${COMMON.STATE_DESCRIPTIONS.SESNITIVE_TAG}`,
    RISK_1022_NAME: `${COMMON.STATE_DESCRIPTIONS.FILE} ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE}`,
    RISK_1022_SHORT: `${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK} ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE_TAG}`,
    RISK_1023_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE}`,
    RISK_1023_SHORT: `${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK} ${COMMON.STATE_DESCRIPTIONS.SENSITIVE_EXTERNAL_TAG}`,
    RISK_1050_NAME: `${COMMON.STATE_DESCRIPTIONS.FILE} ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.OLD_RISK}`,
    RISK_1050_SHORT: `${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK} ${COMMON.STATE_DESCRIPTIONS.OLD_TAG}`,
    RISK_1051_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK_SHARE} - ${COMMON.STATE_DESCRIPTIONS.OLD_RISK}`,
    RISK_1051_SHORT: `${COMMON.STATE_DESCRIPTIONS.EXTERNAL_LINK} ${COMMON.STATE_DESCRIPTIONS.SESNITIVE_OLD_TAG}`,
    RISK_2000_NAME: `${COMMON.STATE_DESCRIPTIONS.FILE} ${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED}`,
    RISK_2000_SHORT: COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE_SHORT,
    RISK_2001_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED}`,
    RISK_2001_SHORT: `${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE_SHORT} ${COMMON.STATE_DESCRIPTIONS.SESNITIVE_TAG}`,
    RISK_2002_NAME: `${COMMON.STATE_DESCRIPTIONS.FILE} ${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE}`,
    RISK_2002_SHORT: `${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE_SHORT} ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE_TAG}`,
    RISK_2003_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE}`,
    RISK_2003_SHORT: `${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE_SHORT} ${COMMON.STATE_DESCRIPTIONS.SESNITIVE_TAG} ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE_TAG}`,
    RISK_2010_NAME: `${COMMON.STATE_DESCRIPTIONS.FILE} ${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE} - ${COMMON.STATE_DESCRIPTIONS.OLD_RISK}`,
    RISK_2010_SHORT: `${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE_SHORT} ${COMMON.STATE_DESCRIPTIONS.OLD_TAG}`,
    RISK_2011_NAME: `${COMMON.STATE_DESCRIPTIONS.SENSITIVE} ${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE} - ${COMMON.STATE_DESCRIPTIONS.OLD_RISK}`,
    RISK_2011_SHORT: `${COMMON.STATE_DESCRIPTIONS.PERSONAL_SHARE_SHORT} ${COMMON.STATE_DESCRIPTIONS.SESNITIVE_OLD_TAG}`,
    RISK_3100_NAME: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS} by ${COMMON.STATE_DESCRIPTIONS.INTERNAL_ACCOUNT}`,
    RISK_3100_SHORT: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS_SHORT} - ${COMMON.STATE_DESCRIPTIONS.INTERNAL_ACCOUNT}`,
    RISK_3200_NAME: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS} by ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_ACCOUNT}`,
    RISK_3200_SHORT: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS_SHORT} - ${COMMON.STATE_DESCRIPTIONS.EXTERNAL_ACCOUNT}`,
    RISK_3010_NAME: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS} ${COMMON.STATE_DESCRIPTIONS.DOWNLOADS_BY_APP} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED}`,
    RISK_3010_SHORT: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS_SHORT} ${COMMON.STATE_DESCRIPTIONS.DOWNLOADS_BY_APP_SHORT}`,
    RISK_3012_NAME: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS} ${COMMON.STATE_DESCRIPTIONS.DOWNLOADS_BY_APP} - ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE}`,
    RISK_3012_SHORT: `${COMMON.STATE_DESCRIPTIONS.MANY_DOWNLOADS_SHORT} ${COMMON.STATE_DESCRIPTIONS.DOWNLOADS_BY_APP_SHORT} ${COMMON.STATE_DESCRIPTIONS.COMPANY_OWNED_NEGATIVE_TAG}`
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
  }
}

export default UI_STRINGS
