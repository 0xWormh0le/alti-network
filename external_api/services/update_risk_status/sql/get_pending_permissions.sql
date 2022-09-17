-- Fetch file permissions which are marked as pending, active or null in `drive_v3_filesmeta` <external_api:services/update_risk_status/sql/get_pending_permissions.sql>
SELECT DISTINCT
	rf.file_id,
	df.owners_emailAddress AS owner_email,
	df.permissions_id
FROM top_risks AS r
    LEFT JOIN risks_files AS rf USING (risk_id)
    LEFT JOIN drive_v3_filesmeta AS df ON rf.file_id = df.file_id
WHERE r.risk_id = %(risk_id)s
	AND (r.status is NULL OR r.status = 'active' OR r.status = 'pending')
	AND ( df.permissions_status IS NULL
		OR df.permissions_status = 'active'
		OR df.permissions_status = 'pending'
	)
