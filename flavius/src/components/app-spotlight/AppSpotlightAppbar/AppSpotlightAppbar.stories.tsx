import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightAppbar, { AppbarProps } from './AppSpotlightAppbar'

export default {
  title: 'AppSpotlight/AppSpotlightAppbar',
  component: AppSpotlightAppbar
} as Meta

const Template: Story<AppbarProps> = (args) => <AppSpotlightAppbar {...args} />

export const ThreeServiceItems = Template.bind({})
ThreeServiceItems.args = {
  serviceNames: ['google', 'hangouts', 'meet']
}

export const AllServiceItems = Template.bind({})
AllServiceItems.args = {
  serviceNames: [
    'admin',
    'analytics',
    'apps-script',
    'calendar',
    'classroom',
    'cloud',
    'cloudprint',
    'cloud-sql',
    'docs',
    'drive',
    'firebase',
    'forms',
    'gmail',
    'google',
    'hangouts',
    'meet',
    'other',
    'people',
    'photos',
    'picasa',
    'presentations',
    'sheets',
    'tasks',
    'wallet',
    'webstore',
    'youtube'
  ]
}
