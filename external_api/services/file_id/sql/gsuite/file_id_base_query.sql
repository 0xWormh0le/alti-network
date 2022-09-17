-- `file_id` API endpoint <external_api:services/file_id/sql/gsuite/file_id_base_query.sql>
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
    (SELECT file_name FROM drive_v3_filesmeta WHERE file_id = base.folder_id LIMIT 1) AS folder_name,
    %(platform)s AS platform,
    (SELECT name FROM platform WHERE symbolic_name = %(platform)s LIMIT 1) AS platform_name,
    base.last_ingested,
    base.trashed,
    base.icon_link,
    base.web_link,
    base.permissions_domain,
    base.permissions_id,
    base.link_visibility,
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
    external.external_permissions_id,
    aumeta.name_familyname  AS creator_lastname,
    aumeta.name_givenname   AS creator_firstname
FROM
(
    SELECT
        fci.content_tin_count AS tin_count,
        fci.content_ccn_count  AS ccn_count,
        fci.content_sensitive_kw_counts AS kw_count_data,
        df.file_id,
        df.file_name,
        UNIX_TIMESTAMP(df.createdTime) AS created_at,
        df.owners_emailAddress AS creator_email,
        df.owners_emailAddress AS creator_profileid,
        UNIX_TIMESTAMP(df.modifiedTime) AS last_modified,
        df.file_mimeType AS file_mimetype,
        df.md5Checksum AS md5checksum,
        df.parents_list AS folder_id,
        UNIX_TIMESTAMP(df.dt_modified) AS last_ingested,
        df.trashed,
        df.webViewLink AS web_link,
        df.iconLink AS icon_link,
        GROUP_CONCAT(DISTINCT COALESCE(df.permissions_email_domain, df.permissions_domain)) AS permissions_domain,
        GROUP_CONCAT(DISTINCT df.permissions_id) AS permissions_id,
        GROUP_CONCAT(
            DISTINCT
            CASE
                WHEN df.permissions_type='domain' AND df.permissions_domain IN %(domains)s AND df.permissions_allowFileDiscovery=0 THEN 'internal'
                WHEN df.permissions_type='domain' AND df.permissions_domain IN %(domains)s AND df.permissions_allowFileDiscovery=1 THEN 'internal_discoverable'
                WHEN df.permissions_type='anyone' AND df.permissions_id='anyonewithlink' AND df.permissions_allowFileDiscovery=0 THEN 'external'
                WHEN df.permissions_type='anyone' AND df.permissions_id='anyonewithlink' AND df.permissions_allowFileDiscovery=1 THEN 'external_discoverable'
                WHEN df.permissions_type='anyone' AND df.permissions_id='anyone' AND df.permissions_allowFileDiscovery=0 THEN 'external'
                WHEN df.permissions_type='anyone' AND df.permissions_id='anyone' AND df.permissions_allowFileDiscovery=1 THEN 'external_discoverable'
                WHEN df.permissions_type='group' THEN 'group'
                WHEN df.permissions_type='user' THEN 'user'
                ELSE 'none'
            END
        ) AS link_visibility
    FROM
        drive_v3_filesmeta AS df
        LEFT JOIN files_content_inspection AS fci
            ON fci.platform_id = 1 and fci.file_id = df.file_id
    WHERE df.file_id = %(file_id)s
    GROUP BY df.file_id
) base
LEFT JOIN (
    SELECT DISTINCT
        COUNT(permissions_emailAddress) AS internal_access_count,
        file_id,
        permissions_displayName,
        GROUP_CONCAT(permissions_role) AS internal_permissions_role,
        GROUP_CONCAT(permissions_id) AS internal_permissions_id,
        GROUP_CONCAT(SUBSTRING_INDEX(permissions_displayName, ' ', 1)) AS internal_access_firstname_list,
        GROUP_CONCAT(SUBSTRING_INDEX(permissions_displayName, ' ', -1)) AS internal_access_lastname_list,
        GROUP_CONCAT(permissions_emailAddress) AS internal_access_list
    FROM drive_v3_filesmeta
    WHERE permissions_email_domain IN %(domains)s AND file_id = %(file_id)s
    GROUP BY file_id
) internal ON internal.file_id = base.file_id
LEFT JOIN (
    SELECT DISTINCT
        COUNT(permissions_emailAddress) AS external_access_count,
        file_id,
        permissions_displayName,
        GROUP_CONCAT(permissions_role) AS external_permissions_role,
        GROUP_CONCAT(permissions_id) AS external_permissions_id,
        GROUP_CONCAT(SUBSTRING_INDEX(permissions_displayName, ' ', 1)) AS external_access_firstname_list,
        GROUP_CONCAT(SUBSTRING_INDEX(permissions_displayName, ' ', -1)) AS external_access_lastname_list,
        GROUP_CONCAT(permissions_emailAddress) AS external_access_list
    FROM drive_v3_filesmeta
    WHERE permissions_email_domain NOT IN %(domains)s AND file_id = %(file_id)s
    GROUP BY file_id
) external ON external.file_id = base.file_id
LEFT JOIN admin_directory_v1_usersmeta AS aumeta ON aumeta.primaryEmail = base.creator_email
