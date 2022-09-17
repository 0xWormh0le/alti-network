import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileCell, { FileCellProps } from './FileCell'
import { BrowserRouter } from 'react-router-dom'
import { fileMock } from 'test/mocks'

export default {
  title: 'Elements/FileCell',
  component: FileCell
} as Meta

const Template: Story<FileCellProps> = (args) => (
  <BrowserRouter>
    <FileCell {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  fileResponse: fileMock
}

export const WithFileIcon = Template.bind({})
WithFileIcon.args = {
  fileResponse: fileMock
}
