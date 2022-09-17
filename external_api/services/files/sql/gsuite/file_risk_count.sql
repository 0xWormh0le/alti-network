-- calculate file_count from risks_files and drive_v3_filesmeta tables.
SELECT COUNT(DISTINCT df.file_id) AS found_rows
FROM risks_files AS rf
    INNER JOIN drive_v3_filesmeta AS df ON rf.file_id = df.file_id
    LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
WHERE platform_id = pf.id
    AND {{risk_id_predicate}}
    AND {{person_id_predicate}}
