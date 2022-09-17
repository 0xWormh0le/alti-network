-- Fetch file metadata for risks tiles <external_api:services/risks_tiles/sql/o365/risk_tile_file_info.sql>
SELECT
    mdd.ms_id AS file_id,
    mdd.name AS file_name,
    md.name AS folder_name,
    mdd.created_by_email AS owner_email,
    UNIX_TIMESTAMP(mdd.ms_dt_created) AS dt_created,
    UNIX_TIMESTAMP(mdd.ms_dt_modified) AS dt_modified,
    mdd.file_mime_type AS file_mimetype,
    NULL AS icon_link,
    mdd.web_url AS web_link,
    pf.symbolic_name AS platform,
    pf.name AS platform_name
FROM
    ms_drives_docs AS mdd
    INNER JOIN platform AS pf ON symbolic_name = %(platform)s
WHERE
    mdd.ms_id = %(file_id)s
