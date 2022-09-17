-- Fetches all files present in  a parent folder for o365 <external_api:services/files_parent_folder/sql/o365/files_parent_base_query.sql>
SELECT DISTINCT
    mdd.ms_id AS file_id,
    mdd.name AS file_name,
    NULL trashed,
    NULL AS icon_link,
    mdd.web_url AS web_link,
    pf.symbolic_name AS platform,
    pf.name AS platform_name,
    fci.content_tin_count AS tin_count,
    fci.content_ccn_count AS ccn_count,
    fci.content_sensitive_kw_counts AS kw_count_data,
    UNIX_TIMESTAMP(mdd.ms_dt_created) AS created_at,
    UNIX_TIMESTAMP(mdd.dt_modified) AS last_ingested,
    UNIX_TIMESTAMP(mdd.ms_dt_modified) AS last_modified,
    mdd.file_mime_type AS file_mimetype,
    mdd.created_by_email AS creator_email,
    mdd.file_xor_hash AS md5checksum,
    md.name AS folder_name,
    mdd.parent_id AS folder_id
FROM ms_drives_docs AS mdd
    INNER JOIN ms_drives_docs AS md ON md.ms_id = mdd.parent_id
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
    LEFT JOIN files_content_inspection AS fci ON fci.platform_id = pf.id
    AND fci.file_id = mdd.ms_id
WHERE mdd.parent_id = %(parent_id)s
GROUP BY 1
ORDER BY {{order}} {{sort}}
LIMIT %(offset)s, %(limit)s
