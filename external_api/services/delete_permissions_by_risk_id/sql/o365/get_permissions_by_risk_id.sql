-- get permission associated to a risk <external_api:services/delete_permissions_by_risk_id/sql/o365/get_permissions_by_risk_id.sql>
SELECT
    rf.permissions_id,
    rf.file_id,
    rf.permissions_emailAddress AS permission_email
FROM
    risks_files AS rf
    INNER JOIN ms_drives_docs_permissions AS permissions
        ON (rf.permissions_id = permissions.an_permission_id AND rf.file_id = permissions.ms_doc_id)
WHERE
    rf.risk_id = %(risk_id)s
    AND (permissions.permission_status <> %(status)s OR permissions.permission_status is Null)
