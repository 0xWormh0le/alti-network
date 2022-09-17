import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import PersonCell, { PersonCellProps } from './PersonCell'
import { BrowserRouter } from 'react-router-dom'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

export default {
  title: 'Elements/PersonCell',
  component: PersonCell
} as Meta

const MULTIPLE_OWNER_FILE_MOCK: FileOwner = {
  name: {
    givenName: 'Joe',
    familyName: 'Schmough',
    fullName: 'Joe Schmough'
  },
  primaryEmail: {
    address: 'joe@thoughtlabs.io',
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
  avatar: {
    url: 'http://i.pravatar.cc/200?img=15',
    url_etag: 'http://i.pravatar.cc/200?img=15'
  },
  internalCount: 1,
  externalCount: 0,
  emails: [],
  internal: true,
  accessCount: 0,
  riskCount: 99,
  riskTypeId: 0,
  fileCount: 2,
  altnetId: '',
  projectId: '',
  accessLevel: AccessLevel.member,
  userKind: UserKind.person,
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
}

const MULTIPLE_OWNER_THOUSANDS_RISK_TYPE_FILE_MOCK: FileOwner = {
  name: {
    givenName: 'Joe-long-name-example-for-test',
    familyName: 'Schmough',
    fullName: 'Joe Schmough'
  },
  primaryEmail: {
    address: 'joe@thoughtlabs.io',
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
  avatar: {
    url: 'http://i.pravatar.cc/200?img=15',
    url_etag: 'http://i.pravatar.cc/200?img=15'
  },
  internalCount: 1,
  externalCount: 0,
  emails: [],
  internal: true,
  accessCount: 0,
  riskCount: 99,
  riskTypeId: 1020,
  fileCount: 1,
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
}

const Template: Story<PersonCellProps> = (args) => (
  <BrowserRouter>
    <PersonCell {...args} />
  </BrowserRouter>
)

export const MultipleOwnerThousandsRiskType = Template.bind({})
MultipleOwnerThousandsRiskType.args = {
  personData: MULTIPLE_OWNER_THOUSANDS_RISK_TYPE_FILE_MOCK
}

export const MultipleFileOwner = Template.bind({})
MultipleFileOwner.args = {
  personData: MULTIPLE_OWNER_FILE_MOCK
}
