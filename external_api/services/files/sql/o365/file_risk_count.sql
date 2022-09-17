-- `Files` by risk count query <external_api:services/files/sql/o365/file_risk_count.sql>
SELECT COUNT(DISTINCT mdd.ms_id) AS found_rows
FROM risks_files AS rf
    INNER JOIN ms_drives_docs AS mdd ON rf.file_id = mdd.ms_id
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
WHERE rf.platform_id = pf.id
    AND {{risk_id_predicate}}
    AND {{person_id_predicate}}
