import React from 'react'
import { Redirect } from 'react-router-dom'
import { RouteComponentProps } from 'react-router'
import * as Sentry from '@sentry/browser'
import Auth from '@aws-amplify/auth'
import validate from 'validate.js'
import jwt_decode from 'jwt-decode'
import { alertError } from 'util/alert'
import { configureAmplify } from 'api/apiConfiguration'
import { getEmailDomain, isValidEmail, parseQueryString, routePathNames, getQueryString } from 'util/helpers'
import { SetAuthenticatedUser } from 'models/UserContext'
import Analytics from 'util/analytics'
import BasePage from '../BasePage'
import Button from 'components/elements/Button'
import config from 'config'
import FormControl, { FormControlProps } from 'components/elements/FormControl'
import FormGroup from 'components/elements/FormGroup'
import FormLabel from 'components/elements/FormLabel'
import GoogleLogin from 'components/authentication/GoogleLogin'
import UI_STRINGS from 'util/ui-strings'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { federatedLoginUsingIdpIdentifier } from 'util/auth'
import { renderAttributeIfDev } from 'util/helpers'
import { clearFromStorage, retrieveFromStorage, storeInStorage } from 'util/storage'
import './Login.scss'

export const TOTP_MFA_TYPE = 'SOFTWARE_TOKEN_MFA'

interface GoogleAuthResponse {
  tokenObj: {
    id_token: string
    expires_at: number
  }
  profileObj: {
    email: string
    name: string
  }
}

interface LoginProps extends RouteComponentProps {
  userHasAuthenticated: SetAuthenticatedUser
  authenticatedUser: AuthenticatedUser
}

interface LoginState {
  redirectToReferrer: boolean
  email: string
  password: string
  isLoading: boolean
  isLoadingGoogle: boolean
  isLoadingOkta: boolean
  isLoadingMicrosoft: boolean
  user?: { username: string; challengeName: string }
  showConfirmation: boolean // for 2FA
  challengeAnswer: string // for 2FA
  idpToken?: string
  idpTokenExpiresIn?: number
  showExternalLoginField?: boolean
  externalLoginDomain: string | null
  externalLoginProvider: string | null
  externalLoginNextPath: string | null
  chosenProvider: string | null
  alreadyAuthenticated: boolean
  googleAuthCode?: string
}

const captureErrorIfSystemFailure = (error: any) => {
  if (error.code !== 'NotAuthorizedException') Sentry.captureException(error)
}

class Login extends BasePage<LoginProps, LoginState> {
  protected pageName = config.navigationItemsNames.LOGIN
  private externalLoginStorageKey = 'altNet_LoginDomain'

  constructor(props: LoginProps) {
    super(props)
    this.launchExternalLogin = this.launchExternalLogin.bind(this)
    this.clearExternalProviderStorage = this.clearExternalProviderStorage.bind(this)
    this.clearCompanyInfoCache = this.clearCompanyInfoCache.bind(this)
    const idpResponseParameters = this.parseIdpResponse(props.location.hash)

    this.state = {
      redirectToReferrer: false,
      chosenProvider: null,
      email: '',
      password: '',
      isLoading: false,
      isLoadingGoogle: false,
      isLoadingOkta: false,
      isLoadingMicrosoft: false,
      user: undefined,
      showConfirmation: false,
      alreadyAuthenticated: !!this.props.authenticatedUser,
      challengeAnswer: '',
      idpToken: idpResponseParameters.idpToken,
      idpTokenExpiresIn: parseInt('' + idpResponseParameters.idpTokenExpiresIn, 10),
      externalLoginDomain: retrieveFromStorage<string>(this.externalLoginStorageKey),
      externalLoginProvider: idpResponseParameters.provider,
      externalLoginNextPath: idpResponseParameters.nextPath,
      googleAuthCode: ''
    }
  }

  public async componentDidMount() {
    super.componentDidMount()
    this.clearCompanyInfoCache()
    const code = new URLSearchParams(this.props.location.search).get('code')
    if (code) {
      this.setState({ googleAuthCode: code })
    } else if (this.props.location.hash?.length > 0) {
      this.handleSubmitIdpCredentials()
    } else {
      await Auth.currentUserInfo()
    }
  }

  /**
   *
   * @param idpCredentials the concatenated token string with the all tokens returned by the identity provider
   * @returns An object containing information about the provider and the actual tokens provided by them
   */
  private parseIdpResponse = (idpCredentials = '') => {
    const tokenParts = idpCredentials.split('&')
    const idpTokenRaw = tokenParts.find((part) => part.indexOf('id_token') > -1)
    const idpTokenExpiresInRaw = tokenParts.find((part) => part.indexOf('expires_in') > -1)

    // Decoded URI as external provider may encode certain characters
    const encodedState = decodeURIComponent(tokenParts.find((part) => part.indexOf('state') > -1) || '')

    const decodedState = JSON.parse((encodedState && atob(encodedState.split('=')[1])) || '{}')

    if (
      idpTokenRaw &&
      idpTokenRaw?.indexOf('=') > -1 &&
      idpTokenExpiresInRaw &&
      idpTokenExpiresInRaw?.indexOf('=') > -1
    ) {
      return {
        idpToken: idpTokenRaw?.split('=')[1],
        idpTokenExpiresIn: idpTokenExpiresInRaw?.split('=')[1],
        provider: decodedState.provider,
        nextPath: decodedState.nextPath
      }
    } else {
      return {
        idpToken: '',
        idpTokenExpiresIn: '',
        provider: '',
        nextPath: ''
      }
    }
  }

  private handleChange = (event: React.FormEvent<FormControlProps>) => {
    switch (event.currentTarget.id) {
      case 'externalEmail':
        const loginEmail = '' + event.currentTarget.value
        const externalLoginDomain = loginEmail.toLowerCase()
        this.setState({ externalLoginDomain })
        break
      case 'email':
        this.setState({
          email: event.currentTarget.value as string
        })
        break
      case 'password':
        this.setState({
          password: event.currentTarget.value as string
        })
        break
      case 'challengeAnswer':
        this.setState({
          challengeAnswer: event.currentTarget.value as string
        })
        break
      default:
        throw new Error('Login error: tried to assign a value to an unkown input field')
    }
  }

  private finalizeUserLogin = async () => {
    const user = await Auth.currentUserInfo()
    this.props.userHasAuthenticated(user)
    this.setState({ redirectToReferrer: true })
  }

  private handleSubmitCredentials = async (event: React.FormEvent) => {
    event.preventDefault()

    this.setState({ isLoading: true })
    const { email, password } = this.state
    const { location } = this.props

    try {
      configureAmplify(false)
      const user = await Auth.signIn(email, password)
      if (user.challengeName === TOTP_MFA_TYPE) {
        // the user has 2FA enabled via TOTP, show next screen to ask for the code
        this.setState({ isLoading: false, showConfirmation: true, user })
      } else {
        const queryParams = parseQueryString(location.search)
        // the user directly logs in, 2FA is disabled for this user
        if (queryParams.uuid) {
          Analytics.alias(email, queryParams.uuid)
        }
        Analytics.identify(email)
        Analytics.track('login')

        this.finalizeUserLogin()
      }
    } catch (error) {
      alertError(UI_STRINGS.LOGIN.INVALID_EMAIL_PW, UI_STRINGS.LOGIN.TRY_AGAIN)
      captureErrorIfSystemFailure(error)
      this.setState({ isLoading: false })
    }
  }

  /**
   * Processes tokens that come back from a successful login at the external provider
   * And exchanges them for a token from Cognito
   */
  private handleSubmitIdpCredentials = async () => {
    const { idpToken, idpTokenExpiresIn, externalLoginProvider } = this.state
    if (!idpToken) return

    switch (externalLoginProvider) {
      case 'Okta':
        this.setState({ isLoadingOkta: true })
        break
      case 'Microsoft':
        this.setState({ isLoadingMicrosoft: true })
        break
    }

    configureAmplify(false)

    try {
      const jwtInfo: { email: string } = jwt_decode(idpToken)

      const { email } = jwtInfo
      const signInOpts = {
        username: email,
        password: '',
        validationData: {
          app: externalLoginProvider,
          token: idpToken,
          expires_at: idpTokenExpiresIn,
          email,
          username: email
        }
      }
      const user = await Auth.signIn(email)
      await Auth.sendCustomChallengeAnswer(user, JSON.stringify(signInOpts))
      Analytics.identify(email)

      const queryParams = parseQueryString(this.props.location.search)
      if (queryParams.uuid) {
        Analytics.alias(queryParams.uuid, email)
      }

      Analytics.track('login', { email })

      this.finalizeUserLogin()
    } catch (error) {
      alertError(UI_STRINGS.LOGIN.INVALID_EMAIL_PW, UI_STRINGS.LOGIN.TRY_AGAIN)
      captureErrorIfSystemFailure(error)
      this.setState({ isLoading: false })
    }
  }

  private handleSubmitGoogleCredentials = async (googleAuthSuccessResponse: GoogleAuthResponse) => {
    const { location } = this.props
    this.setState({ isLoadingGoogle: true })

    const { id_token, expires_at } = googleAuthSuccessResponse.tokenObj
    const { email, name } = googleAuthSuccessResponse.profileObj

    configureAmplify(true)

    try {
      const signInOpts = {
        username: email,
        password: '',
        validationData: {
          app: 'google',
          token: id_token,
          expires_at: '' + expires_at,
          email,
          name
        }
      }

      const user = await Auth.signIn(email)
      await Auth.sendCustomChallengeAnswer(user, JSON.stringify(signInOpts))
      Analytics.identify(email)

      const queryParams = parseQueryString(location.search)
      if (queryParams.uuid) {
        Analytics.alias(queryParams.uuid, email)
      }

      Analytics.track('login', { email })

      this.finalizeUserLogin()
    } catch (error) {
      alertError(UI_STRINGS.LOGIN.INVALID_EMAIL_PW, UI_STRINGS.LOGIN.TRY_AGAIN)
      captureErrorIfSystemFailure(error)
      this.setState({ isLoading: false })
    }
  }

  private handleSubmitConfirmationCode = async (event: React.FormEvent) => {
    event.preventDefault()

    this.setState({ isLoading: true })
    const { user, challengeAnswer } = this.state

    try {
      await Auth.confirmSignIn(user, challengeAnswer, TOTP_MFA_TYPE)
      await this.finalizeUserLogin()
    } catch (error) {
      alertError('Your code is invalid, please try again')
      captureErrorIfSystemFailure(error)
      this.setState({ isLoading: false })
    }
  }

  /**
   * Initiates the login cycle by calling Cognito if the external login domain is valid
   * @param providerName Name of the provider
   * @param setLoading The function used to mark this provider as loading for cosmetic purposes
   */
  private launchExternalLogin(providerName: string, setLoading: () => void) {
    if (
      this.state.externalLoginDomain &&
      this.state.externalLoginDomain.length > 0 &&
      isValidEmail(this.state.externalLoginDomain)
    ) {
      setLoading()

      // The email domain is stored in local storage so it can be pre-filled on the next login cycle.
      storeInStorage(this.externalLoginStorageKey, this.state.externalLoginDomain)

      // Not using Auth library federatedSignIn since it does not provide access to the idpIdentifier query param.
      const providerIdentifier = getEmailDomain(this.state.externalLoginDomain).replaceAll('.', '-')
      federatedLoginUsingIdpIdentifier(
        `${providerName}-${providerIdentifier}`.toLowerCase(),
        providerName,
        getQueryString('nextPath') || '/dashboard'
      )
    }
  }

  private focusOnProvider(providerName: string) {
    this.setState({ showExternalLoginField: true, chosenProvider: providerName })
  }

  private clearExternalProviderStorage(key: string) {
    clearFromStorage(key)
    this.setState({ showExternalLoginField: true })
  }

  private clearCompanyInfoCache() {
    clearFromStorage('domains')
  }

  private clearExternalProviderPreference() {
    this.setState({ showExternalLoginField: false, chosenProvider: null })
  }

  private validateCredentialsForm() {
    const { email, password } = this.state

    return !validate.single(email, { presence: true, email: true }) && password.length > 0
  }

  /**
   * Used to determine if the button should initiate a cycle or ask for the login domain
   * @param providerName Name of the provider to initiate the cycle for
   * @param setLoading The function used to mark this provider as loading for cosmetic purposes
   */
  private handleExternalLogin = (providerName: string, setLoading: () => void) => {
    if (this.state.showExternalLoginField) this.launchExternalLogin(providerName, setLoading)
    else this.focusOnProvider(providerName)
  }

  private renderLoginForm() {
    const {
      email,
      password,
      isLoading,
      isLoadingGoogle,
      isLoadingOkta,
      isLoadingMicrosoft,
      showExternalLoginField,
      chosenProvider,
      externalLoginDomain
    } = this.state

    return (
      <React.Fragment>
        {!showExternalLoginField && (
          <GoogleLogin handleSuccessResponse={this.handleSubmitGoogleCredentials} isLoading={isLoadingGoogle} />
        )}
        <div className='Login__external-login-wrapper'>
          {showExternalLoginField && (
            <FormGroup controlId='externalEmail' className='Login__okta-input'>
              <FormLabel>{UI_STRINGS.EXTERNAL_LOGIN_SHARED.ENTER_EMAIL(chosenProvider)}</FormLabel>
              <FormControl value={externalLoginDomain ?? ''} autoFocus={true} onChange={this.handleChange} />
            </FormGroup>
          )}
          {(chosenProvider === null || chosenProvider === 'Okta') && (
            <Button
              className='Login__okta-button'
              action='primary'
              text={UI_STRINGS.OKTA_LOGIN.CONTINUE_WITH_OKTA}
              isLoading={isLoadingOkta}
              onClick={() => this.handleExternalLogin('Okta', () => this.setState({ isLoadingOkta: true }))}
              loadingText={UI_STRINGS.OKTA_LOGIN.LOGGING_IN}
            />
          )}
          {(chosenProvider === null || chosenProvider === 'Microsoft') && (
            <Button
              className='Login__microsoft-button'
              text={UI_STRINGS.MICROSOFT_LOGIN.CONTINUE_WITH_MICROSOFT}
              action='primary'
              onClick={() => this.handleExternalLogin('Microsoft', () => this.setState({ isLoadingMicrosoft: true }))}
              isLoading={isLoadingMicrosoft}
              loadingText={UI_STRINGS.MICROSOFT_LOGIN.LOGGING_IN}
            />
          )}
          {showExternalLoginField && (
            <Button
              className='Login__cancel-provider-button'
              onClick={() => this.clearExternalProviderPreference()}
              action='secondary'
              text={UI_STRINGS.EXTERNAL_LOGIN_SHARED.GO_BACK}
            />
          )}
        </div>
        {!showExternalLoginField && (
          <form
            onSubmit={this.handleSubmitCredentials}
            {...renderAttributeIfDev({ 'data-testid': 'login-credentials-form' })}>
            <div className='Login__or-separator'>
              <span className='Login__or-separator__line' />
              <Typography
                variant={TypographyVariant.BODY}
                component='span'
                uppercase={true}
                className='Login__or-separator__text'>
                or
              </Typography>
              <span className='Login__or-separator__line' />
            </div>
            <FormGroup controlId='email'>
              <FormLabel>{UI_STRINGS.LOGIN.EMAIL}</FormLabel>
              <FormControl autoFocus={true} value={email} onChange={this.handleChange} />
            </FormGroup>
            <FormGroup controlId='password'>
              <FormLabel>{UI_STRINGS.LOGIN.PASSWORD}</FormLabel>
              <FormControl type='password' value={password} onChange={this.handleChange} />
            </FormGroup>
            <Button
              className='Login__button'
              action='primary'
              disabled={!this.validateCredentialsForm()}
              type='submit'
              isLoading={isLoading}
              text={UI_STRINGS.LOGIN.LOGIN}
              loadingText={UI_STRINGS.LOGIN.LOGGING_IN}
            />
          </form>
        )}
      </React.Fragment>
    )
  }

  private renderChallengeConfirmationForm() {
    const { challengeAnswer, isLoading } = this.state

    return (
      <form
        onSubmit={this.handleSubmitConfirmationCode}
        {...renderAttributeIfDev({ 'data-testid': 'login-confirmation-form' })}>
        <FormGroup controlId='challengeAnswer'>
          <FormLabel>{UI_STRINGS.LOGIN.CONFIRMATION_CODE}</FormLabel>
          <FormControl autoFocus={true} value={challengeAnswer} onChange={this.handleChange} />
          <div className='Login__message'>{UI_STRINGS.LOGIN.USE_GENERATOR_AND_ENTER}</div>
        </FormGroup>
        <Button
          className='Login__button'
          action='primary'
          disabled={challengeAnswer === ''}
          type='submit'
          isLoading={isLoading}
          text={UI_STRINGS.LOGIN.CONFIRM_LOGIN}
          loadingText={UI_STRINGS.LOGIN.CONFIRMING}
        />
      </form>
    )
  }

  public renderPageContent() {
    const { redirectToReferrer, showConfirmation, googleAuthCode, alreadyAuthenticated } = this.state
    const redirectPath = getQueryString('nextPath') || this.state.externalLoginNextPath || '/dashboard'

    const search = new URLSearchParams(this.props.location.search)
    search.delete('nextPath')

    if (alreadyAuthenticated) {
      return <Redirect to={routePathNames.DASHBOARD} />
    }

    if (this.state.googleAuthCode) {
      return <Redirect to={`${routePathNames.GOOGLE_APP}?code=${googleAuthCode}`} />
    }

    if (redirectToReferrer && redirectPath.indexOf('login') === -1) {
      const next = { pathname: redirectPath, search: search.toString() }

      return <Redirect to={next} />
    }
    return (
      <div className='Login'>{showConfirmation ? this.renderChallengeConfirmationForm() : this.renderLoginForm()}</div>
    )
  }
}

export default Login
