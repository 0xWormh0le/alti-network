-- `/person/id/stats` API endpoint <external_api:services/person_id_stats/sql/person_id_stats_without_risk.sql>
-- Note: This query fetches person stats without calling the top_risks table.
SELECT
    UNIX_TIMESTAMP(m.month) as month,
    COALESCE(stat.count, 0) AS count
FROM (
    SELECT
        date_sub(
            date_sub(CURRENT_DATE, INTERVAL day(CURRENT_DATE) - 1 DAY),
            INTERVAL n MONTH
        ) AS month
    FROM
        series
    WHERE n >= 0 AND n <= 12
) AS m
LEFT JOIN (
    SELECT
        id_month AS month,
        COUNT(*) AS count
    FROM admin_reports_v1_drive
    WHERE id_month >= %(start_date)s AND id_month < %(end_date)s
    {% if metric == 'allactivity' %}
        AND actor_email = %(person_id)s
    {% elif metric == 'appdownloads' %}
        AND actor_email = %(person_id)s
        AND event_type = 'access'
        AND event_name = 'download'
        AND originating_app_id IS NOT NULL
    {% elif metric == 'collaborators' %}
        AND actor_email = %(person_id)s
        AND event_type = 'acl_change'
        AND event_name = 'change_user_access'
        AND new_value <> 'none'
    {% elif metric == 'filessharedby' %}
        AND actor_email = %(person_id)s
        AND event_type = 'acl_change'
        AND target_user IS NOT NULL
    {% elif metric == 'filessharedwith' %}
        AND target_user = %(person_id)s
        AND event_type = 'acl_change'
    {% elif metric == 'persondownloads' %}
        AND actor_email = %(person_id)s
        AND event_type = 'access'
        AND event_name = 'download'
        AND originating_app_id IS NULL
    {% endif %}
    GROUP BY 1
    {% if metric in ('allactivity', 'all') %}
    {#
        On MySQL, two unioned, index-supported subqueries counting `actor_email` and `target_user`
        occurrences are faster than one with a `WHERE actor_email = … or target_user …` clause.
    #}
    UNION
    SELECT
        id_month AS month,
        COUNT(*) AS count
    FROM admin_reports_v1_drive
    WHERE id_month >= %(start_date)s AND id_month < %(end_date)s
        AND target_user = %(person_id)s
    GROUP BY 1
    {% endif %}
    UNION -- O365 stats
    SELECT
        MONTH(ms_dt_created) AS month,
        COUNT(*) AS count
    FROM
        ms_audit_sharepoint
    WHERE ms_dt_created >= %(start_date)s AND ms_dt_created < %(end_date)s
    {% if metric in ('allactivity', 'all') %}
        AND user_id = %(person_id)s
        OR target_name = %(person_id)s
    {% elif event_category == 'appdownloads' %}
        AND operation IN ( 'FileDownloaded', 'FileSyncDownloadedFull')
        AND record_type IN ('SharePoint', 'SharePointFileOperation')
        AND user_id = %(person_id)s
        AND app_id IS NOT NULL
    {% elif metric == 'persondownloads' %}
        AND operation IN ( 'FileDownloaded', 'FileSyncDownloadedFull')
        AND record_type IN ('SharePoint', 'SharePointFileOperation')
        AND user_id = %(person_id)s
        AND app_id IS NULL
    {% elif metric == 'collaborators' %}
        AND operation IN ('AddedToSecureLink', 'CompanyLinkCreated', 'SecureLinkCreated')
        AND record_type = 'SharePointFileOperation'
        AND user_id = %(person_id)s
    {% elif metric == 'filessharedwith' %}
        AND operation IN ('AddedToSecureLink', 'CompanyLinkCreated', 'SecureLinkCreated', 'CompanyLinkUsed', 'SharingInheritanceBroken', 'SharingSet')
        AND record_type = 'SharePointSharingOperation'
        AND target_name = %(person_id)s
    {% elif metric == 'filessharedby' %}
        AND operation IN ('SharingInheritanceBroken', 'SharingSet')
        AND record_type = 'SharePointSharingOperation'
        AND user_id = %(person_id)s
        AND target_name IS NOT NULL       
    {% endif %}
    GROUP BY 1
) AS stat ON m.month = stat.month
GROUP BY 1
ORDER BY 1
