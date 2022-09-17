import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import EditFilePermissionContainer, { EditFilePermissionContainerProps } from './EditFilePermissionContainer'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'EditPermission/EditFilePermissionContainer',
  component: EditFilePermissionContainer
} as Meta

const Template: Story<EditFilePermissionContainerProps> = (args) => (
  <BrowserRouter>
    <EditFilePermissionContainer {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {}
