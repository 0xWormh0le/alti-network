-- get permission associated to a risk <external_api:services/delete_permissions_by_risk_id/sql/gsuite/get_permissions_by_risk_id.sql>
SELECT
    rf.permissions_id,
    rf.file_id,
    rf.permissions_emailAddress AS permission_email,
    rf.owners_emailAddress AS owner_email
FROM
    risks_files AS rf INNER JOIN drive_v3_filesmeta AS fm USING (permissions_id, file_id)
WHERE
    rf.risk_id = %(risk_id)s
    AND (fm.permissions_status <> %(status)s OR fm.permissions_status is Null)
