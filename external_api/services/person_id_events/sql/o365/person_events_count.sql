-- person_id_events count query <external_api:services/person_id_events/sql/o365/person_events_count.sql>
SELECT COUNT(DISTINCT mas.ms_id) AS found_rows
FROM ms_audit_sharepoint AS mas
{% if event_category == 'appdownloads' %}
-- download of a file using an app
WHERE mas.operation IN ( 'FileDownloaded', 'FileSyncDownloadedFull')
    AND mas.user_id = %(person_id)s
    AND mas.app_id IS NOT NULL
{% elif event_category == 'persondownloads' %}
-- download of files and folders by a person
WHERE mas.operation IN ( 'FileDownloaded', 'FileSyncDownloadedFull')
    AND mas.user_id = %(person_id)s
    AND mas.app_id IS NULL
{% elif event_category == 'added' %}
-- Providing user access to a file or folder
WHERE mas.operation IN (
        'AddedToSecureLink',
        'CompanyLinkCreated',
        'SecureLinkCreated',
        'CompanyLinkUsed',
        'SharingInheritanceBroken',
        'SharingSet'
    )
    AND mas.user_id = %(person_id)s
{% elif event_category == 'sharedWith' %}
-- sharing documents with someone specific
WHERE mas.operation IN (
        'AddedToSecureLink',
        'CompanyLinkCreated',
        'SecureLinkCreated',
        'CompanyLinkUsed',
        'SharingInheritanceBroken',
        'SharingSet'
    )
    AND mas.target_name = %(person_id)s
{% elif event_category == 'sharedBy' %}
-- documents shared by current user
WHERE mas.operation IN (
        'AddedToSecureLink',
        'CompanyLinkCreated',
        'SecureLinkCreated',
        'CompanyLinkUsed',
        'SharingInheritanceBroken',
        'SharingSet'
    )
    AND mas.user_id = %(person_id)s
    AND mas.target_name IS NOT NULL
{% else %}
WHERE mas.user_id = %(person_id)s
    OR mas.target_name = %(person_id)s
{% endif %}

