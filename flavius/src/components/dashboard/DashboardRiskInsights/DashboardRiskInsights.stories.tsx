import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import DashboardRiskInsights from './DashboardRiskInsights'
import StorybookAmplifyContainer from 'components/storybook-widgets/StorybookAmplifyContainer'
import { BrowserRouter } from 'react-router-dom'
import { rest } from 'msw'
import { tilesData } from 'test/mocks'

export default {
  title: 'Dashboard/DashboardRiskInsights',
  component: DashboardRiskInsights
} as Meta

const Template: Story<any> = (args: any) => {
  return (
    <StorybookAmplifyContainer>
      <BrowserRouter>
        <DashboardRiskInsights {...args} />
      </BrowserRouter>
    </StorybookAmplifyContainer>
  )
}

export const Default = Template.bind({})
Default.args = {}

Default.parameters = {
  msw: [
    rest.get('/api/dev-01/*', (req, res, ctx) => {
      return res(ctx.json(tilesData))
    })
  ]
}
