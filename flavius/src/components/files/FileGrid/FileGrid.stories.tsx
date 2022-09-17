import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileGrid, { FileGridProps } from './FileGrid'
import { fileResponse } from 'test/mocks'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Files/FileGrid',
  component: FileGrid
} as Meta

const Template: Story<FileGridProps> = (args) => (
  <BrowserRouter>
    <FileGrid {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  file: fileResponse,
  isFolder: false,
  loading: false,
  owner: 'Bobbie'
}

export const IsFolder = Template.bind({})
IsFolder.args = {
  file: fileResponse,
  isFolder: true,
  loading: false,
  owner: 'Bobbie'
}

export const Loading = Template.bind({})
Loading.args = {
  file: fileResponse,
  isFolder: true,
  loading: true,
  owner: 'Bobbie'
}
