-- /file/id/events count query <external_api:services/file_id_events/sql/file_id_events_count_query.sql>
SELECT COUNT(DISTINCT id_uniqueQualifier) AS found_rows
FROM admin_reports_v1_drive
WHERE doc_id = %(file_id)s
