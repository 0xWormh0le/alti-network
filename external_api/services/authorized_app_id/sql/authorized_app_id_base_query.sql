SELECT
	DISTINCT clientId AS service_name,
	%(app_id)s AS app_id,
	scope,
	displayText AS name,
	has_marketplace_app AS marketplace_uri,
	marketplace_icon
FROM admin_directory_v1_tokens
WHERE clientId REGEXP %(app_id)s
