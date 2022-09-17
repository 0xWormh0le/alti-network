-- Fetch people count associated with a specific risk id  <external_api:services/people/sql/o365/people_base_count_query.sql>
SELECT COUNT(DISTINCT mdp.granted_to_email) AS row_count
FROM
    risks_files AS rf
    LEFT JOIN ms_drives_docs_permissions AS mdp ON mdp.ms_doc_id = rf.file_id
WHERE
    rf.risk_id = %(risk_id)s
{% if domain == "internal" %}
    AND mdp.granted_to_email_domain IN %(domains)s
{% elif domain == "external" %}
    AND mdp.granted_to_email_domain NOT IN %(domains)s
{% endif %}
