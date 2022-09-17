import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import LogoutButton from './LogoutButton'
import { BrowserRouter } from 'react-router-dom'
import { UserContext } from 'models/UserContext'

export default {
  title: 'Authentication/LogoutButton',
  component: LogoutButton
} as Meta

const Template: Story<any> = (args) => (
  <BrowserRouter>
    <UserContext.Provider
      value={{
        domains: [],
        userHasAuthenticated: (user) => null,
        setShowWelcomeDialog: (set) => null,
        showWelcomeDialog: true,
        isTrial: false,
        authenticatedUser: {
          username: 'Bobbie',
          id: '111',
          attributes: {
            email: 'bobbie@thoughtlabs.io',
            email_verified: true,
            name: 'Bobbie Hawaii',
            phoneNumber: '4567890',
            phoneNumber_verified: true,
            sub: 'Sub'
          }
        }
      }}>
      <LogoutButton {...args} />
    </UserContext.Provider>
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
