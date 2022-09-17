import React from 'react'
import { fireEvent } from '@testing-library/react'
import LogoutButton from './LogoutButton'
import { authenticatedUser } from 'test/mocks'
import { UserContextProvider } from 'models/UserContext'
import { renderWithRouter } from 'test/support/helpers'
import UI_STRINGS from 'util/ui-strings'

const contextValue = {
  authenticatedUser,
  domains: [],
  userHasAuthenticated: () => true,
  setShowWelcomeDialog: (v: boolean) => v,
  showWelcomeDialog: false,
  isTrial: false
}

describe('LogoutButton', () => {
  it('renders correctly', () => {
    const { container, getByText } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <LogoutButton />
      </UserContextProvider>
    )
    expect(container).toMatchSnapshot()

    fireEvent.click(getByText(UI_STRINGS.LOGOUT.LOGOUT))
  })
})
