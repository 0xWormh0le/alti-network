import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardCards, { DashboardCardsProps } from './DashboardCards'

export default {
  title: 'Dashboard/DashboardCards',
  component: DashboardCards
} as Meta

const Template: Story<DashboardCardsProps> = (args) => <DashboardCards {...args} />

export const Default = Template.bind({})
Default.args = {
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
  cards: [
    {
      groupType: 1,
      label: 'Label',
      value: 10
    }
  ],
  loading: true
}
