# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Format :boom:

## [Unreleased]

## [8.1.0]
### Added
- Add `webLink` field for all file output responses to link original shared file in `drive` or `o365` [#843](https://github.com/altitudenetworks/external_api/pull/843)
- Add `o365` support for `/person/id/events` service [#856](https://github.com/altitudenetworks/external_api/pull/856)
- Add `webLink` to `/risks` api responses. [#859](https://github.com/altitudenetworks/external_api/pull/859)

### Changed
- Update `flavius-client-sdk` to `1.0.3` and tools to `15.33.0`. [#843](https://github.com/altitudenetworks/external_api/pull/843)
- add multi-platform support to `GetFileIdPermissionsHandler`
- remove `autouse` fixture for dynamo. [#853](https://github.com/altitudenetworks/external_api/pull/853)
- Add style fixes to email V3 template [#864](https://github.com/altitudenetworks/external_api/pull/864)

### Fixed
- NULL owner files raising error on split.
- Fix external API 8.0.0 release notes in changelog file. [#843](https://github.com/altitudenetworks/external_api/pull/843)
- Now tests can be run independently with out failing [#853](https://github.com/altitudenetworks/external_api/pull/853)
- `risks`: Fix performance regression introduced in 8.0.0. [#860](https://github.com/altitudenetworks/external_api/pull/860)
- Fix `person-events-base-query` and count query with updates to unit tests [#869](https://github.com/altitudenetworks/external_api/pull/869)

## [8.1.0rc1]
### Added
- Add `webLink` field for all file output responses to link original shared file in `drive` or `o365` [#843](https://github.com/altitudenetworks/external_api/pull/843)
- Add `o365` support for `/person/id/events` service [#856](https://github.com/altitudenetworks/external_api/pull/856)
- Add `webLink` to `/risks` api responses. [#859](https://github.com/altitudenetworks/external_api/pull/859)

### Changed
- Update `flavius-client-sdk` to `1.0.3` and tools to `15.33.0`. [#843](https://github.com/altitudenetworks/external_api/pull/843)
- add multi-platform support to `GetFileIdPermissionsHandler`
- remove `autouse` fixture for dynamo. [#853](https://github.com/altitudenetworks/external_api/pull/853)
- Add style fixes to email V3 template [#864](https://github.com/altitudenetworks/external_api/pull/864)

### Fixed
- NULL owner files raising error on split.
- Fix external API 8.0.0 release notes in changelog file. [#843](https://github.com/altitudenetworks/external_api/pull/843)
- Now tests can be run independently with out failing [#853](https://github.com/altitudenetworks/external_api/pull/853)
- `risks`: Fix performance regression introduced in 8.0.0. [#860](https://github.com/altitudenetworks/external_api/pull/860)
- Fix `person-events-base-query` and count query with updates to unit tests [#869](https://github.com/altitudenetworks/external_api/pull/869)

## [8.0.0]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)
- `risk-summary-emails` service: Accept recipients event key with list of recipients to send to instead of recipients configured in `configs` DynamoDB table. [#837](https://github.com/altitudenetworks/external_api/pull/837)
- Add refactoring fixes to `UserGenerator` class, related services and unit tests [#838](https://github.com/altitudenetworks/external_api/pull/838)
- Update user role map to include `commenter`, `organizer` and `fileOrganizer` roles. [#840](https://github.com/altitudenetworks/external_api/pull/840)
- Lock Flavius Client SDK specifically to version `1.0.8`. [#845](https://github.com/altitudenetworks/external_api/pull/845)
- Update daily risk templates to skip column names for absent emails [#847](https://github.com/altitudenetworks/external_api/pull/847)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)
- Add style fixes to four boxes in daily risk email template [#842](https://github.com/altitudenetworks/external_api/pull/842)
- Add fix to jinja template for daily risk email to check risk found `> 0` instead of `> 1` [#849](https://github.com/altitudenetworks/external_api/pull/849)

## [8.0.0rc7]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)
- `risk-summary-emails` service: Accept recipients event key with list of recipients to send to instead of recipients configured in `configs` DynamoDB table. [#837](https://github.com/altitudenetworks/external_api/pull/837)
- Add refactoring fixes to `UserGenerator` class, related services and unit tests [#838](https://github.com/altitudenetworks/external_api/pull/838)
- Update user role map to include `commenter`, `organizer` and `fileOrganizer` roles. [#840](https://github.com/altitudenetworks/external_api/pull/840)
- Lock Flavius Client SDK specifically to version `1.0.8`. [#845](https://github.com/altitudenetworks/external_api/pull/845)
- Update daily risk templates to skip column names for absent emails [#847](https://github.com/altitudenetworks/external_api/pull/847)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)
- Add style fixes to four boxes in daily risk email template [#842](https://github.com/altitudenetworks/external_api/pull/842)
- Add fix to jinja template for daily risk email to check risk found `> 0` instead of `> 1` [#849](https://github.com/altitudenetworks/external_api/pull/849)

## [8.0.0rc6]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)
- `risk-summary-emails` service: Accept recipients event key with list of recipients to send to instead of recipients configured in `configs` DynamoDB table. [#837](https://github.com/altitudenetworks/external_api/pull/837)
- Add refactoring fixes to `UserGenerator` class, related services and unit tests [#838](https://github.com/altitudenetworks/external_api/pull/838)
- Update user role map to include `commenter`, `organizer` and `fileOrganizer` roles. [#840](https://github.com/altitudenetworks/external_api/pull/840)
- Lock Flavius Client SDK specifically to version `1.0.8`. [#845](https://github.com/altitudenetworks/external_api/pull/845)
- Update daily risk templates to skip column names for absent emails [#847](https://github.com/altitudenetworks/external_api/pull/847)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)
- Add style fixes to four boxes in daily risk email template [#842](https://github.com/altitudenetworks/external_api/pull/842)

## [8.0.0rc5]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)
- `risk-summary-emails` service: Accept recipients event key with list of recipients to send to instead of recipients configured in `configs` DynamoDB table. [#837](https://github.com/altitudenetworks/external_api/pull/837)
- Add refactoring fixes to `UserGenerator` class, related services and unit tests [#838](https://github.com/altitudenetworks/external_api/pull/838)
- Update user role map to include `commenter`, `organizer` and `fileOrganizer` roles. [#840](https://github.com/altitudenetworks/external_api/pull/840)
- Lock Flavius Client SDK specifically to version `1.0.8`. [#845](https://github.com/altitudenetworks/external_api/pull/845)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)
- Add style fixes to four boxes in daily risk email template [#842](https://github.com/altitudenetworks/external_api/pull/842)

## [8.0.0rc4]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)
- `risk-summary-emails` service: Accept recipients event key with list of recipients to send to instead of recipients configured in `configs` DynamoDB table. [#837](https://github.com/altitudenetworks/external_api/pull/837)
- Add refactoring fixes to `UserGenerator` class, related services and unit tests [#838](https://github.com/altitudenetworks/external_api/pull/838)
- Update user role map to include `commenter`, `organizer` and `fileOrganizer` roles. [#840](https://github.com/altitudenetworks/external_api/pull/840)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)
- Add style fixes to four boxes in daily risk email template [#842](https://github.com/altitudenetworks/external_api/pull/842)

## [8.0.0rc3]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)
- `risk-summary-emails` service: Accept recipients event key with list of recipients to send to instead of recipients configured in `configs` DynamoDB table. [#837](https://github.com/altitudenetworks/external_api/pull/837)
- Add refactoring fixes to `UserGenerator` class, related services and unit tests [#838](https://github.com/altitudenetworks/external_api/pull/838)
- Update user role map to include `commenter`, `organizer` and `fileOrganizer` roles. [#840](https://github.com/altitudenetworks/external_api/pull/840)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)

## [8.0.0rc2]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)
- `risk-summary-emails` service: Accept recipients event key with list of recipients to send to instead of recipients configured in `configs` DynamoDB table. [#837](https://github.com/altitudenetworks/external_api/pull/837)
- Add refactoring fixes to `UserGenerator` class, related services and unit tests [#838](https://github.com/altitudenetworks/external_api/pull/838)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)

## [8.0.0rc1]
### Added
- Add support for `flavius_client_sdk` for user model generation and validation
- Add Actions workflow to generate `external_site` and `flavius_api_sdk`. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Create new data classes for `File` and `Event` data models.
- Created a `UserGenerator` class to fetch user records from Dynamo and SQL [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Update `emails` property to support backward compatibility for `flavius` app in user schema model.
- Add `platformId` to fileOutputModel responses. [#822](https://github.com/altitudenetworks/external_api/pull/822)
- Add SQL queries for o365 related risk applications [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Add `o365` support `file_id` endpoint. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Add `o365` support `files` endpoint. [#825](https://github.com/altitudenetworks/external_api/pull/825)
- Add o365 support to `/people` service
- Add o365 support to `/person/personId` service [#827](https://github.com/altitudenetworks/external_api/pull/827)
- Add daily risk summary email v3 template [#829](https://github.com/altitudenetworks/external_api/pull/829)
- Add o365 support to `/folder/folderId` service
- Add o365 support to `/parentFolder/FolderId` service [#826](https://github.com/altitudenetworks/external_api/pull/826)

### Changed
- Update Apigateway definitions to conform to User JSON Schema.
- Update `people` and `person_id` service to use to `USER` JSON schema.
- Update `app/id/events`, `/person/id/events`, `/file/id/events` to use User JSON schema.
- Update `/files` `/file/id`, `/risks_tiles`, `/risks` services to use JSON schema model. [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Update tools to version `15.23.0`. [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Update apigateway deploy configs to support schema model.
- Updated user schema to be compatible with apigateway. [#819](https://github.com/altitudenetworks/external_api/pull/819)
- Refactor `sql` and `dynamo` fixtures into separate files and directories
- Add unit tests to support `UserGenerator`, `File` and `Event` data classes [#815](https://github.com/altitudenetworks/external_api/pull/815)
- Refactor `risks` service to support incoming o365 risk changes. [#821](https://github.com/altitudenetworks/external_api/pull/821)
- Update tools version to `15.27.0`, Flavius SDK to `1.0.7` and altitude db schema to `3.1.0`
- Update `User model` responses to support new fields in `email` related types for backward compatibility with Flavius SDK version 1.0.7. [#823](https://github.com/altitudenetworks/external_api/pull/823)
- Update sensitive phrases model to support to_sql_dm method
- Update access level to handle sentinel values from dynamo
- Update risks endpoint to return file mimetype.
- Refactor sql fixtures into sql and `dynamo` fixture classes respectively. [#824](https://github.com/altitudenetworks/external_api/pull/824)
- Update Daily Risk Email to follow V3 specification [#830](https://github.com/altitudenetworks/external_api/pull/830)
- Update flavius SDK version to 1.1.0 [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Removed
- Remove `FrontendPersonBuilder` class [#737](https://github.com/altitudenetworks/external_api/pull/737)
- Remove `app`  from risks response [#832](https://github.com/altitudenetworks/external_api/pull/832)

### Fixed
- Fix external_site and flavius openapi update workflows [#816](https://github.com/altitudenetworks/external_api/pull/816)
- Update platforms to default to currently subscribed platforms by customer [#817](https://github.com/altitudenetworks/external_api/pull/817)
- Add missing AWS credentials to openapi SDK workflow [#818](https://github.com/altitudenetworks/external_api/pull/818)
- `user/sql` added to package [#828](https://github.com/altitudenetworks/external_api/pull/828)
- Replace `INNER JOIN` with `LEFT JOIN` on `ms_drives_docs` table for `file_id_base_query` for o365. [#833](https://github.com/altitudenetworks/external_api/pull/833)
- Add formatting fixes to email template for better GMail rendering. [#831](https://github.com/altitudenetworks/external_api/pull/831)
- Fetch Valid user information from Dynamo DB tables [#835](https://github.com/altitudenetworks/external_api/pull/835)

## [7.0.0]
### Added
- Add `platform-id`  and `platform-ids` query parameter support for these endpoints: [#807](https://github.com/altitudenetworks/external_api/pull/807)

### Changed
- Update o365 PlatformOutput in flavius API
- Update `platform_id` and `platform_ids` properties to use `Platform` from catalogs in tools
- Update API services to support `platform_id` and `platform_ids` on these endpoints:
       * `/file/fileId`, `/files`, `/file/file/events`, `/file/fileId/Permissions`, `/files/parentFolder/{parentId}`,
      * `/folder/folderId`, `/permissions`, `/permission/permissionId`, `/risk/riskId/permissions`,
      *  `/person/id/events`, `/app/id/events`. [#807](https://github.com/altitudenetworks/external_api/pull/807)
- Update  `/files` endpoint to use `platform_ids` query param instead of `platform-id`. [#811](https://github.com/altitudenetworks/external_api/pull/811)

### Fixed
- Update platforms property to parse platform-ids query params properly from apigateway. [#812](https://github.com/altitudenetworks/external_api/pull/812)

## [7.0.0rc2]
### Added
- Add `platform-id`  and `platform-ids` query parameter support for these endpoints: [#807](https://github.com/altitudenetworks/external_api/pull/807)

### Changed
- Update o365 PlatformOutput in flavius API
- Update `platform_id` and `platform_ids` properties to use `Platform` from catalogs in tools
- Update API services to support `platform_id` and `platform_ids` on these endpoints:
       * `/file/fileId`, `/files`, `/file/file/events`, `/file/fileId/Permissions`, `/files/parentFolder/{parentId}`,
      * `/folder/folderId`, `/permissions`, `/permission/permissionId`, `/risk/riskId/permissions`,
      *  `/person/id/events`, `/app/id/events`. [#807](https://github.com/altitudenetworks/external_api/pull/807)
- Update  `/files` endpoint to use `platform_ids` query param instead of `platform-id`. [#811](https://github.com/altitudenetworks/external_api/pull/811)

### Fixed
- Update platforms property to parse platform-ids query params properly from apigateway. [#812](https://github.com/altitudenetworks/external_api/pull/812)

## [7.0.0rc1]
### Added
- Add `Platform` and `PlatformOutput` models to flavius API
- Add `platform-id`  and `platform-ids` query parameter support for these endpoints:
    * `/file/fileId`, `/files`, `/file/file/events`, `/file/fileId/Permissions`, `/files/parentFolder/{parentId}`,
    * `/folder/folderId`, `/permissions`, `/permission/permissionId`, `/risk/riskId/permissions`. [#806](https://github.com/altitudenetworks/external_api/pull/806)
-  Store number of daily risks in CloudWatch metrics.
- Add `risks_found_query` and `risks_resolved_query` to fetch total risks created and risks resolved for a specific customer [#795](https://github.com/altitudenetworks/external_api/pull/795)

### Changed
- Update API version to `1.0.3`
- Update `FileOutputModel`, `RiskItemOutputModel` and `PermissionItemModel` to include `PlatformOutput` fields [#806](https://github.com/altitudenetworks/external_api/pull/806)
- Update `risks_summary_base_query` to fetch changes in the last 24 hours for risks created, risks resolved and categories of risks present [#795](https://github.com/altitudenetworks/external_api/pull/795)

### Removed
- Remove old email template html files and images directory [#795](https://github.com/altitudenetworks/external_api/pull/795)

### Fixed
- Replaced all usages of `DataStateTable` with newer managers [#800](https://github.com/altitudenetworks/external_api/pull/800)

## [6.2.0]
### Added
- Add Daily Risk Email version two email template. [#797](https://github.com/altitudenetworks/external_api/pull/797)

### Changed
- Optimize `parentFolder` related queries to fetch folder name more efficiently. [#796](https://github.com/altitudenetworks/external_api/pull/796)
- Update `repo_checker` to version `7.8.0`. [#799](https://github.com/altitudenetworks/external_api/pull/799)
- Switch integration test user account from `bobbie` to `int.test` thoughtlabs user [#802](https://github.com/altitudenetworks/external_api/pull/802)

## [6.2.0rc3]
### Added
- Add Daily Risk Email version two email template. [#797](https://github.com/altitudenetworks/external_api/pull/797)

### Changed
- Optimize `parentFolder` related queries to fetch folder name more efficiently. [#796](https://github.com/altitudenetworks/external_api/pull/796)
- Update `repo_checker` to version `7.8.0`. [#799](https://github.com/altitudenetworks/external_api/pull/799)
- Switch integration test user account from `bobbie` to `int.test` thoughtlabs user [#802](https://github.com/altitudenetworks/external_api/pull/802)

## [6.2.0rc2]
### Added
- Add Daily Risk Email version two email template. [#797](https://github.com/altitudenetworks/external_api/pull/797)

### Changed
- Optimize `parentFolder` related queries to fetch folder name more efficiently. [#796](https://github.com/altitudenetworks/external_api/pull/796)
- Update `repo_checker` to version `7.8.0`. [#799](https://github.com/altitudenetworks/external_api/pull/799)

## [6.1.0] - 2021-04-08
### Added
- Add `sensitive-content-only` flag to risks API spec and updated risks service to support the new feature. [#782](https://github.com/altitudenetworks/external_api/pull/782)

### Changed
- `repo_checker` updated and GitHub workflows updated accordingly
- Update tools package to version `15.11.0` [#782](https://github.com/altitudenetworks/external_api/pull/782)
- Update documentation for external_api repo. [#785](https://github.com/altitudenetworks/external_api/pull/785)
- Verify sensitive content string is true or false [#789](https://github.com/altitudenetworks/external_api/pull/789)
- Update apigateway integration tests to fetch apigw_id from custom_domain api call [#791](https://github.com/altitudenetworks/external_api/pull/791)

### Removed
- Removed apigateway utils class [#791](https://github.com/altitudenetworks/external_api/pull/791)

### Fixed
- Fix `PyYaml`, jinja2` and `httplib2` security vulnerabilities
  * `httplib2>=0.19.0` (CVE-2021-21240)
  * `jinja2>=2.11.3` (CVE-2020-28493)
  * `pyyaml>=5.4` (CVE-2020-14343) [#787](https://github.com/altitudenetworks/external_api/pull/787)
- Fix `sensitive-content-only` parameter from string to bool from apigateway [#788](https://github.com/altitudenetworks/external_api/pull/788)
- Format ParentId in apigateway integration tests [#792](https://github.com/altitudenetworks/external_api/pull/792)

## [6.0.0] - 2021-03-24
### Added
- Add `iconURL` and `mimeType` to file with most risk tile. [#780](https://github.com/altitudenetworks/external_api/pull/780)
- Add `external_site_api` specs and service deploy templates to external api repo. [#771](https://github.com/altitudenetworks/external_api/pull/771)
- Add `parentId` field to File model in Apigateway
- Add `/files/parentFolder/{parentId}` apigateway definition and service
- Add `/folder/{folderId}` endpoint to external_api
- Add service deploy templates for `/risks/files/{parentId}` endpoint [#752](https://github.com/altitudenetworks/external_api/pull/752)
- Add log statements to cors lambda service [#778](https://github.com/altitudenetworks/external_api/pull/778)

### Changed
- Update `/app/id/events`, `/person/id/events` and `/file/id/events` to support parentId field in file property
- Update `build_file` method in `ExternalApiHandler` to required `parentId` field
- Update `/file` and `/files` endpoints to support parentId property
- Update unit tests to support `parentId` property in files [#752](https://github.com/altitudenetworks/external_api/pull/752)
- Update base queries for `app_id_events`, `file_id_events`, `person_id_events`, `file_id` and `files` to fetch complete folder information.
- Update unit tests for event related endpoints and files to show folder metadata. [#776](https://github.com/altitudenetworks/external_api/pull/776)

### Removed
- Remove the old apigateway deployment services from external_api [#735](https://github.com/altitudenetworks/external_api/pull/735)

### Fixed
- Add `application_role` parameter to parent folder service deploy templates apigateway triggers [#775](https://github.com/altitudenetworks/external_api/pull/775)

## [6.0.0rc2] - 2021-03-12
### Added
- Add `external_site_api` specs and service deploy templates to external api repo. [#771](https://github.com/altitudenetworks/external_api/pull/771)
- Add `parentId` field to File model in Apigateway
- Add `/files/parentFolder/{parentId}` apigateway definition and service
- Add `/folder/{folderId}` endpoint to external_api
- Add service deploy templates for `/risks/files/{parentId}` endpoint [#752](https://github.com/altitudenetworks/external_api/pull/752)
- Add log statements to cors lambda service [#778](https://github.com/altitudenetworks/external_api/pull/778)

### Changed
- Update `/app/id/events`, `/person/id/events` and `/file/id/events` to support parentId field in file property
- Update `build_file` method in `ExternalApiHandler` to required `parentId` field
- Update `/file` and `/files` endpoints to support parentId property
- Update unit tests to support `parentId` property in files [#752](https://github.com/altitudenetworks/external_api/pull/752)
- Update base queries for `app_id_events`, `file_id_events`, `person_id_events`, `file_id` and `files` to fetch complete folder information.
- Update unit tests for event related endpoints and files to show folder metadata. [#776](https://github.com/altitudenetworks/external_api/pull/776)

### Removed
- Remove the old apigateway deployment services from external_api [#735](https://github.com/altitudenetworks/external_api/pull/735)

### Fixed
- Add `application_role` parameter to parent folder service deploy templates apigateway triggers [#775](https://github.com/altitudenetworks/external_api/pull/775)

## [5.4.0] - 2021-03-02
### Added
- Add OpenAPI spec for `flavius` with stoplight integration [#747](https://github.com/altitudenetworks/external_api/pull/747)
- Add a `CORSLambdaHandler` to respond to `OPTIONS` requests with the proper headers. [#759](https://github.com/altitudenetworks/external_api/pull/759)
- Add api mappings for dev api deployments [#767](https://github.com/altitudenetworks/external_api/pull/767)

### Changed
- Update service deployer to use new deployment_management version 6.1.0
- Update `risks_base_query` to read file metadata from `risk_files` table.
- Update get permissions status by risk query to read file metadata exclusively from risks_files table.
- Update person id base query and access count risk_query to fetch file related data from risks_files table.
- Update person id stats with risk query to read file metadata from risks_files table.
- Update risk status get pending permissions query to read file_id exclusively from risks_files table instead of top_risks. [#747](https://github.com/altitudenetworks/external_api/pull/747)
- Bumped tools version to `15.0.0` [#759](https://github.com/altitudenetworks/external_api/pull/759)
- Update flavius api tags and maintain old apigateway service names
- Update `api_id` for dev apigateway [#761](https://github.com/altitudenetworks/external_api/pull/761)
- Update authorizer lambda deploy specs to support Apigateway authorizer triggers. [#766](https://github.com/altitudenetworks/external_api/pull/766)

### Fixed
- Evaluate total risk_count for person by `count(DISTINCT r.risk_id)` instead of `COUNT(*)` [#748](https://github.com/altitudenetworks/external_api/pull/748)
- `CognitoTokenVerifier` used to override main logger on init [#755](https://github.com/altitudenetworks/external_api/pull/755)
- Fix duplication of risks results by adding `GROUP BY` to risks_base query [#760](https://github.com/altitudenetworks/external_api/pull/760)
- Remove dev apigateway custom domain from staging jinja template for flavius [#761](https://github.com/altitudenetworks/external_api/pull/761)
- Remove unnecessary tags [#763](https://github.com/altitudenetworks/external_api/pull/763)
- Update flavius api spec for authorizer name to use suffix environment variable
- Update api url to point to main altitude networks domain. [#765](https://github.com/altitudenetworks/external_api/pull/765)
- `User.from_api_dm` method error
- Typing issues in `models.user` [#769](https://github.com/altitudenetworks/external_api/pull/769)
- Switch `zip` to `itertools.zip_longest` preventing the truncation of results from `ExternalApiHandler._build_persons` method.
- Fix `page_size` and `page_count` for get_file_id_permissions service [#772](https://github.com/altitudenetworks/external_api/pull/772)

## [5.3.0] - 2021-01-29
### Added
- Adds `company_name` to risk summary emails [#730](https://github.com/altitudenetworks/external_api/pull/730)

### Changed
- Update `/file/id/events` to return `profileId` for anonymous users [#729](https://github.com/altitudenetworks/external_api/pull/729)
- Update `risks-by-person-id` query to check `risk_target` and `risk_person_id` columns when fetching all risks associated with a person-id
- Move `risks-base-query` query fragments to sql file with corresponding jinja templates [#732](https://github.com/altitudenetworks/external_api/pull/732)
- Update tools package to `12.0.0` to use the `company_name` property. [#730](https://github.com/altitudenetworks/external_api/pull/730)

### Fixed
- `risks` service: Fix slowdown in the presence of many content inspection results. When `files_content_inspection` table contains many rows, ensure optimal performance by joining on both `platform_id` and `file_id` (was: only `file_id`). [#744](https://github.com/altitudenetworks/external_api/pull/744)
- `files`, `file_id` services: Fix slowdown in the presence of many content inspection results. When `files_content_inspection` table contains many rows, ensure optimal performance by joining on both `platform_id` and `file_id` (was: only `file_id`). [#753](https://github.com/altitudenetworks/external_api/pull/753)

## [5.2.2.post1] - 2021-01-28
### Fixed
- `files`, `file_id` services: Fix slowdown in the presence of many content inspection results. When `files_content_inspection` table contains many rows, ensure optimal performance by joining on both `platform_id` and `file_id` (was: only `file_id`). [#753](https://github.com/altitudenetworks/external_api/pull/753)

## [5.2.2] - 2021-01-22
### Fixed
- `risks` service: Fix slowdown in the presence of many content inspection results. When `files_content_inspection` table contains many rows, ensure optimal performance by joining on both `platform_id` and `file_id` (was: only `file_id`).

## [5.2.0] - 2020-12-30
### Changed
- Update `file_id`, `files`, `company_domains`, `people` services to use domains as a tuple (required pg db support) [#726](https://github.com/altitudenetworks/external_api/pull/726)

### Fixed
- Remove unnecessary brackets in file_id base query to support multiple domains [#726](https://github.com/altitudenetworks/external_api/pull/726)

## [5.1.0] - 2020-12-28
### Added
- A new JSON schema `user-v10.json` to represent users
- A new class with stubs for working User info in Python
- Unit tests for User Object Model. These can be used as examples for writing other unit tests for endpoints that work with User Object Model too. [#702](https://github.com/altitudenetworks/external_api/pull/702)

### Changed
- Changed authorizer unit tests to avoid broad patching and mocking. [#720](https://github.com/altitudenetworks/external_api/pull/720)

### Fixed
- Refactored `get_endpoint_name` to work with different endpoint and API GW naming patterns. This does not change the authorization logic, since the `get_endpoint_name` is only used in `emit_EMF` methods. [#720](https://github.com/altitudenetworks/external_api/pull/720)
- Update `risks` query to specify the proper `status` column from top_risks instead of `files_content_inspection` table. [#721](https://github.com/altitudenetworks/external_api/pull/721)

## [5.0.0] - 2020-12-09
### Changed
- Update `add_logs_to_emf` method in `ExternalApiHandler` to use `log_emf` pattern in authorizer for all services emitting logs to emf
- Update `delete permissions` services to use new `add_logs_to_emf` updates
- Update apigateway authorizer to use `add_logs_to_emf ` method instead of removed `log_emf` method.
- Update build base event response to emit emf logs with missing actor information
- Update authorized app id stats to emit emf logs with missing metric names and values from dynamo [#710](https://github.com/altitudenetworks/external_api/pull/710)
- Update tools to version `11.26.0` [#711](https://github.com/altitudenetworks/external_api/pull/711)
- Sorts the `person-id-stats` results in ascending order instead of descending order [#716](https://github.com/altitudenetworks/external_api/pull/716)

### Removed
- Removed `log_emf` method in apigateway authorizer to use `add_logs_to_emf` in base class instead [#710](https://github.com/altitudenetworks/external_api/pull/710)

## [4.1.1] - 2020-12-03
### Fixed
- app stat metrics responses only includes int values for metrics [#713](https://github.com/altitudenetworks/external_api/pull/713)

## [4.1.0] - 2020-12-03
### Added
- Add sensitive phrases models to apigateway specs  [#684](https://github.com/altitudenetworks/external_api/pull/684)
- Add `build_sensitive_phrases` method which parses the raw sql sensitive phrases to match apigateway specs
- Add multi file risks base query and remove left join with risks_files table in risks base query
- Add `build_multi_file_sensitive_phrases` method to api handler template [#701](https://github.com/altitudenetworks/external_api/pull/701)

### Changed
- Update risks service to include sensitive phrases dictionary
- Update file service to include sensitive phrases dictionary
- Update unit tests to include sensitive phrases field
- Update tools to `11.11.0`
- Update `risks` base query to read sensitive phrases metadata from `files_content_inspection` table
- Update read and write run query to use `sql_connect.get_query_string` instead of frontend query builder [#684](https://github.com/altitudenetworks/external_api/pull/684)
-  Updated sensitivePhrases model to match new updates in specs
- Updated sql queries that use files_content_inspection table to rename the sensitive_keywords column
- Fetch file related information for risk from risks_files table in risks base query
- Move open api specs from `3.0.2` to `3.0.3` for apigateway specs
- Update handle methods to add multi file sensitive phrases response to final response
-  Update `risks`vservice unit tests to verify single and multi file responses [#701](https://github.com/altitudenetworks/external_api/pull/701)
- Handle missing actor information gracefully for `/person/id/events` service [#708](https://github.com/altitudenetworks/external_api/pull/708)

### Fixed
- Updated zipp sub dependency in Pipfile.lock as shown in [BUG REPORT](https://github.com/jaraco/zipp/issues/66)
- Rename external_api test module properly from `external_integration_apis` [#684](https://github.com/altitudenetworks/external_api/pull/684)
- Update risks service to handle null values in files_content_inspection table and adds unit test to verify behaviour. [#699](https://github.com/altitudenetworks/external_api/pull/699)
- Update `files` and `file_id` services to handle null values in files_content_inspection table and adds unit test to verify behaviour. [#700](https://github.com/altitudenetworks/external_api/pull/700)
- Fix `sensitivePhrasesFileCount` in build_multi_file_sensitive_phrases method to compute number of files having sensitive phrases instead of number of sensitive phrases in all files. [#703](https://github.com/altitudenetworks/external_api/pull/703)
- Update `run_read_query` to skip resetting the `page_count` property if it's already set. [#705](https://github.com/altitudenetworks/external_api/pull/705)
- Missing applications metrics defaults to 0 (previously raised an exception) [#707](https://github.com/altitudenetworks/external_api/pull/707)

## [4.0.0] - 2020-11-17
### Changed
- Refactor files base query and update file_risk count to use risks_files_table instead.
- Replace all double quotes with single quotes in sql queries to match tools 11.0.0 updates.
- Update files service to include jinja templates and simplify query updates
- Update conftest fixtures based on updates with tools 11
- Update tools package to 11.0.0 [#680](https://github.com/altitudenetworks/external_integration_apis/pull/680)
- Update code references to use `external_api` instead of `external_integration_apis` [#685](https://github.com/altitudenetworks/external_api/pull/685)
- Update `get_file_id_permissions`, `risks` and `person_id_events` services to use jinja templates instead of python string templates
- Update `get_file_id_permissions` unit test to use mysql containers and add tests to verify correct order_by parameters [#686](https://github.com/altitudenetworks/external_api/pull/686)
- Update `person_id_events`, `file_id_events`, `files` and `people` services to use count_query strings
- Update unit tests of person_id_events`, `file_id_events`, `files` and `people` services to verify page_count is correct [#687](https://github.com/altitudenetworks/external_api/pull/687)
- No public API changes, all the changes are related to deprecated files or print statements.
- Replaces print statements with logger instances
- Removed deprecated modules
- Cleaned up comment blocks, etc [#689](https://github.com/altitudenetworks/external_api/pull/689)
- Update delete-permissions by risk id service not to require a `file-id` parameter for bulk deletions and updates unit tests to verify behaviour.
- update delete permissions by risk id sql queries to get file information from `risks_files` table instead of `top_risks` table [#696](https://github.com/altitudenetworks/external_api/pull/696)

### Removed
- Remove `render_query_template` method in ExternalApiHandlerTemplate class [#686](https://github.com/altitudenetworks/external_api/pull/686)
- Remove unused referenced of SQL_CALC_FOUND_ROWS method in SQL queries [#687](https://github.com/altitudenetworks/external_api/pull/687)

### Fixed
- Risk summary email cron only runs for active projects [#688](https://github.com/altitudenetworks/external_api/pull/688)
- Fix sorting for person-id-events service and updated unit tests to verify behaviour [#693](https://github.com/altitudenetworks/external_api/pull/693)

## [3.5.1] - 2020-11-04
### Added
- Add changes from hotfix 3.5.0.post release to master branch [#676](https://github.com/altitudenetworks/external_api/pull/676)
- Add count_query sql to authorized app id events service [#679](https://github.com/altitudenetworks/external_api/pull/679)

### Changed
- Move all external api exceptions to exceptions sub module in external api template [#676](https://github.com/altitudenetworks/external_api/pull/676)
- Add validation for sensitive phrases inputs from customers with regular expression [#677](https://github.com/altitudenetworks/external_api/pull/677)
- Update apigateway authorizer to remove extra call to cognito [#678](https://github.com/altitudenetworks/external_api/pull/678)
- Add support for both access_token and id_token in apigateway authorizer [#681](https://github.com/altitudenetworks/external_api/pull/681)

### Fixed
- Fix get file_id permissions service to default order by to permissions_id instead of datetime [#674](https://github.com/altitudenetworks/external_api/pull/674)
- Verify build_file_event_response method gets actor information from database [#676](https://github.com/altitudenetworks/external_api/pull/676)

## [3.5.0] - 2020-10-28
### Added
- `MANIFEST.in` to include all services module files [#657](https://github.com/altitudenetworks/external_api/pull/657)
- Add maximum allowable page_size to respect the 6MB Lambda payload size limits [#660](https://github.com/altitudenetworks/external_api/pull/660)

### Changed
- Update delete permissions services to add emf metrics to cloudwatch [#654](https://github.com/altitudenetworks/external_api/pull/654)
- Raise 400 BadRequest error for bad parameters instead of sentry exceptions. [#653](https://github.com/altitudenetworks/external_api/pull/653)
- Update tools package to 10.3.1 to ensure LambaEvent errors don't raise sentry errors [#662](https://github.com/altitudenetworks/external_api/pull/662)
- Convert pagination TTL unit to seconds from milliseconds [#670](https://github.com/altitudenetworks/external_api/pull/670)

### Fixed
- Update risk summary emails to read current year programmatically [#655](https://github.com/altitudenetworks/external_api/pull/655)
- `include_package_data` is now enabled when building the package [#658](https://github.com/altitudenetworks/external_api/pull/658)
- Handle camel case responses from MySQL database properly and render the missing `createdAt` and `lastModified` file properties.
- Update files service to verify at any of `risk-id` `person-id` and `owner-id` is present in the query parameters.
- Fix page_count logic in sql_paginator and updated sql queries accordingly [#661](https://github.com/altitudenetworks/external_api/pull/661)
- Remove unnecessary left join with risks_files for risk_count query [#664](https://github.com/altitudenetworks/external_api/pull/664)
- Update sql_paginator to fetch get_row_count function only when count_query_string is not passed [#666](https://github.com/altitudenetworks/external_api/pull/666)
- Use `get_row_count` value only if `self_row_count` is None [#668](https://github.com/altitudenetworks/external_api/pull/668)

## [3.4.0] - 2020-10-09
### Changed
- Update tools version to 9.3.0 to fix CVE for CORS lambda response headers [#646](https://github.com/altitudenetworks/external_api/pull/646)

### Fixed
- Update the the apigateway integration tests to include valid `order-by` parameters for get-file-id-permissions test. [#647](https://github.com/altitudenetworks/external_api/pull/647)
- Security:
  - `files` service: Prevent SQL injection via `person-id`, `owner-id`, `risk-id` request parameters. [#648](https://github.com/altitudenetworks/external_api/pull/648)

## [3.3.0] - 2020-10-07
### Added
-  Add metric_manager property to embed user storage information to cloudwatch with EMT
- Add verify_cognito_token to determine user_email that created the request [#626](https://github.com/altitudenetworks/external_api/pull/626)
- `external_api.email_templates` to be included as package data with external_integration_api module [#629](https://github.com/altitudenetworks/external_api/pull/629)
- Add logging settings to API GW deployment (logdna subscription included) [#622](https://github.com/altitudenetworks/external_api/pull/622)

### Changed
-  Update tools to 8.23.0 [#626](https://github.com/altitudenetworks/external_api/pull/626)
- Update tools package to 9.1.0 to read `risk_summary_email` field from `data_state_table` to fetch active risk_type Ids
- Update `ExternalApiHandlerTemplate` subclasses to include job_name class variable as required in the break `tools-9.1.0` update [#628](https://github.com/altitudenetworks/external_api/pull/628)
- Move ApiGateway spec files from JSON to YAML for easy updates
- Update ApiGateway deployment scripts to follow current deployment patterns [#622](https://github.com/altitudenetworks/external_api/pull/622)
- `ExternalApiHandlerTemplate`:
  - Fold `normalize_order`, `parse_order` methods into `order_by` property method. The fact that these exist as separate methods and are called by only *some* of the handler classes was confusing.
  - In `order_by` and `sort` property methods, perform input validation. To this end, match `order-by` request param against a whitelist provided by each handler class, and match `sort` request param against the static whitelist of `ASC` or `DESC`. [#633](https://github.com/altitudenetworks/external_api/pull/633)
- Update apigateway configuration to allow any origins in dev environments [#642](https://github.com/altitudenetworks/external_api/pull/642)

### Removed
- Remove vulture whitelist from repo
- Remove unused `start-time`, `end-time`, `file-id` from risks query string parameters [#622](https://github.com/altitudenetworks/external_api/pull/622)
- Remove Legacy query parameters for risks endpoint [#627](https://github.com/altitudenetworks/external_api/pull/627)

### Fixed
- Fix risks by file_id predicate in risks service. [#625](https://github.com/altitudenetworks/external_api/pull/625)
- set `include_package_data` to False so custom package data logic takes precendence
- updated `external_api.email_templates` to include sub directories for inclusion [#631](https://github.com/altitudenetworks/external_api/pull/631)
- `external_api.swagger_templates` is now included as package data [#634](https://github.com/altitudenetworks/external_api/pull/634)
- fixed typo in `swagger_templates/rest_templates/*` package data inclusion [#635](https://github.com/altitudenetworks/external_api/pull/635)
- Fix potential SQL injection vulnerabilities via `order-by` or `sort` request params. [#633](https://github.com/altitudenetworks/external_api/pull/633)
- api gw endpoint integration request use lambda uri (was using authorizer uri)
- `x-amazon-apigateway-gateway-responses` response parameters typo (extra `-`)
- added `endpointConfigurationTypes` on creation of API (porting from https://github.com/altitudenetworks/external_api/blob/32136a36af527b4d9a164b2f908255206576fe36/external_api/apigw/deploy/utils/aws_create_api.py#L17) [#638](https://github.com/altitudenetworks/external_api/pull/638)
-  Update risks base query to order by datetime column since it's the new enforced sql injection prevention [#640](https://github.com/altitudenetworks/external_api/pull/640)
- Rename files service order_by parameter to `lastModified` instead of `lastmodified` [#643](https://github.com/altitudenetworks/external_api/pull/643)

## [3.2.0] - 2020-09-25
### Added
- Add new query string parameter `file-id` to people endpoint and updated base query accordingly. [#568](https://github.com/altitudenetworks/external_api/pull/568)
- Enable unit tests against MySQL container with schema. [#600](https://github.com/altitudenetworks/external_api/pull/600)
- Services have log group subscriptions for logdna [#621](https://github.com/altitudenetworks/external_api/pull/621)

### Changed
- Add `debug_mode` environment variables to service templates [#586](https://github.com/altitudenetworks/external_api/pull/586)
- Add support for file-id query parameter on the people api gateway spec [#568](https://github.com/altitudenetworks/external_api/pull/568)
- Update person-id-stats service to skip mysql call for `filesAccessible` metric [#580](https://github.com/altitudenetworks/external_api/pull/580)
- Format apigateway spec files for consistency [#591](https://github.com/altitudenetworks/external_api/pull/591)
- Update logger formatter to use JSONFormatter instead [#588](https://github.com/altitudenetworks/external_api/pull/588)
- Update tools to `8.0.0` to so LambdaSentryGuard no longer sends CloudWatch metrics if cloudwatch_namespace is not set.
- Remove `env` from DynamoConnect class  [#597](https://github.com/altitudenetworks/external_api/pull/597)
- Remove `log_level` parameter from LambdaHandler initialization.
- Bump tools to `7.10.0` to support log_level extraction from `ENV` variable [#584](https://github.com/altitudenetworks/external_api/pull/584)
- Update `/file/id/events`, `/app/id/events` and `/person/id/events/` have full event data
- Ensure consistency of all event output models. [#590](https://github.com/altitudenetworks/external_api/pull/590)
- `tests/conftest.py`:
  - Initialize mock `Config` with nicer data.
  - Disable AWS for all tests except integration tests.
- `file/<id>` endpoint: Upgrade unit tests to run against MySQL container with schema. [#600](https://github.com/altitudenetworks/external_api/pull/600)
- Update `authorized-app-id` and `files` service unit tests to use sql docker containers [#607](https://github.com/altitudenetworks/external_api/pull/607)
- Update `person_id_stats` to use cached query results stored on the `StatsMetricsTable` in Dynamo
- Add new pytest fixture for dynamodb local
- Test dynamodb functionality in `person_id_stats` unit tests [#606](https://github.com/altitudenetworks/external_api/pull/606)
- Update risks service base query to improve performance
- Read `file_count` from `top_risks` instead of running COUNT on `risks_files` table.
- Cleanup `person_id_stats` unit tests and services to verify get_previous_month correctness [#567](https://github.com/altitudenetworks/external_api/pull/567)
- Splits `downloads` UserStatsMetricRecord into `appDownloads` and `personDownloads` metric records [#609](https://github.com/altitudenetworks/external_api/pull/609)
- Update tools package to `8.17.0` to parse  metric values from dynamo are parsed as integers in `person_id_stats` service. [#614](https://github.com/altitudenetworks/external_api/pull/614)
- Add cloudwatch_namespace attribute to the  ExternalApiHandlerTemplate  class [#619](https://github.com/altitudenetworks/external_api/pull/619)
- Update risk summary emails service to exclude risk types 000s from list [#618](https://github.com/altitudenetworks/external_api/pull/618)
- Update tools package to `8.20.0` to include the user metrics stats table updates [#620](https://github.com/altitudenetworks/external_api/pull/620)

### Deprecated
- Remove `FilesAccessible` metric from person_id_stats service and apigateway definitions [#608](https://github.com/altitudenetworks/external_api/pull/608)
-  Remove `downloads` metric record support [#609](https://github.com/altitudenetworks/external_api/pull/609)

### Removed
- Remove collaborator count and collaborator emails from risks service and apigateway output model definition [#566](https://github.com/altitudenetworks/external_api/pull/566)
- Remove legacy code for `all` and `downloads`  metric names for `person_id_stats` service [#616](https://github.com/altitudenetworks/external_api/pull/616)

### Fixed
- Update tools to `7.9.0` version [#585](https://github.com/altitudenetworks/external_api/pull/585)
- date sorting applied to external section of person id events base query [#589](https://github.com/altitudenetworks/external_api/pull/589)
- Update `authorized-app-id-events` to parse `order-by` and `sort` parameters properly [#583](https://github.com/altitudenetworks/external_api/pull/583)
- `/files?risk-id`:
  - Ensure SQL queries return unique file_id results by adding `GROUP BY` and `ORDER BY` statements at the end queries to remove duplicates. [#602](https://github.com/altitudenetworks/external_api/pull/602)
- `ExternalApiHandlerTemplate`:
  - Ensure SQL queries commit their transactions. Otherwise uncommitted transactions will linger around, potentially blocking concurrent queries.
  - Fix bug in `ExternalApiHandlerTemplate.build_file` that incorrectly generated `sharedToDomains` result attribute when a file has multiple permissions. [#600](https://github.com/altitudenetworks/external_api/pull/600)
- Update `person_id_stats` service to be backward compatible. [#612](https://github.com/altitudenetworks/external_api/pull/612)
- Fix person id events and person id stats queries for appDownloads and personDownloads for correctness [#620](https://github.com/altitudenetworks/external_api/pull/620)

## [3.1.2] - 2020-08-20
### Added
- Move apigateway IaC and services into external_api repo [#513](https://github.com/altitudenetworks/external_api/pull/513)

### Changed
- Update deployment workflow to support api gateway deployment [#513](https://github.com/altitudenetworks/external_api/pull/513)

### Removed
- Remove vulture checks from external_integration_api repo [#565](https://github.com/altitudenetworks/external_api/pull/565)

### Fixed
- Add missing `GROUP BY` query fragment to `people` service sql queries. [#564](https://github.com/altitudenetworks/external_api/pull/564)
- `ApiGatewayAuthorizerHandler` to override _get_response_or_error to avoid LambdaHandler response formatting which breaks APIGW authorization [#575](https://github.com/altitudenetworks/external_api/pull/575)
- Fix page count for application id events service [#577](https://github.com/altitudenetworks/external_api/pull/577)

## [3.1.1] - 2020-08-14
### Fixed
- Add missing `GROUP BY` query fragment to `people` service sql queries. [#562](https://github.com/altitudenetworks/external_api/pull/562)

## [3.1.0] - 2020-08-14
### Added
- New fields to the person_id_events response [#547](https://github.com/altitudenetworks/external_api/pull/547)
- Added `metric_name` query string parameter to the `person_id_stats` service [#526](https://github.com/altitudenetworks/external_api/pull/526)
- Add query updates to return `iconUrl`, `lastIngested` and `mimeType` are returned for files responses [#549](https://github.com/altitudenetworks/external_api/pull/549)

### Changed
- Move exposure logic from file id events from sql to python [#542](https://github.com/altitudenetworks/external_api/pull/542)
- Update `tools` package to `7.2.0` [#548](https://github.com/altitudenetworks/external_api/pull/548)
- Update apigateway specs for person_id_events response
- Rename all `dateTime` references as datetime

### Fixed
- `app/<id>/events` endpoint: Performance improvements, and some internal improvements. [#546](https://github.com/altitudenetworks/external_api/pull/546)
- ensure `trashed` field is returned as boolean in `file` and `files` response
- Ensure 16 is replaced with 256 in the `iconUrl` for file related services
- Verify lastIngested is formatted properly in unix timestamp format. [#549](https://github.com/altitudenetworks/external_api/pull/549)
- Update `build_file` method to handle NoneType fields for IconURL from the DB [#555](https://github.com/altitudenetworks/external_api/pull/555)
- `person/<id>/stats` endpoint:
  - Split `allActivity` metric's subquery into two `UNION`ed subqueries that each count the number of events by *either* `actor_email` *or* `target_user`, respectively, allowing for better index support under MySQL. This generates a ~17x performance improvement for that specific metric. [
  #558](https://github.com/altitudenetworks/external_api/pull/558)

###
- Remove `severity` from person_id_events response [#547](https://github.com/altitudenetworks/external_api/pull/547)
- Break up person_id_stats sql query into smaller versions based on the metric names
- Update unit tests to handle new person stats service changes. [#526](https://github.com/altitudenetworks/external_api/pull/526)
- Update `person_by_app_id` query to improve performance [#550](https://github.com/altitudenetworks/external_api/pull/550)
- Updated `/person/id/stats` service to support multiple metric names as query params [#551](https://github.com/altitudenetworks/external_api/pull/551)
- `GROUP_CONCAT` linkVisibility sql results for later ranking by severity in `/file/id/` base query [#553](https://github.com/altitudenetworks/external_api/pull/553)

## [3.0.0] - 2020-08-01
### Added
- Created `run_read_query` and `run_write_query` methods to handle sql based operations in api services. [#527](https://github.com/altitudenetworks/external_api/pull/527)
- Adds `SUFFIX` variable to unit test actions workflow [#534](https://github.com/altitudenetworks/external_api/pull/534)

### Changed
- Update file_id_events unit test [#525](https://github.com/altitudenetworks/external_api/pull/525)
- Update unit tests and api services to use the newly created run query methods. [#527](https://github.com/altitudenetworks/external_api/pull/527)

### Deprecated
- Removed `run_query` method from external integration api services [#527](https://github.com/altitudenetworks/external_api/pull/527)

### Removed
- Remove all order-by attributes from frontend query builder except date_time for file_id_events service
- Remove severity, start_time, end_time attributes from api gateway response
- Remove start_time and end_time from frontend query builder logic
- Remove distinct from file_id_events base query [#525](https://github.com/altitudenetworks/external_api/pull/525)

### Fixed
- Adds suffix env variable to send coverage report task in push workflow [#537](https://github.com/altitudenetworks/external_api/pull/537)
- Fix get permissions status to return permissions for emails that have never been removed before
- Fix SQS queue names for bulk edit permissions services
- Parses the sqs message body properly to LambdaHandler for further processing [#530](https://github.com/altitudenetworks/external_api/pull/530)
- Add suffix env variable to `on_pr_merge` workflow to enable unit tests run properly [#538](https://github.com/altitudenetworks/external_api/pull/538)
-  Update is email permissions recently deleted logic to handle None and False values properly [#540](https://github.com/altitudenetworks/external_api/pull/540)
- Remove default values for the event_type property in external integration api template [#543](https://github.com/altitudenetworks/external_api/pull/543)

## [3.0.0] - 2020-07-28
### Added
- Created `run_read_query` and `run_write_query` methods to handle sql based operations in api services. [#527](https://github.com/altitudenetworks/external_api/pull/527)

### Changed
- Update file_id_events unit test [#525](https://github.com/altitudenetworks/external_api/pull/525)
- Update unit tests and api services to use the newly created run query methods. [#527](https://github.com/altitudenetworks/external_api/pull/527)

### Deprecated
- Removed `run_query` method from external integration api services [#527](https://github.com/altitudenetworks/external_api/pull/527)

### Removed
- Remove all order-by attributes from frontend query builder except date_time for file_id_events service
- Remove severity, start_time, end_time attributes from api gateway response
- Remove start_time and end_time from frontend query builder logic
- Remove distinct from file_id_events base query [#525](https://github.com/altitudenetworks/external_api/pull/525)

## [2.1.0] - 2020-07-23
### Changed
- `tools` to `v7.0.0` [#503](https://github.com/altitudenetworks/external_api/pull/503)

### Fixed
- risk summary email event rule only enabled for `thoughtlabs` in `staging` environment [#514](https://github.com/altitudenetworks/external_api/pull/514)
- Update get file_id permissions service to handle default order by values from apigateway [#517](https://github.com/altitudenetworks/external_api/pull/517)
- Added CONF_DIR to delete_permission_id service [#522](https://github.com/altitudenetworks/external_api/pull/522)

## [2.0.0] - 2020-07-20
### Added
- a "reserved concurrency" value for `delete-permission-id` lambda [#447](https://github.com/altitudenetworks/external_api/pull/447)

### Changed
- updated default branch to `master` [#486](https://github.com/altitudenetworks/external_api/pull/486)
- Update tools to 6.8.0 to fix pathParameter errors
- Update repo_checker which improved code formatting
- Enable external api template properties pass default values [#501](https://github.com/altitudenetworks/external_api/pull/501)
- Rewrite `call_data_state` method to call sensitive_phrases methods directly [#505](https://github.com/altitudenetworks/external_api/pull/505)
- Update file_id service to include new fields for api gateway response. [#494](https://github.com/altitudenetworks/external_api/pull/494)
- Fetch file_owner information for risks of type 1000s [#507](https://github.com/altitudenetworks/external_api/pull/507)

### Removed
- unused legacy `__version__.py` [#485](https://github.com/altitudenetworks/external_api/pull/485)
- Remove collaboratorCount from risks service definition [#483](https://github.com/altitudenetworks/external_api/pull/483)

### Fixed
- pyproject toml to check `setup.py`
- removed legacy python version `3.6`
- added requirements.txt
- basic linting erros (disabling pylint check because there's a lot remaining) [#485](https://github.com/altitudenetworks/external_api/pull/485)
- Convert `labels` for person_id_stats response to UNIX timestamp format. [#495](https://github.com/altitudenetworks/external_api/pull/495)
- Pass user information to all segment altimeter methods for proper context around user activity [#496](https://github.com/altitudenetworks/external_api/pull/496)
- Handle file metric record normalization properly in risks_tiles service
- Process risk_type_ids properly in risks service [#499](https://github.com/altitudenetworks/external_api/pull/499)
- Updated the external_api_template properties and fixed unit tests accordingly [#500](https://github.com/altitudenetworks/external_api/pull/500)
- Rename `domain` references as `domains` in file_id base query sql file. [#510](https://github.com/altitudenetworks/external_api/pull/510)

## [1.9.1] - 2020-06-25 [Nyah Check](nyah@altitudenetworks.com)
### Added
- Created new `delete_permissions_status` service to check on bulk Edit permissions job. [#455]()
- Update deployment to onboard `panda`. [#448]()
- Add delete permissions status service draft. [#455]()

- Add `message_count` and `message_number` variables to the delete_by_email and delete_by_risk_id services. [#437]()

- Update user spotlight response to return `permissions_last_deleted_on_datetime` attribute for each email address. [#390]()
- Add `delete_permissions_orchestrator` service. [#391]()
- Add `PermissionsConnector` class. [#372]()
- Add `delete_permission_ids` service. [#372]()
- Add `delete_permissions_by_email` service. [#372]()
- Add `delete_permissions_by_risk_id` service. [#372]()
- Add `get_file_permissions` service. [#372]()
- Update `risks` service to check `status` column. [#372]()
- Add pagination params to `get_file_id_permissions` service . [#395]()
- Add different error states `ForbiddenError`, `NotAuthorizedError`, `NotFoundError` for `delete_permission_id` service. [#399]()
- Read risks and file info from `risks_files` with top_risks table. [#409]()
- Add retry logic to `PermissionsConnector` class. [#410]()

- Bump `tools` to `1.0.1` and `data-management` to `0.2.2`. [#380]()

- [x] Update the `risks` service `file_count` to read from corresponding column in RDS. [#370]()

- [x] Add new services for `authorized-app-id`, `authorized-app-id-events`, `authorized-app-id-stats`. [#339]()
- [x] Add unit tests for new `authorized-app` services and included failure cases. [#339]()
- [x] Add RDS Certificate updates to `external_api` master. [#356]()

- [x] Update `run_query` method in `ExternalApiHandlerTemplate` to fail on invalid file_path param [#316]()
- [x] Add `ExternalApiHandlerTemplate` in `FilesHandler` class [#316]()
- [x] Update `PersonStats` service base query to add `risks_created` and `atRiskFilesOwned` counts to statistics [#320]()
- [x] Use `ExternalApiHandlerTemplate` to `PersonStatsHandler` service [#320]()
- [x] Capture `creator-id` query param in `RisksHandler` service to handle risks created by user `/risks` query builder in RiskTiles v2.0. [#321]()
- [x] Capture `file-id` query param in `RisksHandler` service to handle risks associated with a file in `/risks` query builder in Risktiles v2.0. [#321]()
- [x] Add base query for `atRiskFilesByOwner` for `Files` service to support `RiskTiles` v2.0 [#324]()
- [x] Add new base query for `FilesOwned` by user for `FilesHandler` service to support `RiskTiles` v2.0 [#324]()
- [x] Add Full query generation for `FilesHandler` service to factor in new params(`owner`, `at-risk`) to capture at risk files
	  associated with risks belong to a user(`owner`) to support `RiskTiles` v2.0 [#324]()
- [x] Add `ExternalApiHandlerTemplate` to `PeopleService` to fix integration test errors. [#325]()
- [x] Point Pipfile deps to internal `pypi` server. [#330]()
- [x] Add unit tests for `RisksTilesHandler` v2.0 service and mock object responses.
- [x] Add queries to fetch risk tile `file_info` and `person_info` as temporary solution to `UsersTable` and `FilesTable` defects with Dynamo

- [x] Add new customer projects to deployment templates[#311]()
- [x] Add RisksClass to risks service [#310]()
- [x] Update people in staging [#308]()

### Changed
- Use `SQLConnect` instead of `FrontendQueryExecutor`, report slow queries to Sentry[#465]()
- Update `get_permissions_status` service to check for edge cases in email_identification and risk_status. [#470]()
- Updated file_events query to use the target_user_domain virtual column in admin_reports_v1_drive. [#472]()
- Update tools version to `6.3.0`. [#474]()
- Update delete_permissions_service to handle unexpected exceptions from the permissions_connector service in tools. [#474]()
- Update service templates for update email and risk status to timeout after 15 mins. [#478]()
- Update delete permission id status to create suffix env variable. [#478]()
- Optimized the `person_id_stats` base query to reduce service latency. [#475]()

- Update `risks` service to use python string templates to speed up query. [#464]()
- Update Edit Permissions service to skip file permissions of role `owner`. [#465]()
- Verify altitude networks has the required file scopes to remove a permission if not return a 401 response. [#449]()
- Checks all Edit Permissions endpoints for required scopes from Org before proceeding with Editing permissions associated with risks, emails and/or files. [#451]()
- Update active customers in deploy configs. [#454]()
- Update risk_summary emails unit test. [#458]()

- Bump `external_integration_api` version to 1.8.0. [#440]()
- Update all EditPemissions services to new architectural changes. [#429]()
- Remove `demo` and inactive projects from deploy configs. [#430]()
- Update `delete_permissions_orch` service to update file permission ids on `drive_v3_filesmeta`
	table before sending messages to delete-permissions-id queue. [#431]()
- Rename variable names in sqs messages to be more descriptive. [#431]()
- Update `permissions_status` column on `drive_v3_filesmeta` table so the permission no longer appears once it's removed. [#434]()
- Update `permissions_delete_by_email` service to skip deleted permissions. [#435]()
- Mark `risk_id` as removed if there are no permissions associated with with it. [#435]()
- Handle `NoneType` query string params for `get_file_id_permissions` service. [#435]()
- Update `delete_permissions_orch `service to handle these new message count variables. [#437]()

- Bump `tools` to `3.2.0` and `data-management` to `0.2.6`
- Updates references to `file_count` from top risks table to `SUM(r.file_count)` instead. [#385]()
- Update `risks` service to return application-name and application id for risk type 3010. [#389]()
- Use `PermissionsConnector` class from tools package . [#400]()
- Bump `external_api` version to `1.7.0`. [#400]()
- Update `people` and `files` queries to support `risks_files` table [#409]()
- Update risks base query to coalesce file owner details from `top_risks` and `drive_v3_filesmeta` tables. [#412]()
- Improve exception handling for `permissions_delete` services. [#413]()
- Simplify `risks` sql queries to handle multiple query string params and edge cases for `risks-type-ids` list. [#415]()
- Use string templates to parse order and sort params for risks service [#419]()
- Update `person_id_stats` query to use `risks_files` table [#421]()
- Simplify `files` sql queries into 2 files [#423]()
- Add `render_query_template` method to `external_api_handler` class to properly parse order and sort params for all queries. [#425]()
- Update `risk_stats`, `risk_summary_emails`  and `person_id` base queries to skip inactive risks. [#428]()
- Update `delete_permissions_by_risk_id` query to use risks_files table. [#428]()
-

- Move `file_id_events` and `person_id` and `file_id` services to ExternalApiTemplate. [#367]()
- Update `risk_summary_emails` service to read email addresses from Dynamo table. [#380]()
- Update `external_api_template.run_query` to use updates in tools package from project SAR. [#380]()

- [x] Move unix time conversion for `files` service to sql instead. [#347]()
- [x] Remove `gs-scraper` and `google-apiclient` from setup py and use tools package instead. [#348]()

- [x] Update `_build_persons` method in `ExternalApiHandlerTemplate` to handle `None` params [#316]()
- [x] Move `order by` params from `FilesHandler` query builder to base SQL query [#316]()
- [x] Update `files` service test to use `FilesHandler` class [#316]()
- [x] Update `person_id_stats` unit test to use `PersonStatsHandler` class [#320]()
- [x] Update the `file_risk_count` query for files endpoint to support `RiskTiles`
- [x] Bump external_integration_api application to `1.6.5` matching current release [#313]()
- [x] Update `is_internal` method for `ExternalApiHandler` template. [#313]()
- [x] Move `RisksTilesHandler` SQL queries to `risk_detection`. [#313]()
- [x] Update `setup.py` file to match format in other repos. [#313]()
- [x] Bump `data-management`, `gs_scraper` and `tools` packages to `0.1.12`, `0.2.6` and `0.2.5` respectively [#313]()
- [x] Update references to `owner` as `owner-id` for files query params following API Gateway updates
- [x] Fetch most recent `risk_tile` if risk tiles for current date is not available [#334]()
- [x] Updated tools package to `0.2.5` to enable passing default response to event get_query_parameter method [#335]()

### Fixed
- Move parse_order method from risks to external_api_template class and fix file_id_events service. [#471]()


[1.9.0] - 2020-06-15 [Nyah Check](nyah@altitudenetworks.com)

- Update person id events query to parse file id properly. [#450]()
- Fixes typo in update_email address query. [#456]()
- sensitive_phrases service is unable add risk keywords which are partial in exactness. [#457]()
- Update files query to use python string templates to build SQL queries to create more optimized queries. [#459]()
- AWS CLI is missing from travis build which is causing legacy scripts to fail. [#461]()


[1.8.2] - 2020-06-10 [Joe Fatora](joe@altitudenetworks.com)

- Updates slow queries causing timeouts in the files by risk id endpoint for one customer in production.
	This outage was reported Monday, June 8th 2020 Timeouts from api endpoint when requesting files by risk id. [#462]()
- Make all emails in person_id service and risks service lowercase. [#452]()


[1.8.0] - 2020-05-21 [Nyah Check](nyah@altitudenetworks.com)

## Fixes
- [x] Fix `sort` and `order by` params for `authorized_app_id_events` service. [#371]()


[1.6.5] - 2020-02-06 [Nyah Check](nyah@altitudenetworks.com)

## [1.6.1] - 2020-01-07 [Nyah Check](nyah@altitudenetworks.com)
### Added
- [x] Add API Layer base class for all services [#298](https://github.com/altitudenetworks/external_api/pull/298)
- [x] Update query executor to use RDS API for read only endpoints [#303](https://github.com/altitudenetworks/external_api/pull/303)

### Changed
- [x] Update summary emails to use PST [#297](https://github.com/altitudenetworks/external_api/pull/297)
- [x] Update Altimeter service to use API Base class [#300](https://github.com/altitudenetworks/external_api/pull/300)
- [x] Refactor company domains service to use API Base Class [#301](https://github.com/altitudenetworks/external_api/pull/301)
- [x] Update Lambda service deploy templates to set 30s timeout [#302](https://github.com/altitudenetworks/external_api/pull/302)

## [1.6.0] - 2019-12-17 [Nyah Check](nyah@altitudenetworks.com)
### Added
- [x] Add updates release 1.6.0 to changelog [#296](https://github.com/altitudenetworks/external_api/pull/296)

### Changed
- [x] Improve the SQL query for all people endpoint [#296](https://github.com/altitudenetworks/external_api/pull/296)

## [1.5.9] - 2019-12-12 [Nyah Check](nyah@altitudenetworks.com)
### Added
- [x] New Risks summary email style updates [#280](https://github.com/altitudenetworks/external_api/pull/280)
- [x] Add risk tiles endpoint [#285](https://github.com/altitudenetworks/external_api/pull/285)

### Changed
- [x] Verify risk creator object for specific risk types [#287](https://github.com/altitudenetworks/external_api/pull/287)

## [1.5.8] - 2019-11-18 [Nyah Check](nyah@altitudenetworks.com)
### Added
- [x] Add sensitive phases endpoint [#257](https://github.com/altitudenetworks/external_api/pull/257)
- [x] Add CHANGELOG.md
- [x] Add company domains endpoint [#260](https://github.com/altitudenetworks/external_api/pull/260)
- [x] Add maximum keyword check to sensitive phrases [#273](https://github.com/altitudenetworks/external_api/pull/274)

### Changed
- [x] Update status code for already deleted keywords
- [x] Display only externally visible sensitive keywords
- [x] Update data state manager to handle tagging and visibility of keywords

## [1.5.7] - 2019-10-29 [Nyah Check](nyah@altitudenetworks.com)
### Added
- [x] Add check for null actor_emails [#249](https://github.com/altitudenetworks/external_api/pull/249)
- [x] Verify risk stats only when active status is 1 [#250](https://github.com/altitudenetworks/external_api/pull/250)
- [x] Verify if risks is active in risks endpoint [#252](https://github.com/altitudenetworks/external_api/pull/252)

### Changed
- [x] Renamed top-risks lambda to risks [#253](https://github.com/altitudenetworks/external_api/pull/253)

## [1.5.5] - 2019-10-24 [Nick Grisafi](nick@altitudenetworks.com)
### Added
- [x] Adds viper and kingfisher projects
- [x] Adds hyperlinks to risk summary emails

### Changed
- [x] Removes sorena project
- [x] Fix query count for risk summary emails
- [x] Update risk summary email links to be by environment

## [1.5.4] - 2019-10-22 [Joe Fatora](joe@altitudenetworks.com)
* Post force-push carnage release.
* I think these are the correct changes but that needs to be audited by [@ch3ck](https://github.com/ch3ck)
	to ensure this was all released

## [v1.5.2] - [Nyah Check](nyah@altitudenetworks.com)
* Release [#240](https://github.com/altitudenetworks/extrernal_integration_apis/pull/240)
* This is our first changelog for this repo, it will look odd.
* Previous changelogs where added to the PRs merged into master

### Changed
- [x] Permissions actions lambda [#237](https://github.com/altitudenetworks/external_api/pull/237)
- [x] Permissions lookup lambda [#234](https://github.com/altitudenetworks/external_api/pull/234)

## [apigateway] - - 2020-07-15 [Nyah Check](nyah@altitudenetworks.com)
* PR [#513](https://github.com/altitudenetworks/external_api/pull/513/files) brings apigateway into this repo.
* Previous releases for apigateway changes can be viewed [here](https://github.com/altitudenetworks/apigateway/blob/develop/CHANGELOG.md)
* Subsequent apigateway changes will go into our normal repo_checker release process

### Added
- Add new fields to the FileOutputModel and Person output models. [#139](https://github.com/altitudenetworks/apigateway/pull/139)
- Add `order_by` to files specs. [#128](https://github.com/altitudenetworks/apigateway/pull/128)
- Add `permissions_status` service to check the status of a specific eventId for delete permissions by file id or email. [#131](https://github.com/altitudenetworks/apigateway/pull/131)
- Add active field for permissions status. [#132](https://github.com/altitudenetworks/apigateway/pull/132)
- [x] `permissions` endpoint with `email` query params. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- [x] `permission` endpoint with `permissionId` path param. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- [x] `risk/{riskId}/permissions` endpoint with `file-id` optional query param. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- [x] `file/{fileId}/permissions` endpoint with `fileId` path param. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- [x] `PermissionDeleteModel` to work for delete method responses. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- [x] `risk/{riskId}/permissions` with `riskId` path param and `file-id` query params. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- [x] Added `application_id` api endpoints. [#109](https://github.com/altitudenetworks/apigateway/pull/109)
- [x] Added `application_id_stats` api endpoint specs. [#109](https://github.com/altitudenetworks/apigateway/pull/109)
- [x] Added `application_id_events` api endpoint specs. [#109](https://github.com/altitudenetworks/apigateway/pull/109)
- [x] Added model schema templates for new `application-id` endpoints. [#109](https://github.com/altitudenetworks/apigateway/pull/109)
- [x] Update Pipfile to reference internal `Pypi` packages. [](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Update `/files` endpoint to accept `at-risk`, `owner-id` query params for `RiskTiles` v2.0
- [x] Update `/risks` endpoint to accept `creator-id` and `at-risk` params for `RiskTiles` v2.0
- [x] Update `FilesOutputSchema` to add `risksCreated` and `atRiskFilesOwned` fields to series object for `RiskTiles` v2.0
- [x] Update `/risks` and `/files` tests to test new RiskTiles v2.0 query params. [#108](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Add New API Gateway integration tests for all endpoints [#93](https://github.com/altitudenetworks/apigateway/pull/93)

### Changed
- Update API Gateway integration tests. [#136](https://github.com/altitudenetworks/apigateway/pull/136)
- Improves the `slack_alert` property to keep it DRY. [#130](https://github.com/altitudenetworks/apigateway/pull/130)
- Update setup py to use latest versions of tools(v5.6.1) and request(v2.23.0) packages. [#133](https://github.com/altitudenetworks/apigateway/pull/133)
- Improves the `slack_alert` property to keep it DRY. [#130](https://github.com/altitudenetworks/apigateway/pull/130)
- Update setup py to use latest versions of tools(v5.6.1) and request(v2.23.0) packages. [#133](https://github.com/altitudenetworks/apigateway/pull/133)
- Update `PermissionsOutputModel` to work for all permission responses. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- Stop tracking `apigw_swagger_rest_api.json` in the `apigateway` repo. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- Add more code formatting to deployment workflow. [#121](https://github.com/altitudenetworks/apigateway/pull/121)
- [x] Bump `api_version` number to `2.0.8`. [#109](https://github.com/altitudenetworks/apigateway/pull/109)
- [x] Add `application-id` query params to `risks` and `people` endpoint specs. [#109](https://github.com/altitudenetworks/apigateway/pull/109)
- [x] Update `apigateway` integration tests to check new `application` id endpoint updates. [#109](https://github.com/altitudenetworks/apigateway/pull/109)
- [x] Update PR Template formatting [#](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Update travis yml to run `flake8` and `pylint` tests on PRs. [](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Update ApiGateway Integration tests to skip `permissions/delete` tests. [](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Update Authorizer lambda use latest changes to `tools` configs class. [](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Bump tools package to version `0.2.5`. [#108](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Bump `apigateway` version to `1.0.7`. [#108](https://github.com/altitudenetworks/apigateway/pull/108)
- [x] Improved Test lambda to use LambdaHandler class from tools [#95](https://github.com/altitudenetworks/apigateway/pull/95)

### Removed
- Deprecated collaborator_count field from risks service. [#137](https://github.com/altitudenetworks/apigateway/pull/137)
