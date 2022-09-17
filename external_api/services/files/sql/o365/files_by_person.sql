-- Files associated with a person_id <external_api:services/files/sql/o365/files_by_person.sql>
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
        mdd.ms_id AS file_id,
        mdd.name AS file_name,
        mdd.created_by_email AS creator_email,
        fci.content_tin_count AS tin_count,
        fci.content_ccn_count AS ccn_count,
        fci.content_sensitive_kw_counts AS kw_count_data,
        UNIX_TIMESTAMP(mdd.ms_dt_created) AS created_at,
        UNIX_TIMESTAMP(mdd.dt_modified) AS last_ingested,
        UNIX_TIMESTAMP(mdd.ms_dt_modified) AS last_modified,
        UNIX_TIMESTAMP(mdd.ms_dt_modified) AS lastModified,
        mdd.file_xor_hash AS md5checksum,
        NULL AS trashed,
        NULL AS icon_link,
        mdd.web_url AS web_link,
        mdd.file_mime_type AS file_mimetype,
        mdd.parent_id AS folder_id,
        md.name AS folder_name,
        pf.name AS platform_name,
        pf.symbolic_name AS platform
    FROM
    (
        SELECT ms_id, MAX(ms_dt_modified) AS lastModified
        FROM ms_drives_docs
        WHERE created_by_email = %(person_id)s
        GROUP BY 1
        UNION
        SELECT ms_doc_id AS ms_id, MAX(dt_modified) AS lastModified
        FROM ms_drives_docs_permissions
        WHERE granted_to_email = %(person_id)s
        GROUP BY 1
        ORDER BY {{order}} {{sort}}
        LIMIT %(limit)s OFFSET %(offset)s
    ) AS f_id
    INNER JOIN ms_drives_docs AS mdd USING (ms_id)
    LEFT JOIN ms_drives_docs AS md ON md.ms_id = mdd.parent_id
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
    LEFT JOIN files_content_inspection AS fci ON fci.platform_id = pf.id
    AND fci.file_id = mdd.ms_id
) AS fil
GROUP BY 1
ORDER BY {{order}} {{sort}}
