import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FileGridBanner, { FileGridBannerProps } from './FileGridBanner'

export default {
  title: 'Files/FileGridBanner',
  component: FileGridBanner
} as Meta

const Template: Story<FileGridBannerProps> = (args) => <FileGridBanner {...args} />

export const Default = Template.bind({})
Default.args = {
  message: 'Message'
}
