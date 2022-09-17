import React, { lazy, Suspense, useState } from 'react'
import { Route, Redirect, Switch, RouteProps, match, generatePath } from 'react-router-dom'
import { ModalRoute } from 'react-router-modal'
import queryString from 'query-string'
import { UserContextConsumer } from './models/UserContext'
import { LocationHistoryContextConsumer } from './models/LocationHistoryContext'
import { getNavigationItems, getSupportItems } from './models/Visibility'
import { routePathNames, generateRoutePath, getLoginRedirectPath } from './util/helpers'
import Actionbar from 'components/base/Actionbar'
import config from 'config'
import { isEmpty } from 'lodash'

// import GoogleApp from 'pages/GoogleApp'
// import GoogleMarketplaceLogin from 'pages/GoogleMarketplaceLogin/'
// import GoogleAppResults from 'pages/GoogleAppResults/GoogleAppResults'

// import Signup from './pages/Signup'

const AppSpotlight = lazy(() => import('./pages/AppSpotlight'))
const Login = lazy(() => import('./pages/Login'))
const Logout = lazy(() => import('./pages/Logout'))
const Spotlight = lazy(() => import('./pages/Spotlight'))
const SingleFile = lazy(() => import('./pages/SingleFile'))
const FolderInspector = lazy(() => import('./pages/FolderInspector'))
const Files = lazy(() => import('./pages/Files'))
const NotFound = lazy(() => import('./pages/NotFound'))
const EditFilePermission = lazy(() => import('./pages/EditFilePermission'))
const ResolveRisk = lazy(() => import('./pages/ResolveRisk'))

const { navigationItemsNames } = config

interface PrivateRouteProps extends RouteProps {
  component: any
  authenticatedUser?: object
  updateData?: boolean
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, authenticatedUser, location, ...rest }) => {
  const queryParams = location?.search

  // Close the popup window after getting a succesful slack auth response
  if (
    queryParams &&
    (queryParams.indexOf('slack_auth_success=true') > -1 || queryParams.indexOf('slack_auth_success=false') > -1)
  ) {
    window.close()
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        return authenticatedUser ? (
          <Component {...props} {...rest} />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }}
    />
  )
}

const addModalsRoutes = (authenticatedUser: AuthenticatedUser, updateRisk: any) => {
  return (
    authenticatedUser &&
    [...getNavigationItems(authenticatedUser)].map((item) => {
      const routePath = generateRoutePath(item.label, item.params)
      return (
        <LocationHistoryContextConsumer key={item.key}>
          {({ trackedQueryParams }) => {
            // Used to remember where to go back when a modal is closed
            const parentPathQueryString = queryString.stringify(trackedQueryParams)
            const parentPath = (m: match) => {
              // only generate the path with routePath has params
              // e.g. /activity/:platformId/:tabId, we will need to pre fill the params value
              // otherwise when close modal, the parentPath will default to one without params value
              const newRoutePath = isEmpty(m.params) ? routePath : generatePath(routePath, m.params)
              return `${newRoutePath}?${parentPathQueryString}`
            }

            return (
              <Switch>
                <ModalRoute path={`${routePath}/spotlight/:personId`} parentPath={parentPath} component={Spotlight} />
                <ModalRoute path={`${routePath}/file/:fileId`} parentPath={parentPath} component={SingleFile} />
                <ModalRoute path={`${routePath}/folder/:fileId`} parentPath={parentPath} component={FolderInspector} />
                <ModalRoute path={`${routePath}/files/:riskId`} parentPath={parentPath} component={Files} />
                <ModalRoute
                  path={`${routePath}/app-spotlight/:applicationId`}
                  parentPath={parentPath}
                  component={AppSpotlight}
                />
                <ModalRoute
                  path={`${routePath}/:riskId/permissions/file/:fileId`}
                  parentPath={parentPath}
                  component={EditFilePermission}
                />
                {/* deprecated >> */}
                <ModalRoute
                  path={`${routePath}/permissions/file/:fileId`}
                  parentPath={parentPath}
                  component={EditFilePermission}
                />
                <ModalRoute
                  path={`${routePath}/permissions/risk/:riskId`}
                  parentPath={parentPath}
                  component={EditFilePermission}
                />
                {/* << deprecated */}
                <ModalRoute
                  path={`${routePath}/resolve/:riskId`}
                  parentPath={parentPath}
                  component={ResolveRisk}
                  props={{
                    requestRisk: updateRisk
                  }}
                />
              </Switch>
            )
          }}
        </LocationHistoryContextConsumer>
      )
    })
  )
}

const Routes = () => {
  const [updateData, setUpdateData] = useState(false)

  const handleUpdateData = () => {
    setUpdateData(!updateData)
  }

  return (
    <Suspense fallback={<Actionbar titleComponent='' />}>
      <UserContextConsumer>
        {({ authenticatedUser, userHasAuthenticated }) => {
          return (
            <React.Fragment>
              <Switch>
                {/* Disabled until we wan't to allow users to sign themselves up
                <Route
                  path='/signup'
                  render={props => <Signup {...props} userHasAuthenticated={userHasAuthenticated} />}
                  exact={true}
                />
              */}
                {/* <Route
                  exact={true}
                  path={routePathNames.GOOGLE_LOGIN}
                  render={() => (
                    <GoogleMarketplaceLogin
                      authenticatedUser={authenticatedUser}
                      userHasAuthenticated={userHasAuthenticated}
                    />
                  )}
                /> */}
                <Route path={routePathNames.LOGOUT} component={Logout} exact={true} />
                <Route
                  path={routePathNames.LOGIN}
                  render={(props) => (
                    <Login
                      {...props}
                      authenticatedUser={authenticatedUser}
                      userHasAuthenticated={userHasAuthenticated}
                    />
                  )}
                  exact={true}
                />
                {/* <Route
                  exact={true}
                  path={routePathNames.GOOGLE_APP}
                  render={(props) => <GoogleApp {...props} authenticatedUser={authenticatedUser} />}
                />
                <Route
                  exact={true}
                  path={routePathNames.GOOGLE_RESULTS}
                  render={(props) => <GoogleAppResults {...props} authenticatedUser={authenticatedUser} />}
                /> */}
                {!authenticatedUser && (
                  <Route path='*' render={(props) => <Redirect to={getLoginRedirectPath(props.location)} />} />
                )}
                {authenticatedUser && <Redirect exact={true} from='/' to={routePathNames.DASHBOARD} />}
                {/* sidebar navigation items routes */}
                {[...getNavigationItems(authenticatedUser), ...getSupportItems(authenticatedUser)].map((item) => (
                  <PrivateRoute
                    key={item.key}
                    component={item.component}
                    path={generateRoutePath(item.label, item.params)}
                    authenticatedUser={authenticatedUser}
                    updateData={item.label === navigationItemsNames.RISKS ? updateData : undefined}
                  />
                ))}
                {/* Support legacy URL of top-risks */}
                <Route path='/top-risks' render={(props) => <Redirect to={`/risks${props.location.search}`} />} />
                {/* default route when no other route is matched */}
                <PrivateRoute component={NotFound} authenticatedUser={authenticatedUser} />
              </Switch>
              {addModalsRoutes(authenticatedUser, handleUpdateData)}
            </React.Fragment>
          )
        }}
      </UserContextConsumer>
    </Suspense>
  )
}

export default Routes
