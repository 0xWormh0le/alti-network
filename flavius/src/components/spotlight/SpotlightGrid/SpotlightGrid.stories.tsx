import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SpotlightGrid, { SpotlightGridProps } from './SpotlightGrid'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

export default {
  title: 'Spotlight/SpotlightGrid',
  component: SpotlightGrid
} as Meta

const Template: Story<SpotlightGridProps> = (args) => <SpotlightGrid {...args} />

export const Default = Template.bind({})
Default.args = {
  personLoading: false,
  activePerson: {
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
      familyName: 'User',
      givenName: 'Test',
      fullName: 'User Test'
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
  } as any,
  subNavLoaded: true,
  subNavTabs: [
    {
      label: 'Label1',
      unit: 'unit',
      value: 12321,
      valueType: 'risk'
    } as any
  ]
}

export const AllLoading = Template.bind({})
AllLoading.args = {
  personLoading: true,
  subNavLoaded: false,
  subNavTabs: [
    {
      label: 'Label1',
      unit: 'unit',
      value: 12321,
      valueType: 'risk'
    } as any
  ]
}
