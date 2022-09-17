import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightAppScopes, { AppSpotlightAppScopesProps } from './AppSpotlightAppScopes'

export default {
  title: 'AppSpotlight/AppSpotlightAppScopes',
  component: AppSpotlightAppScopes
} as Meta

const Template: Story<AppSpotlightAppScopesProps> = (args) => <AppSpotlightAppScopes {...args} />

export const Default = Template.bind({})
Default.args = {
  scopes: ['Scope1', 'Scope2']
}
