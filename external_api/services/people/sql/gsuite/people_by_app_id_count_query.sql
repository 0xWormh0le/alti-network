-- Fetch people by app id count query <external_api:services/people/sql/gsuite/people_by_app_id_count_query.sql>
SELECT COUNT(DISTINCT actor_email) AS found_rows
FROM admin_reports_v1_drive
WHERE originating_app_id = %(app_id)s
