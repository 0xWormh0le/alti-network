import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppFileIndicator, { AppFileIndicatorProps } from './AppFileIndicator'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Elements/AppFileIndicator',
  component: AppFileIndicator
} as Meta

const Template: Story<AppFileIndicatorProps> = (args) => (
  <BrowserRouter>
    <AppFileIndicator {...args} />
  </BrowserRouter>
)

export const GDrive = Template.bind({})
GDrive.args = {
  value: 'GDrive'
}
