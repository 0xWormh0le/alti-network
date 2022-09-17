-- Fetch people associated with a specific application id  <external_api:services/people/sql/o365/people_by_app_id_query.sql>
SELECT DISTINCT
    maa.actor_user_principal_name AS user_email
FROM
    ms_audit_azure_ad AS maa
WHERE
    maa.application_id = %(app_id)s
GROUP BY
    maa.actor_user_principal_name
ORDER BY
    maa.actor_user_principal_name {{sort}}
LIMIT {{offset}}, {{limit}}
