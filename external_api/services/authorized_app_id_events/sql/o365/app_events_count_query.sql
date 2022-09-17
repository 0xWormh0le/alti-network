-- /app/id/events count query <external_api:services/authorized_app_id/sql/o365/app_events_count_query.sql>
SELECT COUNT(DISTINCT mas.ms_id) AS found_rows
FROM ms_audit_sharepoint AS mas
WHERE mas.app_id = %(app_id)s
{% if event_category == 'downloads' %}
-- download of a file by an app id
    AND mas.operation IN ( 'FileDownloaded', 'FileSyncDownloadedFull')
{% elif event_category == 'added' %}
-- Provided user access to a file or folder
    AND mas.operation IN (
        'AddedToSecureLink',
        'CompanyLinkCreated',
        'SecureLinkCreated',
        'CompanyLinkUsed',
        'SharingInheritanceBroken',
        'SharingSet'
    )
{% elif event_category == 'sharedWith' %}
-- shared documents with someone specific
    AND mas.operation IN (
        'AddedToSecureLink',
        'CompanyLinkCreated',
        'SecureLinkCreated',
        'CompanyLinkUsed',
        'SharingInheritanceBroken',
        'SharingSet'
    )
{% elif event_category == 'sharedBy' %}
-- documents shared by current application
    AND mas.operation IN (
        'AddedToSecureLink',
        'CompanyLinkCreated',
        'SecureLinkCreated',
        'CompanyLinkUsed',
        'SharingInheritanceBroken',
        'SharingSet'
    )
    AND mas.target_name IS NOT NULL
{% endif %}
