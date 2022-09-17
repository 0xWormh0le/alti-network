import React from 'react'

import { renderWithRouter } from 'test/support/helpers'
import { authenticatedUser } from 'test/mocks'
import { UserContextProvider } from 'models/UserContext'
import Headerbar from './Headerbar'

const contextValue = {
  authenticatedUser,
  domains: [],
  userHasAuthenticated: () => true,
  setShowWelcomeDialog: (v: boolean) => v,
  showWelcomeDialog: false,
  isTrial: false
}

describe('Headerbar', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <Headerbar />
      </UserContextProvider>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders tooltip for the avatar of logged-in user', () => {
    const { container } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <Headerbar />
      </UserContextProvider>
    )
    expect(container.querySelector('.Headerbar__avatar')).toHaveClass('trigger')
  })
})
