-- Mark a specific permission as removed in `drive_v3_filesmeta` <external_api:services/delete_permission_id/sql/update_permissions_query.sql>
UPDATE drive_v3_filesmeta
SET
	permissions_status = %(status)s
WHERE
	permissions_id = %(permission_id)s
	AND file_id = %(file_id)s
