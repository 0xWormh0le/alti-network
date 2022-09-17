import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardGrid, { DashboardGridProps } from './DashboardGrid'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Dashboard/DashboardGrid',
  component: DashboardGrid
} as Meta

const Template: Story<DashboardGridProps> = (args) => (
  <BrowserRouter>
    <DashboardGrid {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  riskTypes: [
    {
      count: 1,
      riskTypeId: 10,
      severity: 2
    }
  ],
  cards: [
    {
      groupType: 1,
      label: 'Label',
      value: 10
    },
    {
      groupType: 2,
      label: 'Label 2',
      value: 4
    }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true,
  riskTypes: [
    {
      count: 1,
      riskTypeId: 10,
      severity: 2
    }
  ],
  cards: [
    {
      groupType: 1,
      label: 'Label',
      value: 10
    },
    {
      groupType: 2,
      label: 'Label 2',
      value: 4
    }
  ]
}
