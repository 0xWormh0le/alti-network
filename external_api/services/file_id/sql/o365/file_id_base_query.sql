-- `FileId` API endpoint <external_api:services/file_id/sql/o365/file_id_base_query.sql>
-- Note: This query fetch file metadata and list of internal and external users with access to the file.
SELECT DISTINCT
    base.file_id,
    base.file_name,
    base.tin_count,
    base.ccn_count,
    base.kw_count_data,
    base.created_at,
    base.creator_email,
    base.creator_email,
    base.last_modified,
    base.file_mimetype,
    base.md5checksum,
    base.folder_id,
    base.folder_name,
    %(platform)s AS platform,
    base.platform_name,
    base.last_ingested,
    base.trashed,
    base.icon_link,
    base.web_link,
    perms.permissions_domain,
    perms.permissions_id,
    perms.link_visibility,
    internal.internal_access_list,
    internal.internal_access_count,
    internal.internal_access_firstname_list,
    internal.internal_access_lastname_list,
    internal.internal_permissions_role,
    internal.internal_permissions_id,
    external.external_access_list,
    external.external_access_count,
    external.external_access_firstname_list,
    external.external_access_lastname_list,
    external.external_permissions_role,
    external.external_permissions_id
FROM
(
    SELECT
        mdd.ms_id AS file_id,
        mdd.name AS file_name,
        md.name AS folder_name,
        UNIX_TIMESTAMP(mdd.ms_dt_created) AS created_at,
        mdd.created_by_email AS creator_email,
        mdd.created_by_email AS creator_profileid,
        UNIX_TIMESTAMP(mdd.ms_dt_modified) AS last_modified,
        mdd.file_mime_type AS file_mimetype,
        mdd.file_xor_hash AS md5checksum,
        mdd.parent_id AS folder_id,
        UNIX_TIMESTAMP(mdd.dt_modified) AS last_ingested,
        NULL AS trashed,
        NULL AS icon_link,
        mdd.web_url AS web_link,
        fci.content_tin_count AS tin_count,
        fci.content_ccn_count  AS ccn_count,
        fci.content_sensitive_kw_counts AS kw_count_data,
        pf.name AS platform_name
    FROM
        ms_drives_docs AS mdd
        LEFT JOIN ms_drives_docs AS md ON md.ms_id = mdd.parent_id
        LEFT JOIN platform AS pf ON pf.symbolic_name = %(platform)s
        LEFT JOIN files_content_inspection AS fci
            ON fci.platform_id = pf.id and fci.file_id = mdd.ms_id
    WHERE mdd.ms_id = %(file_id)s
    GROUP BY mdd.ms_id
) base
LEFT JOIN (
    SELECT
        ms_doc_id,
        granted_to_email_domain AS permissions_domain,
        GROUP_CONCAT(DISTINCT an_permission_id) AS permissions_id,
        GROUP_CONCAT(
            DISTINCT
            CASE
                -- USER ACCESS
                WHEN link_scope = 'users' AND granted_to_email_domain IN %(domains)s THEN 'user'
                WHEN link_scope IS NULL AND granted_to_email IS NOT NULL THEN 'user'
                -- GROUP ACCESS
                WHEN link_scope IS NULL AND granted_to_display_name IS NOT NULL AND granted_to_email IS NULL THEN 'group'
                -- INTERNAL ACCESS
                WHEN link_scope = 'organization' THEN 'internal'
                -- EXTERNAL ACCESS
                WHEN link_scope = 'anonymous' THEN 'external'
                WHEN link_scope = 'users' AND granted_to_email_domain NOT IN %(domains)s THEN 'external'
                ELSE 'none'
            END
        ) AS link_visibility
    FROM
        ms_drives_docs_permissions
    WHERE
        ms_doc_id = %(file_id)s
    GROUP BY ms_doc_id
) perms ON perms.ms_doc_id = base.file_id
LEFT JOIN (
    SELECT DISTINCT
        COUNT(granted_to_email) AS internal_access_count,
        ms_doc_id,
        granted_to_display_name,
        GROUP_CONCAT(roles) AS internal_permissions_role,
        GROUP_CONCAT(an_permission_id) AS internal_permissions_id,
        GROUP_CONCAT(SUBSTRING_INDEX(granted_to_display_name, ' ', 1)) AS internal_access_firstname_list,
        GROUP_CONCAT(SUBSTRING_INDEX(granted_to_display_name, ' ', -1)) AS internal_access_lastname_list,
        GROUP_CONCAT(granted_to_email) AS internal_access_list
    FROM ms_drives_docs_permissions
    WHERE granted_to_email_domain IN %(domains)s AND ms_doc_id = %(file_id)s
    GROUP BY ms_doc_id
) internal ON internal.ms_doc_id = base.file_id
LEFT JOIN (
    SELECT DISTINCT
        COUNT(granted_to_email) AS external_access_count,
        ms_doc_id,
        granted_to_display_name,
        GROUP_CONCAT(roles) AS external_permissions_role,
        GROUP_CONCAT(an_permission_id) AS external_permissions_id,
        GROUP_CONCAT(SUBSTRING_INDEX(granted_to_display_name, ' ', 1)) AS external_access_firstname_list,
        GROUP_CONCAT(SUBSTRING_INDEX(granted_to_display_name, ' ', -1)) AS external_access_lastname_list,
        GROUP_CONCAT(granted_to_email) AS external_access_list
    FROM ms_drives_docs_permissions
    WHERE granted_to_email_domain NOT IN %(domains)s AND ms_doc_id = %(file_id)s
    GROUP BY ms_doc_id
) external ON external.ms_doc_id = base.file_id
