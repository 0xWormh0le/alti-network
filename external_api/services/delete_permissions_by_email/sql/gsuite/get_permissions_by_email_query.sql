-- Gsuite get permissions by email <external_api: services/delete_permissions_by_email/sql/gsuite/get_permissions_by_email_query.sql>
SELECT DISTINCT
    permissions_id,
    file_id,
    permissions_emailAddress as permission_email,
    owners_emailAddress as owner_email
FROM
     drive_v3_filesmeta
WHERE
    permissions_emailAddress = %(email)s
    AND permissions_role <> 'owner'
    AND (
        permissions_status IS NULL
        OR permissions_status = %(active)s
    )
