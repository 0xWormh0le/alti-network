-- <external_api:services/get_file_id_permissions/sql/o365/file_permissions_count.sql>
SELECT
    COUNT(DISTINCT an_permission_id) as found_rows
FROM
    ms_drives_docs_permissions
WHERE
    ms_doc_id = %(file_id)s
