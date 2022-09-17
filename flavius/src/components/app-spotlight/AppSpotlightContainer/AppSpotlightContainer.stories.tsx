import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import AppSpotlightContainer, { AppSpotlightContainerProps } from './AppSpotlightContainer'

export default {
  title: 'AppSpotlight/AppSpotlightContainer',
  component: AppSpotlightContainer
} as Meta

const Template: Story<AppSpotlightContainerProps> = (args) => <AppSpotlightContainer {...args} />

export const Default = Template.bind({})
Default.args = {}
