-- risks base query <external_api:services/risks/sql/gsuite/risks_base_query.sql>
-- The sensitive phrases counts are only returned for risk records that have a file_id or file count of 1
SELECT DISTINCT
    risk.risk_id,
    risk.risk_type_id,
    UNIX_TIMESTAMP(risk.datetime) AS datetime,
    'read' AS user_kind,
    'avatar' AS avatar,
    risk.severity,
    risk.platform,
    risk.risk_description,
    risk.risk_person_id,
    risk.file_count,
    risk.file_id,
    risk.tin_count,
    risk.ccn_count,
    risk.kw_count_data,
    md.name AS file_name,
    md.created_by_display_name AS owners_displayName,
    md.file_mime_type AS file_mimetype,
    md.web_url AS web_link,
    COALESCE(risk.owners_emailAddress, md.created_by_email) AS owners_emailaddress,
    risk.risk_target,
    CASE WHEN risk.risk_type_id = 3010 THEN  -- 3010 currently is the only app-based risk type.
        (SELECT display_name FROM ms_applications WHERE app_id = risk.risk_target LIMIT 1)
    END AS risk_target_name
FROM
(
    SELECT
        r.risk_type_id,
        r.risk_id,
        r.dt_created AS datetime,
        r.severity,
        r.risk_target,
        r.risk_person_id,
        r.risk_description,
        r.file_count,
        r.file_id,
        pf.symbolic_name AS platform,
        rf.owners_emailAddress,
        fci.content_tin_count AS tin_count,
        fci.content_ccn_count AS ccn_count,
        fci.content_sensitive_kw_counts AS kw_count_data
    FROM top_risks AS r
        LEFT JOIN risks_files AS rf USING (risk_id, file_id)
        LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
        LEFT JOIN files_content_inspection AS fci
            ON fci.platform_id = pf.id AND rf.file_id = fci.file_id
    WHERE (r.status IS NULL OR r.status = 'active')
        AND r.platform_id = 2
        {% if severity is not none %} AND r.severity >= %(severity)s {% endif %}
        {% if app_id is not none %} AND r.risk_target = %(app_id)s {% endif %}
        {% if risk_type_ids %} AND r.risk_type_id in %(risk_type_ids)s {% endif %}
        {% if creator_id is not none %} AND r.risk_person_id = %(creator_id)s {% endif %}
        {% if person_id is not none %}
            AND (
                r.risk_person_id = %(person_id)s
                OR r.risk_target = %(person_id)s
                OR rf.permissions_emailAddress = %(person_id)s
                OR rf.owners_emailAddress = %(person_id)s
            )
        {% endif %}
        {% if sensitive_content %}
          AND (
            fci.content_tin_count > 0
            OR fci.content_ccn_count > 0
            OR fci.content_sensitive_kw_counts != "[]"
          )
        {% endif %}
    ORDER BY {{order}} {{sort}}
    LIMIT %(offset)s, %(limit)s
) AS risk
LEFT JOIN ms_drives_docs AS md ON md.ms_id = risk.file_id
ORDER BY {{order}} {{sort}}
