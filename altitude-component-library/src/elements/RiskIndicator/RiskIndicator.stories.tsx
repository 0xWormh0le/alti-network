import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import RiskIndicator, { RiskIndicatorProps } from './RiskIndicator'

export default {
  title: 'Elements/RiskIndicator',
  component: RiskIndicator
} as Meta

const Template: Story<RiskIndicatorProps> = (args) => <RiskIndicator {...args} />

export const Default = Template.bind({})
Default.args = {}

export const LowRisk = Template.bind({})
LowRisk.args = {
  value: 1
}

export const HighRisk = Template.bind({})
HighRisk.args = {
  value: 8
}
