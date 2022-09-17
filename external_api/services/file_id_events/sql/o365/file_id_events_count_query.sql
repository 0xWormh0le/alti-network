-- /file/id/events count query <external_api:services/file_id_events/sql/o365/file_id_events_query.sql>
SELECT COUNT(DISTINCT ms_id) AS found_rows
FROM ms_audit_sharepoint
WHERE ms_doc_id = %(file_id)s
