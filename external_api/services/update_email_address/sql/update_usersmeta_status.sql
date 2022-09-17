-- update admin_directory_users meta table with email status
UPDATE admin_directory_v1_usersmeta AS adu
SET
	adu.status = %(new_status)s
WHERE adu.emails_address = %(email)s
