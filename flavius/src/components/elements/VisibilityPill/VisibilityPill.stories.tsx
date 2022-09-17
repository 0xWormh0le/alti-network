import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import VisibilityPill, { VisibilityPillProps } from './VisibilityPill'

export default {
  title: 'Elements/VisibilityPill',
  component: VisibilityPill
} as Meta

const Template: Story<VisibilityPillProps> = (args) => <VisibilityPill {...args} />

export const External = Template.bind({})
External.args = {
  visibility: 'external'
}

export const Internal = Template.bind({})
Internal.args = {
  visibility: 'internal'
}

export const Sensitive = Template.bind({})
Sensitive.args = {
  visibility: 'sensitive'
}
