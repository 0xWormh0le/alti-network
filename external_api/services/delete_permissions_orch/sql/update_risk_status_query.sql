-- <external_api: services/delete_permissions_orch/sql/update_risk_status_query.sql>
UPDATE top_risks
SET
    status = %(status)s
WHERE
    risk_id = %(risk_id)s
