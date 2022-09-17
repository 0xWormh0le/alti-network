import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FilesTableContainer, { FilesTableContainerProps } from './FilesTableContainer'

export default {
  title: 'Files/FilesTableContainer',
  component: FilesTableContainer
} as Meta

const Template: Story<FilesTableContainerProps> = (args) => <FilesTableContainer {...args} />

export const Default = Template.bind({})
Default.args = {}
