-- Fetch file permissions which are marked as pending, active or unresolved in `drive_v3_filesmeta` <external_api:services/update_email_address/sql/get_pending_permissions.sql>
SELECT DISTINCT
	permissions_id,
	file_id,
	owners_emailAddress as owner_email
FROM drive_v3_filesmeta
WHERE permissions_emailAddress = %(email)s
AND ( permissions_status IS NULL 
	OR permissions_status = %(active)s
	OR permissions_status = %(pending)s
)
