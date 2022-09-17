SELECT
	DISTINCT owners_emailAddress as owner_email
FROM drive_v3_filesmeta
WHERE file_id = %(file_id)s
