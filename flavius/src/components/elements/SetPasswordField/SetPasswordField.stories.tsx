import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SetPasswordField, { SetPasswordFieldProps } from './SetPasswordField'

export default {
  title: 'Elements/SetPasswordField',
  component: SetPasswordField
} as Meta

const Template: Story<SetPasswordFieldProps> = (args) => <SetPasswordField {...args} />

export const Default = Template.bind({})
Default.args = {}
