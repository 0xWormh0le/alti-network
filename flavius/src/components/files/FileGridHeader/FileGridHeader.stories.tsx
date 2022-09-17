import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileGridHeader, { FileGridHeaderProps } from './FileGridHeader'
import { fileResponse } from 'test/mocks'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Files/FileGridHeader',
  component: FileGridHeader
} as Meta

const Template: Story<FileGridHeaderProps> = (args) => (
  <BrowserRouter>
    <FileGridHeader {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  file: fileResponse,
  loading: false
}

export const Loading = Template.bind({})
Loading.args = {
  file: fileResponse,
  loading: true
}
