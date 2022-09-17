UPDATE top_risks 
SET 
	status = %(new_status)s
WHERE
	risk_id = %(risk_id)s
