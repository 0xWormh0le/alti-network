import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import VisibilityIndicator, { VisibilityIndicatorProps } from './VisibilityIndicator'

export default {
  title: 'Elements/VisibilityIndicator',
  component: VisibilityIndicator
} as Meta

const Template: Story<VisibilityIndicatorProps> = (args) => <VisibilityIndicator {...args} />

export const Default = Template.bind({})
Default.args = {}

export const Internal = Template.bind({})
Internal.args = {
  isInternal: true
}
