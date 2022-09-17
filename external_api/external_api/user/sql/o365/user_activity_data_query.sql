-- Fetch User Activity Information <external_api:external_api/user/sql/o365/user_activity_data_query.sql>
SELECT DISTINCT
  risk.email,
  risk.count AS risk_count,
  -- TODO: UPDATED after https://altitudenetworks.atlassian.net/browse/ENG-602
  0 AS last_removed_permissions, -- EMAIL IDENTIFICATION DOESN'T EXIST FOR O365
  access.count AS access_count
FROM
(
  SELECT
    COUNT(DISTINCT risk_id) AS count,
    %(person_id)s AS email
  FROM
    risks_files AS rf
  WHERE rf.platform_id = 2
    AND rf.permissions_emailAddress = %(person_id)s
    OR rf.owners_emailAddress = %(person_id)s
) risk
LEFT JOIN(
  SELECT
    COUNT(DISTINCT mdp.ms_doc_id) AS count,
    %(person_id)s AS email
  FROM
    ms_drives_docs AS mdd
    LEFT JOIN ms_drives_docs_permissions AS mdp ON mdp.ms_doc_id = mdd.ms_id
  WHERE
    mdd.created_by_email = %(person_id)s
    OR mdp.granted_to_email = %(person_id)s
) access ON access.email = %(person_id)s
GROUP BY 1, 2
ORDER BY 1 DESC
