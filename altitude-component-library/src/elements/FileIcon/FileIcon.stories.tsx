import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileIcon, { FileIconProps } from './FileIcon'

export default {
  title: 'Elements/FileIcon',
  component: FileIcon
} as Meta

const Template: Story<FileIconProps> = (args) => <FileIcon {...args} />

export const Default = Template.bind({})
Default.args = {
  iconUrl: '/icon-small-audio.png',
  mimeType: 'application/mp3'
}
