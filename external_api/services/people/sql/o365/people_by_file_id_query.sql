-- Fetch people associated with a specific file id  <external_api:services/people/sql/o365/people_by_file_id_query.sql>
SELECT DISTINCT
    mdp.granted_to_email AS user_email
FROM
    ms_drives_docs_permissions AS mdp
WHERE
    mdp.ms_doc_id = %(file_id)s
GROUP BY
    mdp.granted_to_email
ORDER BY
    mdp.granted_to_email {{sort}}
LIMIT {{offset}}, {{limit}}
