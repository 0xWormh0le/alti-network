-- `get_permissions_status` API endpoint <external_api:services/get_permissions_status/sql/o365/last_email_deleted_query.sql>
-- Note: Query verifies if personal email address was deleted in the last 24 hours
--      Also, we need to factor in the changes for deleting permissions from o365 platforms
SELECT
    CASE
        WHEN ei.permissions_last_deleted_on_datetime >= (NOW() - INTERVAL 1 DAY) THEN TRUE
        ELSE FALSE
    END AS deleted
FROM email_identification AS ei
    LEFT JOIN platform AS pf ON pf.symbolic_name = 'o365'
WHERE personal_emailAddress = %(email)s
    AND pf.id = ei.platform_id
