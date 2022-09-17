import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardRiskTileLoading from './DashboardRiskTileLoading'

export default {
  title: 'Dashboard/DashboardRiskTileLoading',
  component: DashboardRiskTileLoading
} as Meta

const Template: Story<any> = (args) => <DashboardRiskTileLoading {...args} />

export const Default = Template.bind({})
Default.args = {}
