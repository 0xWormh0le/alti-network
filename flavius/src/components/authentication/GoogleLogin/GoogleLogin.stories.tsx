import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import GoogleLogin, { GoogleLoginProps } from './GoogleLogin'

export default {
  title: 'Authentication/GoogleLogin',
  component: GoogleLogin
} as Meta

const Template: Story<GoogleLoginProps> = (args) => <GoogleLogin {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true
}
