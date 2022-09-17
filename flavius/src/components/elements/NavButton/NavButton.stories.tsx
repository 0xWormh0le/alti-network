import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import NavButton, { NavButtonProps } from './NavButton'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Elements/NavButton',
  component: NavButton
} as Meta

const Template: Story<NavButtonProps> = (args) => (
  <BrowserRouter>
    <NavButton {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  text: 'NavButton'
}

export const Loading = Template.bind({})
Loading.args = {
  isLoading: true
}

export const LoadingWithText = Template.bind({})
LoadingWithText.args = {
  isLoading: true,
  loadingText: 'Loading..'
}
