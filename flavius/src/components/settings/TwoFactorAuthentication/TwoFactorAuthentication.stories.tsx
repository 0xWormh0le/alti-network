import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import TwoFactorAuthentication, { TwoFactorAuthenticationProps } from './TwoFactorAuthentication'

export default {
  title: 'Settings/TwoFactorAuthentication',
  component: TwoFactorAuthentication
} as Meta
const Template: Story<TwoFactorAuthenticationProps> = (args) => <TwoFactorAuthentication {...args} />

export const Default = Template.bind({})
Default.args = {
  user: {
    username: 'bobbie',
    attributes: {
      email: 'email',
      email_verified: true,
      name: 'Bobbie',
      phoneNumber: '4567890',
      phoneNumber_verified: true,
      sub: '213123'
    }
  } as any
}
