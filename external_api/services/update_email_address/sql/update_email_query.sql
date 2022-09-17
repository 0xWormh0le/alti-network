-- update email_identification with email status and permissions last deleted
UPDATE email_identification AS ei
SET
	ei.status = %(new_status)s,
	ei.permissions_last_deleted_on_datetime = CURRENT_TIMESTAMP
WHERE ei.personal_emailAddress = %(email)s
	OR ei.company_emailAddress = %(email)s
