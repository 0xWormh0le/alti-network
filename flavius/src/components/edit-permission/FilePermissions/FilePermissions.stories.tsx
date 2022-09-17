import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import FilePermissions, { FilePermissionsProps } from './FilePermissions'
import { PermissionType, PermissionShared, PermissionRole, PermissionItemStatus } from 'types/common'

export default {
  title: 'EditPermission/FilePermissions',
  component: FilePermissions
} as Meta

const Template: Story<FilePermissionsProps> = (args) => <FilePermissions {...args} />

export const Default = Template.bind({})
Default.args = {
  permissions: []
}

export const WithPermissions = Template.bind({})
WithPermissions.args = {
  getPermissions: () => null,
  fileName: 'FileName',
  fileId: 'FileId',
  entityCount: 1,
  ownerEmail: 'bobbie@thoughtlabs.io',
  riskId: '1',
  pageSize: 1,
  pageCount: 1,
  permissions: [
    {
      discoverable: false,
      permissionEmailAddress: 'test@email.xyz',
      permissionId: '14078799046229454690',
      platformId: 'gsuite',
      role: PermissionRole.write,
      shared: PermissionShared.none,
      type: PermissionType.domain,
      status: PermissionItemStatus.active
    }
  ]
}

export const Loading = Template.bind({})
Loading.args = {
  loading: true
}
