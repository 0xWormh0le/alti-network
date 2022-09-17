import UI_STRINGS from 'util/ui-strings'
import GoogleLogo from 'icons/google-logo.svg'
import Office365Logo from 'icons/office-365.svg'
import BoxLogo from 'icons/box.svg'

interface EnvConfig {
  cognito: {
    [x: string]: string | object
  }
  apiGateway: {
    [x: string]: string
  }
  google: {
    [x: string]: string
  }
  hubspot: {
    portalId: string
    region: string
    formIds: { [x: string]: string }
  }
}

interface Config extends EnvConfig {
  navigationItemsNames: {
    [x: string]: string
  }
  navigationItemsParams: {
    [x: string]: string[] // this will create a route like /name/:param1/:param2
  }
  featureFlags: {
    [x: string]: boolean
  }
}

const devConfig = {
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_ZpS8EAx9w',
    APP_CLIENT_ID: 'cakgqb2divam0h4g12igcnt9r',
    IDENTITY_POOL_ID: 'us-west-2:3928093c-3d70-4e3f-bd65-4bda769bcef0',
    OAUTH: {
      domain: 'altitude-dev.auth.us-west-2.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'https://app-dev.altitudenetworks.com/login',
      redirectSignOut: 'https://app-dev.altitudenetworks.com/logout',
      responseType: 'token'
    }
  },
  apiGateway: {
    ID: 'api-dev.altitudenetworks.com',
    PREFIX: 'dev-01',
    INTEGRATION_API_ID: 'integrations-dev.altitudenetworks.com'
  },

  google: {
    oauthApiId: '168135393226-krdnuevsrujer29qtj8pf9rh9emmbc30.apps.googleusercontent.com',
    gtmId: 'GTM-TKR26H7'
  },
  hubspot: {
    region: 'na1',
    portalId: '5502362',
    formIds: {
      GoogleApp__contactus: '00d7cf69-3ad1-4e29-bb52-8b688e678a16',
      Support: '292c57c9-7e9f-4a00-950e-d00db0f096c8'
    }
  }
}

const localConfig = {
  ...devConfig,
  cognito: {
    ...devConfig.cognito,
    OAUTH: {
      ...devConfig.cognito.OAUTH,
      redirectSignIn: 'http://localhost:3000/login',
      redirectSignOut: 'http://localhost:3000/logout'
    }
  }
}

const stagingConfig = {
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_6xwkoNEdf',
    APP_CLIENT_ID: '4rmpfmvssapuq714ehn0njhcc0',
    IDENTITY_POOL_ID: 'us-west-2:ea22d1db-54f9-45ca-8420-606c09bcdec8',
    OAUTH: {
      domain: 'altitude-staging.auth.us-west-2.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'https://app-staging.altitudenetworks.com/login',
      redirectSignOut: 'https://app-staging.altitudenetworks.com/logout',
      responseType: 'token'
    }
  },
  apiGateway: {
    ID: 'api-staging.altitudenetworks.com',
    PREFIX: 'staging-01',
    INTEGRATION_API_ID: 'integrations-staging.altitudenetworks.com'
  },
  google: {
    oauthApiId: '168135393226-krdnuevsrujer29qtj8pf9rh9emmbc30.apps.googleusercontent.com'
  },
  hubspot: {
    region: 'na1',
    portalId: '5502362',
    formIds: {
      GoogleApp__contactus: '00d7cf69-3ad1-4e29-bb52-8b688e678a16',
      Support: '292c57c9-7e9f-4a00-950e-d00db0f096c8'
    }
  }
}

const prodConfig = {
  cognito: {
    REGION: 'us-west-2',
    USER_POOL_ID: 'us-west-2_6J7EmoaVH',
    APP_CLIENT_ID: '607u8a29qtad27bdtus94g1neb',
    IDENTITY_POOL_ID: 'us-west-2:adb7ab89-4f57-4f65-aef0-452e04e85537',
    OAUTH: {
      domain: 'altitude.auth.us-west-2.amazoncognito.com',
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: 'https://app.altitudenetworks.com/login',
      redirectSignOut: 'https://app.altitudenetworks.com/logout',
      responseType: 'token'
    }
  },
  apiGateway: {
    ID: 'api.altitudenetworks.com',
    PREFIX: 'prod-01',
    INTEGRATION_API_ID: 'integrations.altitudenetworks.com'
  },
  google: {
    oauthApiId: '168135393226-krdnuevsrujer29qtj8pf9rh9emmbc30.apps.googleusercontent.com'
  },
  hubspot: {
    region: 'na1',
    portalId: '5502362',
    formIds: {
      GoogleApp__contactus: '00d7cf69-3ad1-4e29-bb52-8b688e678a16',
      Support: '292c57c9-7e9f-4a00-950e-d00db0f096c8'
    }
  }
}

let config: EnvConfig = devConfig // default to dev if not set
const configMapping = {
  dev: devConfig,
  staging: stagingConfig,
  localdemo: localConfig,
  production: prodConfig
}

if (process.env.REACT_APP_STAGE) {
  config = configMapping[process.env.REACT_APP_STAGE]
}

// All non lite platforms
export const platforms: BasicPlatformData[] = [
  {
    platformId: UI_STRINGS.PLATFORMS.GSUITE_ID,
    platformName: UI_STRINGS.PLATFORMS.GSUITE_NAME,
    resourcesLink: 'test',
    canConnect: false
  },
  {
    platformId: UI_STRINGS.PLATFORMS.O365_ID,
    platformName: UI_STRINGS.PLATFORMS.O365_NAME,
    resourcesLink: 'test',
    canConnect: false
  }
]

// All non lite riskTypeGroups
export const riskTypeGroups: BasicRiskTypeGroup[] = [
  {
    groupType: 1,
    name: UI_STRINGS.DASHBOARD.SHARING_RISKS
  },
  {
    groupType: 2,
    name: UI_STRINGS.DASHBOARD.RELATIONSHIP_RISKS
  },
  {
    groupType: 3,
    name: UI_STRINGS.DASHBOARD.ACTIVITY_RISKS
  },
  {
    groupType: 0,
    name: UI_STRINGS.DASHBOARD.INFORMATIONAL_RISKS
  }
]

// All lite platforms
export const platformsLite: BasicPlatformData[] = [
  {
    platformId: UI_STRINGS.PLATFORMS.BOX_ID,
    platformName: UI_STRINGS.PLATFORMS.BOX_NAME,
    canConnect: true
  }
]

export const platformImages: { [platformId: string]: { Icon: string; src: string } } = {
  [UI_STRINGS.PLATFORMS.GSUITE_ID]: {
    Icon: GoogleLogo,
    src: 'icons/google-logo.svg'
  },
  [UI_STRINGS.PLATFORMS.O365_ID]: {
    Icon: Office365Logo,
    src: 'icons/office-365.svg'
  },
  [UI_STRINGS.PLATFORMS.BOX_ID]: {
    Icon: BoxLogo,
    src: 'icons/box.svg'
  }
}

export default {
  // Common config values here
  navigationItemsNames: {
    ACTIVITY: 'Activity',
    DASHBOARD: 'Dashboard',
    RISKS: 'Risks',
    FILE: 'File',
    FILES: 'Files',
    PEOPLE: 'People',
    SPOTLIGHT: 'Spotlight',
    APP_SPOTLIGHT: 'App Spotlight',
    EDIT_FILE_PERMISSION: 'Edit File Permissions',
    RESOLVE_RISK: 'Resolve Risk',
    PLUGINS: 'Plugins',
    SETTINGS: 'Settings',
    LOGIN: 'Login',
    SIGN_UP: 'Sign Up',
    NOT_FOUND: 'Not Found',
    SEARCH: 'Search',
    LOGOUT: 'Logout',
    RISK_SETTINGS: 'Risk Settings',
    GOOGLE_APP: 'Google App',
    GOOGLE_RESULTS: 'Google Results',
    GOOGLE_LOGIN: 'Google Login',
    MANAGE_PLATFORMS: 'Manage Platforms'
  },
  navigationItemsParams: {
    ACTIVITY: ['platformId']
  },
  featureFlags: {
    ENABLE_BULK_PERMISSION_EDIT: true
  },
  ...config
} as Config
