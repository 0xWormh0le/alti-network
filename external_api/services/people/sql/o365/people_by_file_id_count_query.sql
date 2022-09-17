-- Fetch number of people related to a specific file id <external_api:services/people/sql/o365/people_by_file_id_count_query.sql>
SELECT
    COUNT(DISTINCT mdp.granted_to_email) AS found_rows
FROM
    ms_drives_docs_permissions AS mdp
WHERE
    mdp.ms_doc_id = %(file_id)s
