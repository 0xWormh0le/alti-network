import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightAppImage, { AppSpotlightAppImageProps } from './AppSpotlightAppImage'

export default {
  title: 'AppSpotlight/AppSpotlightAppImage',
  component: AppSpotlightAppImage
} as Meta

const Template: Story<AppSpotlightAppImageProps> = (args) => <AppSpotlightAppImage {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}

export const WithTitle = Template.bind({})
WithTitle.args = {
  appTitle: 'A Title'
}

export const WithMarketplaceSource = Template.bind({})
WithMarketplaceSource.args = {
  appTitle: 'A Title',
  appMarketplaceURI: 'https://url.com'
}
