import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import RiskTypesList, { RiskTypesListProps } from './RiskTypesList'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Dashboard/RiskTypesList',
  component: RiskTypesList
} as Meta

const Template: Story<RiskTypesListProps> = (args) => (
  <BrowserRouter>
    <RiskTypesList {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  riskTypes: [
    {
      count: 1,
      severity: 1,
      riskTypeId: 10
    }
  ],
  categoryLabel: 'CategoryLabel'
}
