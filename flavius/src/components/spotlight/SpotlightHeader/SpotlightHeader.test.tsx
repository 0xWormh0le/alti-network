import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { SpotlightHeader, SpotlightHeaderProps } from './SpotlightHeader'
import Person from 'models/Person'
import { waitForElement } from '@testing-library/react'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

const person = new Person({
  name: {
    givenName: 'Test',
    familyName: 'User',
    fullName: 'Test User'
  },
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
  avatar: {
    url: 'avatar',
    url_etag: 'avatar'
  },
  accessCount: 0,
  riskCount: 0,
  emails: [],
  internal: true,
  internalCount: 1,
  externalCount: 1,
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
})

const anonPerson = new Person({
  name: {
    givenName: 'foo',
    familyName: 'bar',
    fullName: 'foo bar'
  },
  primaryEmail: {
    address: '12345',
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
    url: 'avatar',
    url_etag: 'avatar'
  },
  accessCount: 0,
  riskCount: 0,
  emails: [],
  internal: false,
  internalCount: 1,
  externalCount: 1,
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
})

describe('SpotlightHeader', () => {
  it('renders correctly', () => {
    const props: SpotlightHeaderProps = {
      person
    }
    const { container } = renderWithRouter(<SpotlightHeader {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders anonmyous user treatment correctly', async () => {
    const props: SpotlightHeaderProps = {
      person: anonPerson
    }
    const { container } = renderWithRouter(<SpotlightHeader {...props} />)
    const headerEmail = await waitForElement(() => container.querySelector('.SpotlightHeader__title--email'))
    if (anonPerson && anonPerson.primaryEmail && anonPerson.primaryEmail.address) {
      expect(headerEmail).toHaveTextContent(anonPerson.primaryEmail.address)
    }
  })
})
