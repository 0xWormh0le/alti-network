import Typography from 'components/elements/Typography'
import Spinner from 'components/widgets/Spinner'
import { SetAuthenticatedUser, UserContextConsumer } from 'models/UserContext'
import React, { useEffect } from 'react'
import Auth from '@aws-amplify/auth'
import { useHistory } from 'react-router'
import { routePathNames } from 'util/helpers'
import { clearFromStorage } from 'util/storage'
import './Logout.scss'

const Logout: React.FC<{ userHasAuthenticated: SetAuthenticatedUser }> = ({ userHasAuthenticated }) => {
  const history = useHistory()

  useEffect(() => {
    Auth.signOut({
      global: true
    }).then((_) => {
      clearFromStorage('domains')

      userHasAuthenticated(null)
      history.push(routePathNames.LOGIN)
    })
  }, [userHasAuthenticated, history])

  return (
    <div className='Logout__wrapper'>
      <Typography variant='h1'>
        <Spinner className='Logout__spinner' /> Logging you out...
      </Typography>
    </div>
  )
}

const LogoutWrapper = () => {
  return (
    <UserContextConsumer>
      {({ userHasAuthenticated }) => {
        return <Logout userHasAuthenticated={userHasAuthenticated} />
      }}
    </UserContextConsumer>
  )
}

export default LogoutWrapper
