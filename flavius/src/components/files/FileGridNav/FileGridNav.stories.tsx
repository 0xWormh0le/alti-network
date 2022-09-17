import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileGridNav, { FileGridNavProps } from './FileGridNav'

export default {
  title: 'Files/FileGridNav',
  component: FileGridNav
} as Meta

const Template: Story<FileGridNavProps> = (args) => <FileGridNav {...args} />

export const Default = Template.bind({})
Default.args = {
  isFolder: false,
  externalCount: 1,
  filesInFolderCount: 1,
  internalCount: 1,
  loading: false
}
