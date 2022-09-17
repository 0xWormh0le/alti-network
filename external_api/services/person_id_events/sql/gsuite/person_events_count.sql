-- person_id_events count query <external_api:services/person_id_events/sql/gsuite/person_events_count.sql>
SELECT COUNT(DISTINCT id_uniqueQualifier) AS found_rows
FROM admin_reports_v1_drive
{% if event_category == "appdownloads" %}
WHERE event_name = 'download'
    AND event_type = 'access'
    AND actor_email = %(person_id)s
    AND originating_app_id IS NOT NULL
{% elif event_category == "persondownloads" %}
WHERE event_name = 'download'
    AND event_type = 'access'
    AND actor_email = %(person_id)s
    AND originating_app_id IS NULL
{% elif event_category == "added" %}
WHERE event_name = 'change_user_access'
    AND event_type = 'acl_change'
    AND actor_email = %(person_id)s
    AND new_value != 'none'
{% elif event_category == "sharedWith" %}
WHERE event_type = 'acl_change'
    AND target_user = %(person_id)s
{% elif event_category == "sharedBy" %}
WHERE event_type = 'acl_change'
    AND actor_email = %(person_id)s
    AND target_user IS NOT NULL
{% else %}
WHERE actor_email = %(person_id)s
    OR target_user = %(person_id)s
{% endif %}
