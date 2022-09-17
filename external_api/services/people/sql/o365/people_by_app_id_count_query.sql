-- Fetch people by app id count query <external_api:services/people/sql/o365/people_by_app_id_count_query.sql>
SELECT COUNT(DISTINCT app_id) AS found_rows
FROM ms_applications
WHERE app_id = %(app_id)s
