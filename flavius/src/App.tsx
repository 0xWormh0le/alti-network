import React, { Component, ErrorInfo } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import Alert from 'react-s-alert'
import API from '@aws-amplify/api/lib'
import Auth from '@aws-amplify/auth'
import queryString from 'query-string'

import { LocationHistoryContext } from 'models/LocationHistoryContext'
import { UserContextProvider, IUserContext } from 'models/UserContext'
import AlertContentTemplate from 'components/elements/AlertContentTemplate'
import Sidebar from 'components/base/Sidebar'
import ModalConfirmationDialog, { ModalConfirmationDialogProps } from 'components/widgets/ModalConfirmationDialog'
import Headerbar from 'components/base/Headerbar'
import ModalWrapper from 'components/widgets/ModalWrapper'
import Routes from './Routes'
import { locationIsAModalRoute } from 'util/helpers'
import Analytics from 'util/analytics'
import { ModalContext } from 'util/hooks/useConfirmModal'
import { clearFromStorage, retrieveFromStorage, storeInStorage } from 'util/storage'
import { GENERAL_URLS } from 'api/endpoints'
import MetadataStore from 'util/metadataStore'
import CONSTANTS from 'util/constants'
import './App.scss'
interface AppState {
  error: Error | null
  isAuthenticating: boolean
  authenticatedUser?: AuthenticatedUser
  showWelcomeDialog: boolean
  domains: string[]
  platforms: Dictionary<PlatformStatusInfo>
  modalConfirmationConfig: Maybe<ModalConfirmationDialogProps>
}

class App extends Component<RouteComponentProps, AppState> {
  constructor(props: RouteComponentProps) {
    super(props)

    this.state = {
      isAuthenticating: true,
      error: null,
      showWelcomeDialog: false,
      domains: [],
      platforms: {},
      modalConfirmationConfig: null
    }

    setTimeout(() => {
      window.location.reload()
    }, CONSTANTS.RELOAD_TIME)
  }

  private onClick = (event: any) => {
    const element = document.elementFromPoint(event.clientX, event.clientY)
    const possibleConfirmationModal = element?.closest('.ModalConfirmationDialog')
    let view = ''
    if (possibleConfirmationModal) {
      const titlebar = document.querySelector('.ModalConfirmationDialog > .Actionbar > .Actionbar__title-wrapper')
      view = titlebar ? titlebar.innerHTML : ''
    }
    const possibleModal = document.querySelector('.ModalPage')
    if (possibleModal) {
      const modalDiv = document.querySelector('.ModalPage > div')
      if (view === '') {
        view = modalDiv ? modalDiv.className : ''
      } else {
        view = (modalDiv ? modalDiv.className : '') + ' > ' + view
      }
    }
    const possiblePage = document.querySelector('.App__main > .Page > div')
    if (possiblePage) {
      if (view === '') {
        view = possiblePage.className
      } else {
        view = possiblePage.className + ' > ' + view
      }
    }
    Analytics.track('click', {
      class: element?.className ? element.className : 'Unknown Class',
      view
    })
  }

  public render() {
    const { authenticatedUser, domains, isAuthenticating, showWelcomeDialog } = this.state

    const isTrial = authenticatedUser && authenticatedUser.attributes['custom:is_trial']

    const { modalConfirmationConfig } = this.state

    return (
      !isAuthenticating && (
        <UserContextProvider
          value={
            {
              userHasAuthenticated: this.userHasAuthenticated,
              authenticatedUser,
              domains,
              setShowWelcomeDialog: this.setShowWelcomeDialog,
              showWelcomeDialog,
              isTrial
            } as IUserContext
          }>
          <MetadataStore>
            <div className='App' onClick={this.onClick}>
              <Headerbar />
              <div className='App__wrapper'>
                {authenticatedUser && !isTrial && <Sidebar />}
                <main className={`App__main ${authenticatedUser && !isTrial ? 'App__main--authenticated' : ''}`}>
                  <ModalContext.Provider
                    value={{
                      show: (data) => this.setState((state) => ({ ...state, modalConfirmationConfig: data })),
                      hide: () => this.setState((state) => ({ ...state, modalConfirmationConfig: null }))
                    }}>
                    <Routes />
                  </ModalContext.Provider>
                </main>
              </div>
            </div>
          </MetadataStore>
          <ModalWrapper />
          {modalConfirmationConfig && <ModalConfirmationDialog {...modalConfirmationConfig} />}
          <Alert stack={{ limit: 3 }} contentTemplate={AlertContentTemplate} />
        </UserContextProvider>
      )
    )
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { history } = this.props
    Sentry.withScope((scope) => {
      Object.keys(errorInfo).forEach((key) => {
        scope.setExtra(key, errorInfo[key])
      })
      Sentry.captureException(error)
      history.push('/404')
    })
  }

  public async componentDidMount() {
    try {
      const session = await Auth.currentSession()
      if (session) {
        //  If it is a lambda-validated session, not a temporary OpenIdConnect session
        if (session.getIdToken().payload.email_verified) {
          const user = await Auth.currentUserInfo()
          this.userHasAuthenticated(user)
        }
      } else {
        throw new Error('No current user')
      }
    } catch (error) {
      // Clearing domains if for any reason the auth session expired.
      // Not keeping the local storage object in class to avoid unnecessary data,
      // since it caches the data it retrieves.
      // Future implementations of this should maybe be functional?
      clearFromStorage('domains')

      try {
        const googleUser: GoogleAuthenticatedUser = await Auth.currentAuthenticatedUser()
        if (googleUser) {
          this.userHasAuthenticated(googleUser)
        }
      } catch (_error) {
        Sentry.captureException(_error)
      }
    } finally {
      this.setState({ isAuthenticating: false })
    }
  }

  public componentDidUpdate(prevProps: RouteComponentProps<any>, _prevState: AppState) {
    const { onLocationVisited, onQueryParamsChanged } = this.context
    const { location } = this.props

    if (location.pathname !== prevProps.location.pathname) {
      onLocationVisited(location.pathname)

      if (locationIsAModalRoute(location.pathname)) {
        // save query parameters so we can reconstruct the state when closing a modal, e.g.: current page
        const previousQueryParams = queryString.parse(prevProps.location.search)
        onQueryParamsChanged(previousQueryParams)
      }
    }

    return null
  }

  private userHasAuthenticated = (authenticatedUser?: AuthenticatedUser | GoogleAuthenticatedUser) => {
    if (!authenticatedUser || authenticatedUser.id === undefined) {
      this.setState({ authenticatedUser: undefined, showWelcomeDialog: true })
      return
    }
    const isCognitoUser = authenticatedUser.hasOwnProperty('attributes')
    const nextUser: AuthenticatedUser = isCognitoUser
      ? (authenticatedUser as AuthenticatedUser)
      : ({
          attributes: {
            email: (authenticatedUser as GoogleAuthenticatedUser).email,
            email_verified: false,
            name: (authenticatedUser as GoogleAuthenticatedUser).name,
            phoneNumber: '',
            phoneNumber_verified: false,
            sub: ''
          } as UserAttributes,
          username: (authenticatedUser as GoogleAuthenticatedUser).name,
          id: authenticatedUser.id || (authenticatedUser as GoogleAuthenticatedUser).email
        } as AuthenticatedUser)

    this.setState({ authenticatedUser: nextUser, showWelcomeDialog: true }, () => {
      if (nextUser?.attributes) {
        const { attributes } = nextUser

        // capture the user in Sentry
        Sentry.configureScope((scope) => {
          scope.setUser({
            id: nextUser.id,
            username: nextUser.username,
            email: attributes.email
          })
        })

        if (window.hasOwnProperty('Intercom')) {
          const intercomedWindow: any = window
          intercomedWindow.intercomSettings = {
            app_id: 'ec9jort1',
            name: nextUser.username,
            email: attributes.email
          }
        }
      }
    })
    this.getDomains()
  }

  private setShowWelcomeDialog = (showWelcomeDialog: boolean) => {
    this.setState({ showWelcomeDialog })
  }

  private async getDomains() {
    try {
      const storedDomains = retrieveFromStorage<string[]>('domains')

      if (storedDomains) {
        this.setState({ domains: storedDomains })
        return
      }

      const domains = await API.get('company_info', `${GENERAL_URLS.COMPANY_INFO}/domains`, {})
      storeInStorage('domains', domains)
      this.setState({ domains })
    } catch (error) {
      Sentry.captureException(error)
    }
  }
}

export default withRouter(App)

// This allows us to use the LocationHistoryContext from the lifecycle methods in the App, such
// as componentDidUpdate()
App.contextType = LocationHistoryContext
