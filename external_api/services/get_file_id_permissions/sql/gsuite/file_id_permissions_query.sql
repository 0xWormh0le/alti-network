-- <external_api:services/get_file_id_permissions/sql/file_id_permissions_query.sql>
-- Fetch file permissions which are maked as active or unresolved in `drive_v3_filesmeta`
SELECT DISTINCT
    df.permissions_id,
    pf.name AS platform_name,
    %(platform)s AS platform,
    df.permissions_type AS type,
    df.permissions_emailaddress,
    df.permissions_role,
    df.permissions_allowFileDiscovery AS discoverable,
    df.permissions_email_domain AS shared_meta
FROM drive_v3_filesmeta AS df
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
WHERE df.file_id = %(file_id)s
    AND (df.permissions_status IS NULL OR df.permissions_status = %(active)s)
GROUP BY permissions_id
ORDER BY {{order}} {{sort}}
LIMIT %(offset)s, %(limit)s
