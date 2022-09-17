const BASE_URIS = {
  HOST: 'http://localhost:3000',
  API: `/dev-01`,
}

if (Cypress.env('HEARTBEAT_TEST')) {
  BASE_URIS.HOST = 'https://app.altitudenetworks.com'
  BASE_URIS.API = `/prod-01`
}
// switch (Cypress.env('NODE_ENV')) {
//   case 'staging':
//     BASE_URIS.host = 'https://app-staging.altitudenetworks.com'
//     BASE_URIS.api = `/staging-01`
//     break
//   case 'production':
//     BASE_URIS.host = 'https://app.altitudenetworks.com'
//     BASE_URIS.api = `/prod-01`
//     break
// }

const MANY_DOWNLOADS_BY_APP_ID = 3010
const SENSITIVE_FILE_SHARED_BY_LINK_EXTERNAL = 1021
const FILE_SHARED_BY_LINK_EXTERNAL_DATE = 1050
const RISK_TYPE_IDS = {
  MANY_DOWNLOADS_BY_APP_ID,
  SENSITIVE_FILE_SHARED_BY_LINK_EXTERNAL,
  FILE_SHARED_BY_LINK_EXTERNAL_DATE,
}

module.exports = {
  BASE_URIS,
  RISK_TYPE_IDS,
}
