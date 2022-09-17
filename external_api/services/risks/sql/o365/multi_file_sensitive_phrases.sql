-- get sensitive file information for multi file risks <external_api:services/risks/sql/o365/multi_file_sensitive_phrases.sql>
SELECT DISTINCT
    rf.file_id,
    fci.content_tin_count AS tin_count,
    fci.content_ccn_count AS ccn_count,
    fci.content_sensitive_kw_counts AS kw_count_data
FROM
    risks_files AS rf
    LEFT JOIN files_content_inspection AS fci
        ON fci.platform_id = 2 and rf.file_id = fci.file_id
WHERE
    risk_id = %(risk_id)s
