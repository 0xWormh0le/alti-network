import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardRiskSummary from './DashboardRiskSummary'

export default {
  title: 'Dashboard/DashboardRiskSummary',
  component: DashboardRiskSummary
} as Meta

const Template: Story<any> = (args) => <DashboardRiskSummary {...args} />

export const Default = Template.bind({})
Default.args = {}
