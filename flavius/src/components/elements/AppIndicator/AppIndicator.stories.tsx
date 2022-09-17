import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppIndicator, { AppIndicatorProps } from './AppIndicator'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Elements/AppIndicator',
  component: AppIndicator
} as Meta

const Template: Story<AppIndicatorProps> = (args) => (
  <BrowserRouter>
    <AppIndicator {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  value: 'GDrive',
  webLink: 'https://drive.google.com'
}
