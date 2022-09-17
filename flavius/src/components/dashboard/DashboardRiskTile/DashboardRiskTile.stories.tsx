import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardRiskTile, { DashboardRiskTileProps } from './DashboardRiskTile'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Dashboard/DashboardRiskTile',
  component: DashboardRiskTile
} as Meta

const Template: Story<DashboardRiskTileProps> = (args) => (
  <BrowserRouter>
    <DashboardRiskTile {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  title: 'Title',
  count: 1,
  label: 'Label'
}
