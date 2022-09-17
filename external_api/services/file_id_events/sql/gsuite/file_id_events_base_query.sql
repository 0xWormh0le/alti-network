-- /file/id/events API endpoint <external_api:services/file_id_events/sql/gsuite/file_id_events_base_query.sql>
SELECT
    id_uniqueQualifier AS event_id,
    event_name,
    event_type,
    'unknown' AS event_description,
    doc_id AS file_id,
    COALESCE(file.file_name, event.doc_title) AS file_name,
    UNIX_TIMESTAMP(datetime) AS datetime,
    ipaddress,
    membership_change_type,
    old_value,
    new_value,
    source_folder_title,
    destination_folder_title,
    old_visibility,
    visibility AS new_visibility,
    visibility_change,
    file.parents_list AS folder_id,
    (SELECT file_name FROM drive_v3_filesmeta WHERE file_id = file.parents_list LIMIT 1) AS folder_name,
    (SELECT name FROM platform WHERE symbolic_name = %(platform)s LIMIT 1) AS platform_name,
    %(platform)s AS platform,
    file.owners_emailaddress AS creator_email,
    actor_email,
    actor_id,
    target_user AS target_email,
    target_user_domain
FROM
(
    SELECT
        id_uniqueQualifier,
        event_name,
        event_type,
        doc_id,
        doc_title,
        id_time AS datetime,
        actor_profileId AS actor_id,
        actor_email,
        target_user,
        ipaddress,
        membership_change_type,
        old_value,
        new_value,
        source_folder_title,
        destination_folder_title,
        old_visibility,
        visibility,
        visibility_change,
        target_user_domain
    FROM
        admin_reports_v1_drive
    WHERE doc_id = %(file_id)s
    ORDER BY {{order}} {{sort}}
    LIMIT %(offset)s, %(limit)s
) AS event
LEFT JOIN drive_v3_filesmeta AS file ON event.doc_id = file.file_id
GROUP BY event_id
ORDER BY {{order}} {{sort}}
