-- Fetch Folder information <external_api:services/folder_id/sql/o365/folder_id_base_query.sql>
SELECT
    (SELECT COUNT(DISTINCT ms_id) FROM ms_drives_docs WHERE parent_id = %(folder_id)s) AS file_count,
    (SELECT name FROM platform WHERE symbolic_name = %(platform)s LIMIT 1) AS platform_name,
    %(platform) s AS platform_id,
    mdd.name AS folder_name,
    mdd.ms_id AS folder_id,
    mdd.parent_id AS parent_folder_id,
    md.name AS parent_folder_name
FROM
    ms_drives_docs AS mdd
    LEFT JOIN ms_drives_docs AS md ON md.ms_id = mdd.parent_id
WHERE mdd.ms_id = %(folder_id)s
    AND mdd.file_mime_type IS NULL
