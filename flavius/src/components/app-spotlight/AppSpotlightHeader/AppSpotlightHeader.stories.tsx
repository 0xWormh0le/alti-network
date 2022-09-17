import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightHeader, { AppSpotlightHeaderProps } from './AppSpotlightHeader'

export default {
  title: 'AppSpotlight/AppSpotlightHeader',
  component: AppSpotlightHeader
} as Meta

const Template: Story<AppSpotlightHeaderProps> = (args) => <AppSpotlightHeader {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}
