-- risks stats base query
SELECT
	COUNT(DISTINCT risk_id) AS risk_count,
	severity,
	risk_type_id
FROM top_risks
WHERE status IS NULL OR status = 'active'
GROUP BY risk_type_id, severity
