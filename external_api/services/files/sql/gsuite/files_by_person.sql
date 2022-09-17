-- Files associated with a person_id <external_api:services/files/sql/gsuite/files_by_person.sql>
-- files by person id
-- files by owner
SELECT DISTINCT
    fil.file_id,
    fil.file_name,
    fil.platform_name,
    fil.platform,
    fil.created_at,
    fil.last_ingested,
    fil.last_modified,
    fil.icon_link,
    fil.web_link,
    fil.file_mimetype,
    fil.folder_id,
    fil.folder_name,
    fil.trashed,
    fil.tin_count,
    fil.ccn_count,
    fil.kw_count_data,
    fil.creator_email
FROM
(
    SELECT
        df.file_id,
        df.file_name,
        UNIX_TIMESTAMP(df.createdTime) AS created_at,
        UNIX_TIMESTAMP(df.dt_modified) AS last_ingested,
        UNIX_TIMESTAMP(df.modifiedTime) AS last_modified,
        UNIX_TIMESTAMP(df.modifiedTime) AS lastModified,
        df.webViewLink AS web_link,
        df.iconLink AS icon_link,
        df.file_mimeType AS file_mimetype,
        df.parents_list AS folder_id,
        pf.name AS platform_name,
        pf.symbolic_name AS platform,
        (SELECT file_name FROM drive_v3_filesmeta WHERE file_id = df.parents_list LIMIT 1) AS folder_name,
        df.trashed,
        COALESCE(df.owners_emailAddress, '') AS creator_email,
        fci.content_tin_count AS tin_count,
        fci.content_ccn_count AS ccn_count,
        fci.content_sensitive_kw_counts AS kw_count_data
    FROM
    (
        SELECT file_id, max(modifiedTime) AS lastModified
        FROM drive_v3_filesmeta
        WHERE owners_emailAddress = %(person_id)s
        GROUP BY 1
        UNION
        SELECT file_id, max(modifiedTime) AS lastModified
        FROM drive_v3_filesmeta
        WHERE permissions_emailAddress = %(person_id)s
        GROUP BY 1
        ORDER BY {{order}} {{sort}}
        LIMIT %(limit)s OFFSET %(offset)s
    ) AS f_id
    INNER JOIN drive_v3_filesmeta AS df USING (file_id)
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
    LEFT JOIN files_content_inspection AS fci ON fci.platform_id = pf.id
    AND fci.file_id = df.file_id
) AS fil
