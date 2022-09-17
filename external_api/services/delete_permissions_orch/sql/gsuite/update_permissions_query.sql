-- Mark all file permissions as pending in `drive_v3_filesmeta` <external_api:services/delete_permissions_orch/sql/gsuite/update_permissions_query.sql>
UPDATE drive_v3_filesmeta
SET
  permissions_status = %(status)s
WHERE
    permissions_id in %(permission_ids)s
	AND file_id in %(file_ids)s
