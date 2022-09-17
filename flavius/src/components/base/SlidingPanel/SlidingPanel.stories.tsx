import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SlidingPanel, { SlidingPanelProps } from './SlidingPanel'

export default {
  title: 'Base/SlidingPanel',
  component: SlidingPanel
} as Meta

const Template: Story<SlidingPanelProps> = (args) => <SlidingPanel {...args} />

export const NotVisible = Template.bind({})
NotVisible.args = {
  visible: false,
  title: 'Title'
}

export const Visible = Template.bind({})
Visible.args = {
  visible: true,
  title: 'Title'
}
