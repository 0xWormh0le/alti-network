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

export const SafeRiskBar = Template.bind({})
SafeRiskBar.args = {
  value: 1
}

export const LowRiskBar = Template.bind({})
LowRiskBar.args = {
  value: 3
}

export const MediumRiskBar = Template.bind({})
MediumRiskBar.args = {
  value: 6
}

export const HighRiskBar = Template.bind({})
HighRiskBar.args = {
  value: 8
}

export const VeryHighRiskBar = Template.bind({})
VeryHighRiskBar.args = {
  value: 10
}

export const HighRiskCircle = Template.bind({})
HighRiskCircle.args = {
  value: 8,
  type: 'circle'
}
