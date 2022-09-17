-- `Files` peron count query <external_api:services/files/sql/o365/file_person_count.sql>
SELECT COUNT(DISTINCT mdp.ms_id) as found_rows
FROM
    ms_drives_docs AS mdd
    LEFT JOIN ms_drives_docs_permissions AS mdp
        ON mdp.ms_doc_id = mdd.ms_id
WHERE mdd.created_by_email = %(person_id)s
    OR mdp.granted_to_email = %(person_id)s
