-- Fetch file metadata for risks tiles <external_api:services/risks_tiles/sql/gsuite/risk_tile_file_info.sql>
SELECT DISTINCT
    df.file_id,
    df.file_name,
    UNIX_TIMESTAMP(df.dt_created) AS dt_created,
    UNIX_TIMESTAMP(df.dt_modified) AS dt_modified,
    df.owners_emailAddress as owner_email,
    df.file_mimeType AS file_mimetype,
    df.webViewLink AS web_link,
    df.iconLink AS icon_link,
    pf.symbolic_name AS platform,
    pf.name AS platform_name
FROM
    drive_v3_filesmeta AS df
    INNER JOIN platform AS pf ON symbolic_name = %(platform)s
WHERE df.file_id = %(file_id)s
