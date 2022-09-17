-- App Id Events count query API endpoint <external_api:services/authorized_app_id_events/sql/gsuite/app_events_count_query.sql>
SELECT COUNT(DISTINCT id_uniqueQualifier) AS found_rows
FROM admin_reports_v1_drive
WHERE originating_app_id = %(app_id)s
{% if event_category == "downloads" %}
    AND event_name = 'download'
    AND event_type = 'access'
{% elif event_category == "added" %}
    AND event_name = 'change_user_access'
    AND event_type = 'acl_change'
{% elif event_category == "sharedWith" %}
    AND event_type = 'acl_change'
{% elif event_category == "sharedBy" %}
    AND event_type = 'acl_change'
    AND target_user IS NOT NULL
{% endif %}
