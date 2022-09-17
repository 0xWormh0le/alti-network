-- risks count query query <external_api:services/risks/sql/gsuite/risks_count_query.sql>
SELECT COUNT(DISTINCT r.risk_id) AS found_rows
FROM
    top_risks AS r
    LEFT JOIN risks_files AS rf USING (risk_id, file_id)
    LEFT JOIN files_content_inspection AS fci ON fci.platform_id = 1
    AND rf.file_id = fci.file_id
WHERE (r.status IS NULL OR r.status = 'active')
    AND r.platform_id = 1
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
