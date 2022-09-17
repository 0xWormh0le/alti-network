SELECT
    symbolic_name
FROM
    top_risks
    LEFT JOIN platform ON top_risks.platform_id = platform.id
WHERE
    risk_id = %(risk_id)s
