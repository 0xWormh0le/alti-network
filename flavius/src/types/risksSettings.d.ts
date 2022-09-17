interface RiskSettingsDomain {
  domain: string
  allowDelete?: boolean
}

interface RiskSettingsApp {
  appId: string
  appDesc: string | undefined
}

interface DefaultThreshold {
  internal: number
  external: number
}

interface DefaultThresholdPost {
  settingValue: {
    actor: RiskThresholdActorType
    defaultThreshold: number
  }
}

interface WhitelistedDomainPost {
  settingValue: RiskSettingsDomain
}

interface WhitelistedAppPost {
  settingValue: RiskSettingsApp
}

interface InternalDomainPost {
  settingValue: RiskSettingsDomain
}

interface DefaultThresholdResponse {
  settings: {
    defaultThreshold: DefaultThreshold
  }
}

type WhitelistedDomainsResponse = ServerResponseData<{
  settings: {
    whitelistedDomains: RiskSettingsDomain[]
  }
}>

type WhitelistedAppsResponse = ServerResponseData<{
  settings: {
    whitelistedApps: RiskSettingsApp[]
  }
}>

type InternalDomainsResponse = ServerResponseData<{
  settings: {
    internalDomains: RiskSettingsDomain[]
  }
}>
