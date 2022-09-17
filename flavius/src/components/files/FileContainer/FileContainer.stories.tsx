import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileContainer, { FileContainerProps } from './FileContainer'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'Files/FileContainer',
  component: FileContainer
} as Meta

const Template: Story<FileContainerProps> = (args) => (
  <BrowserRouter>
    <FileContainer {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}

export const IsFolder = Template.bind({})
IsFolder.args = {
  isFolder: true
}

export const WithData = Template.bind({})
WithData.args = {}
