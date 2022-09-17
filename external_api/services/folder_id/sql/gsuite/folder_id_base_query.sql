-- Fetch Folder information <external_api:services/folder_id/sql/gsuite/folder_id_base_query.sql>
SELECT
    (SELECT COUNT(DISTINCT file_id) FROM drive_v3_filesmeta WHERE parents_list = %(folder_id)s) AS file_count,
    (SELECT name FROM platform WHERE symbolic_name = %(platform)s LIMIT 1) AS platform_name,
    %(platform)s AS platform_id,
    df.file_name AS folder_name,
    df.file_id AS folder_id,
    df.parents_list AS parent_folder_id,
    (SELECT DISTINCT file_name FROM drive_v3_filesmeta WHERE file_id = df.parents_list LIMIT 1) AS parent_folder_name
FROM
    drive_v3_filesmeta AS df
WHERE df.file_id = %(folder_id)s
    AND df.file_mimeType = "application/vnd.google-apps.folder"
