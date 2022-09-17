-- <external_api:services/get_file_id_permissions/sql/file_permissions_count.sql>
-- calculate permissions_count for permissions associated with a count in `drive_v3_filesmeta`
SELECT
    COUNT(DISTINCT permissions_id) as found_rows
FROM
    drive_v3_filesmeta
WHERE
    file_id = %(file_id)s
    AND (
        permissions_status IS NULL
        OR permissions_status = %(active)s
    )
