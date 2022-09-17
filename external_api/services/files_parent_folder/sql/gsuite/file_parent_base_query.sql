-- Fetches all files found in a parent folder for gsuite <external_api:services/files_parent_folder/sql/gsuite/files_parent_base_query.sql>
SELECT DISTINCT
    df.file_id,
    df.file_name,
    df.trashed,
    pf.symbolic_name AS platform,
    pf.name AS platform_name,
    (SELECT file_name FROM drive_v3_filesmeta WHERE file_id = df.parents_list LIMIT 1) AS folder_name,
    df.parents_list                                                            AS folder_id,
    fci.content_tin_count                                                      AS tin_count,
    fci.content_ccn_count                                                      AS ccn_count,
    fci.content_sensitive_kw_counts                                            AS kw_count_data,
    UNIX_TIMESTAMP(df.createdTime)                                             AS created_at,
    UNIX_TIMESTAMP(df.dt_modified)                                             AS last_ingested,
    UNIX_TIMESTAMP(MAX(df.modifiedTime))                                       AS last_modified,
    df.md5Checksum                                                             AS md5checksum,
    df.webViewLink                                                             AS web_link,
    df.iconLink                                                                AS icon_link,
    df.file_mimeType                                                           AS file_mimetype,
    COALESCE(df.owners_emailAddress, '')                                       AS creator_email,
    SUBSTRING_INDEX(SUBSTRING_INDEX(df.owners_displayName, ' ', 1), ' ', -1)   AS creator_firstname,
    SUBSTRING_INDEX(SUBSTRING_INDEX(df.owners_displayName, ' ', 2), ' ', -1)   AS creator_lastname
FROM drive_v3_filesmeta AS df
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
    LEFT JOIN files_content_inspection AS fci ON fci.platform_id = pf.id
    AND fci.file_id = df.file_id
WHERE df.parents_list = %(parent_id)s
GROUP BY 1
ORDER BY {{order}} {{sort}}
LIMIT %(offset)s, %(limit)s
