-- Fetch number of people related to a specific file id <external_api:services/people/sql/gsuite/people_by_file_id_count_query.sql>
SELECT COUNT(DISTINCT permissions_emailAddress) AS found_rows
FROM drive_v3_filesmeta
WHERE file_id = %(file_id)s
