-- Fetch people associated with a specific application id  <external_api:services/people/sql/gsuite/people_by_app_id_query.sql>
SELECT DISTINCT
    ard.actor_email AS user_email
FROM
    admin_reports_v1_drive AS ard
WHERE
    ard.originating_app_id = %(app_id)s
GROUP BY
    ard.actor_email
ORDER BY
    ard.actor_email {{sort}}
LIMIT {{offset}}, {{limit}}
