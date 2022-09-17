-- `get_permissions_status` API endpoint <external_api:services/get_permissions_status/sql/gsuite/permissions_status_by_risk_query.sql>
-- Note: Fetch permissions associated with a risk-id
SELECT
    COUNT(DISTINCT rf.permissions_id) AS total_count,
    df.permissions_status AS status
FROM risks_files AS rf
    LEFT JOIN drive_v3_filesmeta AS df USING (file_id, permissions_id)
WHERE rf.risk_id = %(risk_id)s
    AND df.permissions_role <> 'owner'
GROUP BY df.permissions_status
