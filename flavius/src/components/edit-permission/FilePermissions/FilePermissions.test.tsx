import React from 'react'
import { render } from '@testing-library/react'

import FilePermissions, { FilePermissionsProps } from './FilePermissions'
import { PermissionType, PermissionShared, PermissionRole, PermissionItemStatus } from 'types/common'
import noop from 'lodash/noop'

const types: PermissionType[] = [PermissionType.anyone, PermissionType.domain, PermissionType.user]

const shareds: PermissionShared[] = [PermissionShared.external, PermissionShared.internal, PermissionShared.none]

const roles: PermissionRole[] = [PermissionRole.read, PermissionRole.write, PermissionRole.own]

const statuses: PermissionItemStatus[] = [
  PermissionItemStatus.active,
  PermissionItemStatus.pending,
  PermissionItemStatus.cannotBeRemoved
]

const permissionIds = ['anyoneWithLink', 'other']
const discoverables = [true, false]
const permissions: Permission[] = []

types.forEach((type) => {
  discoverables.forEach((discoverable) => {
    shareds.forEach((shared) => {
      roles.forEach((role) => {
        permissionIds.forEach((id) => {
          statuses.forEach((status) =>
            permissions.push({
              discoverable,
              role,
              shared,
              type,
              permissionId: id,
              platformId: 'gsuite',
              status
            })
          )
        })
      })
    })
  })
})

const props: FilePermissionsProps = {
  getPermissions: noop,
  onPageChange: noop,
  fileName: 'FileName',
  loading: false,
  fileId: 'FileId',
  entityCount: 1,
  ownerEmail: 'bobbie@thoughtlabs.io',
  riskId: '1',
  platformId: 'gsuite',
  pageSize: 1,
  pageCount: 1,
  pageNumber: 1,
  totalEntityCount: 1,
  permissions
}

describe('File Permissions', () => {
  it('renders correctly', () => {
    const { container } = render(<FilePermissions {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders remove button when role is write, shared is external, type is anyone and status is ACTIVE', () => {
    const activePermission: Permission = {
      discoverable: true,
      permissionEmailAddress: 'bobbit@thoughtlabs.io',
      permissionId: '1',
      platformId: 'gsuite',
      role: PermissionRole.write,
      shared: PermissionShared.external,
      type: PermissionType.anyone,
      status: PermissionItemStatus.active
    }

    const newProps = { ...props, permissions: [activePermission] }
    const { container } = render(<FilePermissions {...newProps} />)

    expect(container.querySelector('.StatusLabel')).toBeNull()
    expect(container.querySelector('button')).toBeEnabled()
    expect(container.querySelector('button')).toHaveTextContent('Remove')
  })

  it('status is "Removal in progress" when role is read, shared is external, type is domain and status is PENDING', () => {
    const activePermission: Permission = {
      discoverable: true,
      permissionEmailAddress: 'bobbit@thoughtlabs.io',
      permissionId: '1',
      platformId: 'gsuite',
      role: PermissionRole.read,
      shared: PermissionShared.external,
      type: PermissionType.domain,
      status: PermissionItemStatus.pending
    }

    const newProps = { ...props, permissions: [activePermission] }
    const { container } = render(<FilePermissions {...newProps} />)

    expect(container.querySelector('.StatusLabel')).toHaveTextContent('Removal in progress')
    expect(container.querySelector('.StatusLabel img')).toHaveAttribute('src', 'pending.svg')
    expect(container.querySelector('button')).toBeNull()
  })

  it('status is "Permission can not be removed" when role is own, shared is external, type is anyone and status is CANNOT_BE_REMOVED', () => {
    const activePermission: Permission = {
      discoverable: true,
      permissionEmailAddress: 'bobbit@thoughtlabs.io',
      permissionId: '1',
      platformId: 'gsuite',
      role: PermissionRole.own,
      shared: PermissionShared.external,
      type: PermissionType.anyone,
      status: PermissionItemStatus.cannotBeRemoved
    }

    const newProps = { ...props, permissions: [activePermission] }
    const { container } = render(<FilePermissions {...newProps} />)

    expect(container.querySelector('.StatusLabel')).toHaveTextContent('Permission can not be removed')
    expect(container.querySelector('.StatusLabel img')).toHaveAttribute('src', 'warning-small.svg')
    expect(container.querySelector('button')).toBeNull()
  })

  it('renders remove button when role is read, shared is external, type is anyone and status is ACTIVE', () => {
    const activePermission: Permission = {
      discoverable: true,
      permissionEmailAddress: 'bobbit@thoughtlabs.io',
      permissionId: '1',
      platformId: 'gsuite',
      role: PermissionRole.read,
      shared: PermissionShared.external,
      type: PermissionType.anyone,
      status: PermissionItemStatus.active
    }

    const newProps = { ...props, permissions: [activePermission] }
    const { container } = render(<FilePermissions {...newProps} />)

    expect(container.querySelector('.StatusLabel')).toBeNull()
    expect(container.querySelector('button')).toBeEnabled()
    expect(container.querySelector('button')).toHaveTextContent('Remove')
  })

  it('renders remove button when role is read, shared is external, type is anyone and status is REMOVED', () => {
    const activePermission: Permission = {
      discoverable: true,
      permissionEmailAddress: 'bobbit@thoughtlabs.io',
      permissionId: '1',
      platformId: 'gsuite',
      role: PermissionRole.read,
      shared: PermissionShared.external,
      type: PermissionType.anyone,
      status: PermissionItemStatus.removed
    }

    const newProps = { ...props, permissions: [activePermission] }
    const { container } = render(<FilePermissions {...newProps} />)

    expect(container.querySelector('.StatusLabel')).toBeNull()
    expect(container.querySelector('button')).toBeEnabled()
    expect(container.querySelector('button')).toHaveTextContent('Remove')
  })

  it('status is "Permission can not be removed" when role is read, type is domain, shared is internal and status is CANNOT_BE_REMOVED', () => {
    const activePermission: Permission = {
      discoverable: true,
      permissionEmailAddress: 'bobbit@thoughtlabs.io',
      permissionId: '1',
      platformId: 'gsuite',
      role: PermissionRole.read,
      shared: PermissionShared.internal,
      type: PermissionType.domain,
      status: PermissionItemStatus.cannotBeRemoved
    }

    const newProps = { ...props, permissions: [activePermission] }
    const { container } = render(<FilePermissions {...newProps} />)

    expect(container.querySelector('.StatusLabel')).toHaveTextContent('Permission can not be removed')
    expect(container.querySelector('.StatusLabel img')).toHaveAttribute('src', 'warning-small.svg')
    expect(container.querySelector('button')).toBeNull()
  })

  it('renders remove button when role is read, shared is internal, type is anyone and status is ACTIVE', () => {
    const activePermission: Permission = {
      discoverable: true,
      permissionEmailAddress: 'bobbit@thoughtlabs.io',
      permissionId: '1',
      platformId: 'gsuite',
      role: PermissionRole.read,
      shared: PermissionShared.internal,
      type: PermissionType.anyone,
      status: PermissionItemStatus.active
    }

    const newProps = { ...props, permissions: [activePermission] }
    const { container } = render(<FilePermissions {...newProps} />)

    expect(container.querySelector('.StatusLabel')).toBeNull()
    expect(container.querySelector('button')).toBeEnabled()
    expect(container.querySelector('button')).toHaveTextContent('Remove')
  })
})
