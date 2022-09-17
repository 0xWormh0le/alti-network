-- Fetch people associated with a specific file id  <external_api:services/people/sql/gsuite/people_by_file_id_query.sql>
SELECT DISTINCT
    df.permissions_emailAddress AS user_email
FROM
    drive_v3_filesmeta AS df
WHERE
    df.file_id = %(file_id)s
GROUP BY
    df.permissions_emailAddress
ORDER BY
    df.permissions_emailAddress {{sort}}
LIMIT {{offset}}, {{limit}}
