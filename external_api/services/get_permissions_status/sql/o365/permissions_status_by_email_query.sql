-- `get_permissions_status` API endpoint <external_api:services/get_permissions_status/sql/o365/permissions_status_by_email_query.sql>
-- Note: Fetch permissions associated with a email
SELECT
    COUNT(DISTINCT mdp.an_permission_id) AS total_count,
    mdp.permission_status AS status
FROM ms_drives_docs_permissions AS mdp
WHERE mdp.granted_to_email = %(email)s
    AND mdp.granted_to_type = 'user'
    AND mdp.roles <> 'owner'
GROUP BY mdp.permission_status
