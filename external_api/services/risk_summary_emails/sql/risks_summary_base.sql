-- <external_api:services/risk_summary_emails/sql/risks_summary_base.sql>
-- Note: Fetches categories with the created risks statistic in the past day.
-- Note: This Query fetches the stat metrics statistics for the following risk-type-ids [1021, 1011, 2002, 3100].
SELECT
    category.risk_count,
    category.risk_type_id,
    category.severity,
    category.risk_desc,
    (SELECT COUNT(DISTINCT risk_id) FROM top_risks WHERE (dt_created > %(yesterday)s) AND (status IS NULL OR status = 'active')) AS risks_created
FROM (
    SELECT
        risk_type_id,
        COUNT(DISTINCT risk_id) AS risk_count,
        SUBSTRING_INDEX( GROUP_CONCAT(DISTINCT risk_description ORDER BY risk_incident_date DESC SEPARATOR '|'), '|', 1) AS risk_desc,
        MAX(severity) AS severity,
        DATE(risk_incident_date) AS incident_date
    FROM
        top_risks
    WHERE (status IS NULL OR status = 'active')
    GROUP BY 1
) AS category
ORDER BY 1 DESC
