-- Fetch people associated with a specific risk id  <external_api:services/people/sql/gsuite/people_base_query.sql>
SELECT
    f.permissions_emailAddress as user_email
FROM
    (SELECT DISTINCT file_id FROM risks_files WHERE risk_id = %(risk_id)s) AS risk
    LEFT JOIN drive_v3_filesmeta AS f
        ON risk.file_id = f.file_id
{% if domain == "internal" %}
WHERE f.permissions_email_domain IN %(domains)s
{% elif domain == "external" %}
WHERE f.permissions_email_domain NOT IN %(domains)s
{% endif %}
GROUP BY f.permissions_emailAddress
ORDER BY f.permissions_emailAddress {{sort}}
LIMIT {{offset}}, {{limit}}
