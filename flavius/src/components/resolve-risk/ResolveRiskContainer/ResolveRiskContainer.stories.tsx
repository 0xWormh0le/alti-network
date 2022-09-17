import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import ResolveRiskContainer, { ResolveRiskContainerProps } from './ResolveRiskContainer'
import { BrowserRouter } from 'react-router-dom'
import StorybookAmplifyContainer from 'components/storybook-widgets/StorybookAmplifyContainer'
import { rest } from 'msw'

export default {
  title: 'ResolveRisk/ResolveRiskContainer',
  component: ResolveRiskContainer
} as Meta

const filesResponse = {
  files: [
    { fileId: '14JCrTBhf4GRN1ArUwDOF9CXfv2mQbZyW', fileName: 'foofile' },
    { fileId: '14JCrTBhf4GIASAUSIDHASIDUHASUIDHS', fileName: 'foofile1' },
    { fileId: '89O231O234GRN1ArUwDOF9CXfv2mQbZyW', fileName: 'foofile3' },
    { fileId: '14JCrTBh21283no123j2A9CXfv2mQbZyW', fileName: 'foofile2' }
  ]
}

const Template: Story<ResolveRiskContainerProps> = (args) => (
  <StorybookAmplifyContainer>
    <BrowserRouter>
      <ResolveRiskContainer {...args} />
    </BrowserRouter>
  </StorybookAmplifyContainer>
)

export const Default = Template.bind({})
Default.args = {
  riskId: '19',
  appName: 'App name',
  email: 'some@email.com',
  requestRisk: () => null,
  appId: '10',
  fileCount: 10,
  riskTypeId: '10'
}

Default.parameters = {
  msw: [
    rest.get('/api/dev-01/files', (req, res, ctx) => {
      return res(ctx.json(filesResponse))
    }),
    rest.get('/api/dev-01/permissions/status', (req, res, ctx) => {
      return res(
        ctx.json({
          active: 0,
          completed: 0,
          failed: 0,
          pending: 4,
          totalCount: 4
        })
      )
    })
  ]
}
