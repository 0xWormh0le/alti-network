import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import EditFilePermissionHeader, { EditFilePermissionHeaderProps } from './EditFilePermissionHeader'
import { BrowserRouter } from 'react-router-dom'

export default {
  title: 'EditPermission/EditFilePermissionHeader',
  component: EditFilePermissionHeader
} as Meta

const Template: Story<EditFilePermissionHeaderProps> = (args) => (
  <BrowserRouter>
    <EditFilePermissionHeader {...args} />
  </BrowserRouter>
)

export const Default = Template.bind({})
Default.args = {
  file: {
    fileName: 'File',
    createdAt: 123123,
    createdBy: {
      name: {
        givenName: 'Bobbie',
        familyName: '',
        fullName: ''
      }
    },
    lastModified: 456780,
    linkVisibility: 'user'
  } as any
}
