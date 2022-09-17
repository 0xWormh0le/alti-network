-- `get_permissions_status` API endpoint <external_api:services/get_permissions_status/sql/gsuite/permissions_status_by_email_query.sql>
-- Note: Fetch permissions associated with a email
SELECT
    COUNT(DISTINCT permissions_id) AS total_count,
    permissions_status AS status
FROM drive_v3_filesmeta
WHERE permissions_emailAddress = %(email)s
    AND permissions_role <> 'owner'
GROUP BY permissions_status
