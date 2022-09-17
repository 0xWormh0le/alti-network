import Amplify from '@aws-amplify/core'
import Auth from '@aws-amplify/auth'
import config from 'config'
import { GENERAL_URLS, INTEGRATION_URLS } from './endpoints'

async function getAuthorizationHeader() {
  try {
    const session = await Auth.currentSession()
    return {
      Authorization: session.getIdToken().getJwtToken()
    }
  } catch (_error) {
    await Auth.signOut()
    window.location.pathname = '/login'
    return
  }
}

const internalEndpoints = Object.keys(GENERAL_URLS).map((nextKey: string) => {
  return {
    name: nextKey.toLowerCase(),
    endpoint: `https://${config.apiGateway.ID}`,
    region: 'us-west-2',
    custom_header: getAuthorizationHeader
  }
})

const integrationEndpoints = Object.keys(INTEGRATION_URLS).map((nextKey: string) => {
  return {
    name: nextKey.toLowerCase(),
    endpoint: `https://${config.apiGateway.INTEGRATION_API_ID}`,
    region: 'us-west-2',
    custom_header: getAuthorizationHeader
  }
})

export function configureAmplify(isOauth: boolean) {
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
      authenticationFlowType: isOauth ? 'CUSTOM_CHALLENGE' : 'USER_PASSWORD_AUTH',
      oauth: config.cognito.OAUTH
    },
    API: {
      endpoints: [...internalEndpoints, ...integrationEndpoints]
    }
  })
}
