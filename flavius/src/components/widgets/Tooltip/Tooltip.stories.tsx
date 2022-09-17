import React from 'react'

import { Story, Meta } from '@storybook/react/types-6-0'

import Tooltip, { TooltipProps } from './Tooltip'

export default {
  component: Tooltip,
  title: 'Widgets/Tooltip'
} as Meta

const Template: Story<TooltipProps> = (args) => (
  <Tooltip {...args}>
    <span style={{ display: 'inline-block', margin: '5rem 20rem' }}>Hover for tooltip</span>
  </Tooltip>
)

export const TopPlacement = Template.bind({})
TopPlacement.args = {
  placement: 'top',
  text: 'Tooltip text'
}

export const BottomPlacement = Template.bind({})
BottomPlacement.args = {
  placement: 'bottom',
  text: 'Tooltip text'
}

export const RightPlacement = Template.bind({})
RightPlacement.args = {
  placement: 'right',
  text: 'Tooltip text'
}

export const LeftPlacement = Template.bind({})
LeftPlacement.args = {
  placement: 'left',
  text: 'Tooltip text'
}

export const WithSecondaryText = Template.bind({})
WithSecondaryText.args = {
  placement: 'top',
  text: 'Tooltip text',
  secondaryText: 'Secondary Text'
}
