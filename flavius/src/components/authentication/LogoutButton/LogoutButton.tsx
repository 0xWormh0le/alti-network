import React from 'react'
import * as Sentry from '@sentry/browser'
import { alertError } from 'util/alert'
import { SetAuthenticatedUser, UserContextConsumer } from 'models/UserContext'
import UI_STRINGS from 'util/ui-strings'
import { logout } from 'util/auth'
import Button from 'components/elements/Button'
import './LogoutButton.scss'

const onButtonClick = async (userHasAuthenticated: SetAuthenticatedUser) => {
  try {
    logout()
  } catch (error) {
    alertError(UI_STRINGS.LOGOUT.LOGOUT_FAIL)
    Sentry.captureException(error)
  }
}

const LogoutButton: React.FC = () => (
  <UserContextConsumer>
    {({ userHasAuthenticated, authenticatedUser }) =>
      authenticatedUser && (
        <Button
          action='secondary'
          text={UI_STRINGS.LOGOUT.LOGOUT}
          className='LogoutButton'
          onClick={() => onButtonClick(userHasAuthenticated)}
        />
      )
    }
  </UserContextConsumer>
)

export default LogoutButton
