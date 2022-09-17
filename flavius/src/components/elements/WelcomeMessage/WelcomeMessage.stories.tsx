import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import WelcomeMessage from './WelcomeMessage'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Elements/WelcomeMessage',
  component: WelcomeMessage
} as Meta

const Template: Story<any> = (args) => (
  <BrowserRouter>
    <WelcomeMessage {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
