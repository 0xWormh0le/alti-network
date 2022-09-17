-- Fetch User Information <external_api:external_api/user/sql/gsuite/user_activity_data_query.sql>
SELECT DISTINCT
  %(person_id)s AS email,
  risk.count AS risk_count,
  del.last_removed_permissions AS last_removed_permissions,
  access.count AS access_count
FROM
(
  SELECT
    UNIX_TIMESTAMP(ei.permissions_last_deleted_on_datetime) AS last_removed_permissions
  FROM
    email_identification AS ei
  WHERE
    (
      ei.personal_emailAddress = %(person_id)s
      OR ei.company_emailAddress = %(person_id)s
      AND ei.false_positive = '0'
    )
) AS del
LEFT JOIN (
  SELECT
    COUNT(DISTINCT risk_id) AS count,
    %(person_id)s AS email
  FROM
    risks_files AS rf
  WHERE rf.platform_id = 1
    AND rf.permissions_emailAddress = %(person_id)s
    OR rf.owners_emailAddress = %(person_id)s
) risk ON risk.email = %(person_id)s
LEFT JOIN(
  SELECT
    COUNT(DISTINCT df.file_id) AS count,
    %(person_id)s AS email
  FROM
    drive_v3_filesmeta AS df
  WHERE
    df.owners_emailaddress = %(person_id)s
    OR df.permissions_emailaddress = %(person_id)s
) access ON access.email = %(person_id)s
GROUP BY 1, 2
ORDER BY 1 DESC
