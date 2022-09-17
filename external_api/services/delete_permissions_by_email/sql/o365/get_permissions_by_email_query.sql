-- MS O365 get permissions by email <external_api:services/delete_permissions_by_email/sql/o365/get_permissions_by_email_query.sql>
select
    ms_doc_id AS file_id,
    an_permission_id AS permissions_id,
    granted_to_email AS permission_email
FROM
    ms_drives_docs_permissions
WHERE
    granted_to_email = %(email)s
    AND (
        permission_status IS NULL
        OR permission_status = %(active)s
        )
