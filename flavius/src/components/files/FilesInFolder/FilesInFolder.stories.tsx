import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FilesInFolder, { FileInFolderProps } from './FilesInFolder'
import { BrowserRouter } from 'react-router-dom'
import StorybookAmplifyContainer from 'components/storybook-widgets/StorybookAmplifyContainer'
import { rest } from 'msw'
import { filesResponse } from 'test/mocks'

export default {
  title: 'Files/FilesInFolder',
  component: FilesInFolder
} as Meta

const Template: Story<FileInFolderProps> = (args) => (
  <BrowserRouter>
    <StorybookAmplifyContainer>
      <FilesInFolder {...args} />
    </StorybookAmplifyContainer>
  </BrowserRouter>
)

export const DisplayIcon = Template.bind({})
DisplayIcon.args = {
  folderId: 'foo',
  fileId: 'bar'
}

DisplayIcon.parameters = {
  msw: [
    rest.get('/api/dev-01/files/parentFolder/bar', (req, res, ctx) => {
      return res(ctx.json(filesResponse))
    })
  ]
}

export const DoNotDisplayIcon = Template.bind({})
DoNotDisplayIcon.args = {
  folderId: 'foo',
  fileId: 'bar'
}

DoNotDisplayIcon.parameters = {
  msw: [
    rest.get('/api/dev-01/files/parentFolder/*', (req, res, ctx) => {
      return res(ctx.json(filesResponse))
    })
  ]
}
