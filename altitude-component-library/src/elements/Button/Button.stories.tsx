import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import Button, { ButtonProps } from './Button'

export default {
  title: 'Elements/Button',
  component: Button,
  argTypes: { onClick: { action: 'clicked' } }
} as Meta

const Template: Story<ButtonProps> = (args) => <Button {...args} />

export const Enabled = Template.bind({})
Enabled.args = {
  disabled: false,
  text: 'Click me'
}

export const Disabled = Template.bind({})
Disabled.args = {
  disabled: true,
  text: 'Click me'
}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true
}

export const LoadingText = Template.bind({})
LoadingText.args = {
  isLoading: true,
  loadingText: 'Loading text...'
}

export const Submit = Template.bind({})
Submit.args = {
  type: 'reset',
  text: 'Click me'
}

export const Primary = Template.bind({})
Primary.args = {
  action: 'primary',
  text: 'Click me'
}

export const Secondary = Template.bind({})
Secondary.args = {
  action: 'secondary',
  text: 'Click me'
}

export const Alert = Template.bind({})
Alert.args = {
  action: 'alert',
  text: 'Click me'
}
