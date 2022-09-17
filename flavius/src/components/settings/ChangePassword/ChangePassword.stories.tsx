import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ChangePassword, { ChangePasswordProps } from './ChangePassword'

export default {
  title: 'Settings/ChangePassword',
  component: ChangePassword
} as Meta

const Template: Story<ChangePasswordProps> = (args) => <ChangePassword {...args} />

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
