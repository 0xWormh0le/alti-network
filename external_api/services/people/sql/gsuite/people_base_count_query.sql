-- Fetch people count associated with a specific risk id  <external_api:services/people/sql/gsuite/people_base_count_query.sql>
SELECT COUNT(DISTINCT f.permissions_emailAddress) AS row_count
FROM
    risks_files AS rf
    LEFT JOIN drive_v3_filesmeta as f  USING (file_id)
WHERE
    risk_id = %(risk_id)s
{%if domain == "internal" %}
    AND f.permissions_email_domain IN %(domains)s
{% elif domain == "external" %}
    AND f.permissions_email_domain NOT IN %(domains)s
{% endif %}
