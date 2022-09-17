import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileEvents from './FileEvents'
import StorybookAmplifyContainer from 'components/storybook-widgets/StorybookAmplifyContainer'
import { BrowserRouter } from 'react-router-dom'
import { rest } from 'msw'
import { fileEventsResponse } from 'test/mocks'

export default {
  title: 'Files/FileEvents',
  component: FileEvents
} as Meta

const Template: Story<any> = (args) => (
  <BrowserRouter>
    <StorybookAmplifyContainer>
      <FileEvents {...args} />
    </StorybookAmplifyContainer>
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  fileId: '23123'
}

Default.parameters = {
  msw: [
    rest.get('/api/dev-01/file/23123/events', (req, res, ctx) => {
      return res(ctx.json(fileEventsResponse))
    })
  ]
}
