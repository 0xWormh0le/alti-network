-- Files associated with a risk for o365 <external_api:services/files/sql/o365/files_base_query.sql>
-- files base query
-- files by risk id
-- at risk files by owner
SELECT DISTINCT
    mdd.ms_id                                                                   AS file_id,
    mdd.name                                                                    AS file_name,
    mdd.created_by_email                                                        AS creator_email,
    mdd.created_by_email                                                        AS creator_profileid,
    UNIX_TIMESTAMP(mdd.ms_dt_created)                                           AS created_at,
    UNIX_TIMESTAMP(mdd.dt_modified)                                             AS last_ingested,
    UNIX_TIMESTAMP(mdd.ms_dt_modified)                                          AS last_modified,
    UNIX_TIMESTAMP(mdd.ms_dt_modified)                                          AS lastModified,
    mdd.file_xor_hash                                                           AS md5checksum,
    NULL AS trashed,
    NULL AS icon_link,
    mdd.web_url AS web_link,
    mdd.file_mime_type                                                          AS file_mimetype,
    pf.symbolic_name                                                            AS platform,
    pf.name                                                                     AS platform_name,
    mdd.parent_id                                                               AS folder_id,
    md.name                                                                     AS folder_name,
    fci.content_tin_count                                                       AS tin_count,
    fci.content_ccn_count                                                       AS ccn_count,
    fci.content_sensitive_kw_counts                                             AS kw_count_data,
    COALESCE(mdd.created_by_email, '')                                          AS creator_email
FROM
    risks_files AS rf
    INNER JOIN ms_drives_docs AS mdd ON rf.file_id = mdd.ms_id
    LEFT JOIN ms_drives_docs AS md ON md.ms_id = mdd.parent_id
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
    LEFT JOIN files_content_inspection AS fci
        ON fci.platform_id = pf.id AND rf.file_id = fci.file_id
WHERE rf.platform_id = pf.id
    AND {{risk_id_predicate}}
    AND {{person_id_predicate}}
GROUP BY 1
ORDER BY {{order}} {{sort}}
LIMIT %(offset)s, %(limit)s
