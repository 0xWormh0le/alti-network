import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../Brand'
import LogoutButton from 'components/authentication/LogoutButton'
import Tooltip from 'components/widgets/Tooltip'
import { UserContextConsumer } from 'models/UserContext'
import ModalConfirmationDialog from 'components/widgets/ModalConfirmationDialog'
import Support from 'components/elements/Support'
import WelcomeMessage from 'components/elements/WelcomeMessage'
import { BaseAvatar } from '@altitudenetworks/component-library/'
import Help from 'components/elements/Help'
import noop from 'lodash/noop'
import UI_STRINGS from 'util/ui-strings'
import CONSTANTS from 'util/constants'
import './Headerbar.scss'

const getAuthenticatedUserName = (authenticatedUser: AuthenticatedUser) => {
  return authenticatedUser.attributes ? authenticatedUser.attributes.name : ''
}

const Headerbar: React.FC<{}> = () => {
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false)

  const [showSupportDialog, setShowSupportDialog] = useState(false)

  const [showHelp, setShowHelp] = useState(false)

  return (
    <UserContextConsumer>
      {({ authenticatedUser, isTrial }) => {
        return (
          <header className='Headerbar'>
            <nav className='Headerbar__bar'>
              <span className='Headerbar__bar-brand'>
                <Link to='/'>
                  <Brand />
                </Link>
              </span>
              <div className='Headerbar__nav'>
                {authenticatedUser && !isTrial && (
                  <Fragment>
                    <span className='Headerbar__nav-item'>
                      <span className='Headerbar__flat-button' role='button' onClick={() => setShowHelp(true)}>
                        {UI_STRINGS.HEADER_BAR.HELP}
                      </span>
                    </span>
                    <span className='Headerbar__nav-item'>
                      <span className='Headerbar__flat-button' role='button' onClick={() => setShowSupportDialog(true)}>
                        {UI_STRINGS.HEADER_BAR.SUPPORT}
                      </span>
                    </span>
                    <span className='Headerbar__nav-item'>
                      <span className='Headerbar__flat-button' role='button' onClick={() => setShowWelcomeDialog(true)}>
                        {UI_STRINGS.HEADER_BAR.ABOUT}
                      </span>
                    </span>
                    <span className='Headerbar__separator'>|</span>
                  </Fragment>
                )}
                {!authenticatedUser ? (
                  <Link
                    to={{ pathname: 'https://altitudenetworks.com' }}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='Headerbar__home'>
                    {UI_STRINGS.HEADER_BAR.HOME}
                  </Link>
                ) : (
                  <Fragment>
                    <Tooltip
                      text={UI_STRINGS.HEADER_BAR.LOGGED_IN_AS(getAuthenticatedUserName(authenticatedUser))}
                      secondaryText={authenticatedUser.attributes?.email || ''}
                      id='tooltip-headerbar-avatar-id`'>
                      <span className='Headerbar__nav-item Headerbar__avatar'>
                        <BaseAvatar
                          name={getAuthenticatedUserName(authenticatedUser)}
                          colorList={CONSTANTS.COLOR_LIST}
                        />
                      </span>
                    </Tooltip>
                    <span className='Headerbar__nav-item'>
                      <LogoutButton />
                    </span>
                  </Fragment>
                )}
                {showHelp && (
                  <ModalConfirmationDialog
                    onConfirm={noop}
                    onCancel={() => setShowHelp(false)}
                    dialogTitle={UI_STRINGS.HEADER_BAR.HELP}
                    message={<Help />}
                  />
                )}
                {showSupportDialog && (
                  <ModalConfirmationDialog
                    onConfirm={noop}
                    onCancel={() => setShowSupportDialog(false)}
                    dialogTitle={UI_STRINGS.HEADER_BAR.SUPPORT_DIALOG_TITLE}
                    message={<Support />}
                  />
                )}
                {showWelcomeDialog && (
                  <ModalConfirmationDialog
                    onConfirm={noop}
                    onCancel={() => setShowWelcomeDialog(false)}
                    confirmButtonText={UI_STRINGS.BUTTON_LABELS.OK}
                    confirmButtonActionType='primary'
                    dialogTitle={UI_STRINGS.HEADER_BAR.ABOUT}
                    message={<WelcomeMessage />}
                  />
                )}
              </div>
            </nav>
          </header>
        )
      }}
    </UserContextConsumer>
  )
}

export default Headerbar
