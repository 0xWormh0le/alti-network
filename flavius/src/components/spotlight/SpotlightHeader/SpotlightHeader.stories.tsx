import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SpotlightHeader, { SpotlightHeaderProps } from './SpotlightHeader'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

export default {
  title: 'Spotlight/SpotlightHeader',
  component: SpotlightHeader
} as Meta

const Template: Story<SpotlightHeaderProps> = (args) => <SpotlightHeader {...args} />

export const Default = Template.bind({})
Default.args = {
  person: {
    primaryEmail: {
      address: 'test@email.com',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    recoveryEmail: {
      address: 'test@email.com',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    name: {
      givenName: 'Test',
      familyName: 'User',
      fullName: 'Test User'
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    accessCount: 0,
    riskCount: 0,
    emails: [
      {
        address: 'email2',
        primary: true,
        accessCount: 1,
        kind: UsageKind.work,
        riskCount: 1,
        lastDeletedPermissions: 0
      },
      {
        address: 'email3',
        primary: true,
        accessCount: 2,
        kind: UsageKind.personal,
        riskCount: 1,
        lastDeletedPermissions: 0
      }
    ],
    internalCount: 1,
    externalCount: 1,
    internal: false,
    altnetId: '',
    projectId: '',
    accessLevel: AccessLevel.member,
    userKind: UserKind.user,
    phones: [],
    externalIds: [],
    orgUnitPath: '',
    etag: '',
    isEnrolledInMFA: false,
    creationTime: 0,
    lastLoginTime: 0,
    lastModifiedTime: 0,
    notes: {
      content: '',
      content_type: ''
    }
  } as any
}
