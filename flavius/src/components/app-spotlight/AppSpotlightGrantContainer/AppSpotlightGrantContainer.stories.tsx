import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightGrantContainer, { AppSpotlightGrantContainerProps } from './AppSpotlightGrantContainer'

export default {
  title: 'AppSpotlight/AppSpotlightGrantContainer',
  component: AppSpotlightGrantContainer
} as Meta

const Template: Story<AppSpotlightGrantContainerProps> = (args) => <AppSpotlightGrantContainer {...args} />

export const Default = Template.bind({})
Default.args = {
  app: {
    name: 'Name',
    grants: ['Grant1', 'Grant2'],
    id: 'id',
    imageURI: 'https://url.com',
    appId: '',
    marketplaceURI: 'https://url.com'
  }
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}
