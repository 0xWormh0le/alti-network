-- <external_api:services/get_file_id_permissions/sql/o365/file_id_permissions_query.sql>
SELECT DISTINCT
    an_permission_id AS permissions_id,
    platform.name AS platform_name,
    %(platform)s AS platform,
    granted_to_type AS type,
    granted_to_email AS permissions_emailaddress,
    roles AS permissions_role,
    NULL AS discoverable,
    granted_to_email_domain AS shared_meta
FROM ms_drives_docs_permissions
    LEFT JOIN platform ON platform.symbolic_name = %(platform)s
WHERE ms_doc_id = %(file_id)s
GROUP BY 1
ORDER BY {{order}} {{sort}}
LIMIT %(offset)s, %(limit)s
