import config from 'config'

export const GENERAL_URLS = {
  ALTIMETER: `/${config.apiGateway.PREFIX}/altimeter`,
  APPLICATION: `/${config.apiGateway.PREFIX}/application`,
  DASHVIEW_STATS: `/${config.apiGateway.PREFIX}/dashview/stats`,
  RISKS: `/${config.apiGateway.PREFIX}/risks`,
  RISKS_SETTINGS: `/${config.apiGateway.PREFIX}/risks/settings`,
  RISK: `/${config.apiGateway.PREFIX}/risk`,
  FILE: `/${config.apiGateway.PREFIX}/file`,
  FILES: `/${config.apiGateway.PREFIX}/files`,
  PERSON: `/${config.apiGateway.PREFIX}/person`,
  PEOPLE: `/${config.apiGateway.PREFIX}/people`,
  PERMISSIONS: `/${config.apiGateway.PREFIX}/permissions`,
  PERMISSION: `/${config.apiGateway.PREFIX}/permission`,
  SENSITIVE_PHRASE: `/${config.apiGateway.PREFIX}/sensitive-phrase`,
  SENSITIVE_PHRASES: `/${config.apiGateway.PREFIX}/sensitive-phrases`,
  STATS: `/${config.apiGateway.PREFIX}/stats`,
  COMPANY_INFO: `/${config.apiGateway.PREFIX}/company-information`,
  MARKETPLACE: `/${config.apiGateway.PREFIX}/marketplace`,
  SLACK_NOTIFICATIONS: `/${config.apiGateway.PREFIX}/slack/notifications`
}

export const INTEGRATION_URLS = {
  SLACK: `/slack`,
  BOXLITE: `/boxlite`,
  FILE: `/file`
}
