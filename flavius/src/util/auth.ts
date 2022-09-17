import config from 'config'
import jwtDecode from 'jwt-decode'
import { retrieveFromStorage } from './storage'

/**
 * Initiates a federated login cycle with Cognito
 * @param idpIdentifier The cognito identifier for the identity provider
 * @param provider The general provider name, used for verification
 * @param nextPath
 */
export const federatedLoginUsingIdpIdentifier = (idpIdentifier: string, provider: string, nextPath?: string) => {
  const oauthConfig = config.cognito.OAUTH as { scope: string[] } & { [k: string]: string }

  const stateObject: { provider: string; nextPath?: string } = {
    provider
  }

  // Not initializing it in the object to prevent coming back as
  // a query param with a string 'null'
  if (nextPath) {
    stateObject.nextPath = nextPath
  }

  const state = JSON.stringify(stateObject)

  // Constructing it like so instead of concatenating a string for readability and maintainability
  const authUrl = new URL(`https://${oauthConfig.domain}/oauth2/authorize`)
  authUrl.searchParams.append('client_id', config.cognito.APP_CLIENT_ID as string)
  authUrl.searchParams.append('redirect_uri', oauthConfig.redirectSignIn)
  authUrl.searchParams.append('response_type', oauthConfig.responseType)
  authUrl.searchParams.append('scope', oauthConfig.scope.join(' '))
  authUrl.searchParams.append('idp_identifier', idpIdentifier)
  authUrl.searchParams.append('state', btoa(state))

  window.location.href = authUrl.href
}

/**
 * Initiates a logout cycle with Cognito
 */
export const logout = () => {
  const oauthConfig = config.cognito.OAUTH as { [k: string]: string }

  const logoutUrl = new URL(`https://${oauthConfig.domain}/logout`)
  logoutUrl.searchParams.append('client_id', config.cognito.APP_CLIENT_ID as string)
  logoutUrl.searchParams.append('logout_uri', oauthConfig.redirectSignOut)

  window.location.href = logoutUrl.href
}

export const getUserFromStorage = (): UserAttributes | null => {
  const COGNITO_STRING = 'CognitoIdentityServiceProvider'

  const email = retrieveFromStorage<string>(`${COGNITO_STRING}.${config.cognito.APP_CLIENT_ID}.LastAuthUser`)
  const idToken = retrieveFromStorage<string>(`${COGNITO_STRING}.${config.cognito.APP_CLIENT_ID}.${email}.idToken`)

  if (!(email && idToken)) return null

  const authenticatedUser = jwtDecode<UserAttributes>(idToken)

  return authenticatedUser
}
