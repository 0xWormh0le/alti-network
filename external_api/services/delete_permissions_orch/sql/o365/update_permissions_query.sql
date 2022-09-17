-- Update Permissions status <external_api:services/delete_permissions_orch/sql/o365/update_permissions_query.sql>
UPDATE ms_drives_docs_permissions
SET
    permission_status = %(status)s
WHERE
    an_permission_id in %(permission_ids)s
    AND ms_doc_id in %(file_ids)s
