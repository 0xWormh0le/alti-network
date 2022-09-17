-- /file/id/events base query <external_api:services/file_id_events/sql/o365/file_id_events_query.sql>
-- Event categories are explained here: https://docs.google.com/spreadsheets/d/1JxNzAULd2FrixvUmx170q5yNDRa4y1-r_TH45CNC5eQ/edit#gid=0
SELECT
    base.event_id,
    base.event_name,
    base.event_type,
    base.event_description,
    base.file_id,
    base.file_name,
    base.ipaddress,
    base.actor_email,
    base.target_email,
    base.creator_email,
    base.old_value,
    base.new_value,
    UNIX_TIMESTAMP(base.datetime) AS datetime,
    (SELECT name FROM platform WHERE symbolic_name = %(platform)s LIMIT 1) AS platform_name,
    %(platform)s AS platform,
    NULL AS source_folder_title,
    NULL AS destination_folder_title,
    NULL AS membership_change_type,
    NULL AS new_visibility,
    NULL AS visibility_change,
    NULL AS old_visibility,
    NULL AS visibility,
    mdp.granted_to_email_domain AS target_user_domain,
    base.folder_id,
    (SELECT name FROM ms_drives_docs WHERE ms_id = base.folder_id LIMIT 1) AS folder_name
FROM
(
    SELECT
        mas.ms_id AS event_id,
        mas.operation AS event_name,
        mas.record_type AS event_type,
        'unknown' AS event_description,
        mas.ms_doc_id AS file_id,
        mas.source_file_name AS old_value,
        mas.destination_file_name AS new_value,
        mdd.parent_id AS folder_id,
        mdd.created_by_email AS creator_email,
        mas.client_ip AS ipaddress,
        mas.user_id AS actor_email,
        mas.target_name AS target_email,
        mdd.name AS file_name,
        mas.ms_dt_created AS datetime   
    FROM ms_audit_sharepoint AS mas
        -- TODO: https://altitudenetworks.atlassian.net/browse/ENG-954
        INNER JOIN ms_sites_drives AS drives ON mas.object_drive_web_url = drives.web_url
            AND drives.ms_id = mas.ms_drive_id
        INNER JOIN ms_drives_docs AS mdd ON mas.object_path = mdd.ms_path
    WHERE mas.ms_doc_id = %(file_id)s
    ORDER BY {{order}} {{sort}}
    LIMIT %(offset)s, %(limit)s
) base
LEFT JOIN ms_drives_docs_permissions AS mdp ON mdp.ms_doc_id = base.file_id
