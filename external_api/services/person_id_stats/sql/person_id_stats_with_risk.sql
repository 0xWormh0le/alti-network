-- `/person/id/stats` API endpoint <external_api:services/person_id_stats/sql/person_id_stats_with_risk.sql>
-- Note: This query fetches person stats with calling the top_risks table.
SELECT
    UNIX_TIMESTAMP(m.month) as month,
    COALESCE(stat.count, 0) AS count
FROM (
    SELECT
        date_sub(
            date_sub(CURRENT_DATE, INTERVAL day(CURRENT_DATE) - 1 DAY),
            INTERVAL n MONTH
        ) AS month
    FROM
        series
    WHERE n >= 0 AND n <= 12
) AS m
LEFT JOIN (
    SELECT
        MONTH(rf.dt_created) AS month,
        {% if metric == 'atriskfilesowned' %}
        COUNT(DISTINCT rf.file_id) AS count
        {% else %}
        COUNT(DISTINCT rf.risk_id) AS count
        {% endif %}
    FROM
        top_risks AS r
        LEFT JOIN risks_files AS rf USING (risk_id)
    WHERE
        rf.dt_created >= %(start_date)s
        AND rf.dt_created < %(end_date)s
    {% if metric == 'atriskfilesowned' %}
        AND rf.owners_emailAddress = %(person_id)s
    {% elif metric == 'risks' %}
        AND (
            rf.permissions_emailAddress = %(person_id)s
            OR rf.owners_emailAddress = %(person_id)s
        )
    {% elif metric == 'riskscreated' %}
        AND r.risk_person_id = %(person_id)s
    {% endif %}
) AS stat ON m.month = stat.month
ORDER BY 1 DESC
