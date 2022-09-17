-- file count on drive v3 filesmeta table
SELECT COUNT(DISTINCT file_id) as found_rows
FROM drive_v3_filesmeta AS df
WHERE df.owners_emailAddress = %(person_id)s
    OR df.permissions_emailaddress = %(person_id)s
