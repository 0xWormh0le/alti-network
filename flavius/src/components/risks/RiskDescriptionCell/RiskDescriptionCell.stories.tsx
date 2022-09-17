import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import RiskDescriptionCell, { RiskDescriptionCellProps } from './RiskDescriptionCell'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Risks/RiskDescriptionCell',
  component: RiskDescriptionCell
} as Meta

const Template: Story<RiskDescriptionCellProps> = (args) => (
  <BrowserRouter>
    <RiskDescriptionCell {...args} />
  </BrowserRouter>
)

const displayRiskDescription: DisplayRiskDescription = {
  platformId: 'platformId',
  pluginId: 'pluginId',
  pluginName: 'pluginName',
  riskId: 'riskId',
  riskTypeId: 10,
  text: 'text'
}

export const Default = Template.bind({})
Default.args = {
  displayRiskDescription
}

export const WithRelationRisk = Template.bind({})
WithRelationRisk.args = {
  displayRiskDescription: {
    ...displayRiskDescription,
    riskTypeId: 2010
  }
}

export const Anonymous = Template.bind({})
Anonymous.args = {
  displayRiskDescription: {
    ...displayRiskDescription,
    riskTypeId: 2010,
    personId: 'anonymous'
  }
}
