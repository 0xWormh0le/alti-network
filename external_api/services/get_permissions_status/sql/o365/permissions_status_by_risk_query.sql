-- `get_permissions_status` API endpoint <external_api:services/get_permissions_status/sql/o365/permissions_status_by_risk_query.sql>
-- Note: Fetch permissions associated with a risk-id
SELECT
    COUNT(DISTINCT rf.permissions_id) AS total_count,
    mdp.permission_status AS status
FROM risks_files AS rf
    LEFT JOIN ms_drives_docs_permissions AS mdp
        ON mdp.ms_doc_id = rf.file_id AND mdp.an_permission_id = rf.permissions_id
WHERE rf.risk_id = %(risk_id)s
    AND mdp.granted_to_type = 'user'
    AND mdp.roles <> 'owner'
GROUP BY mdp.permission_status
