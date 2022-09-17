import React from 'react'
import SpotlightContactTab, { SpotlightContactTabProps } from './SpotlightContactTab'
import { renderWithRouter } from 'test/support/helpers'
import Person from 'models/Person'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

jest.mock('react', () => {
  const ActualReact = jest.requireActual('react')
  return {
    ...ActualReact,
    useContext: () => ({ domains: ['email.com'] })
  }
})

const person = new Person({
  name: {
    givenName: 'test',
    familyName: 'user',
    fullName: 'test user'
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

describe('SpotlightContactTab', () => {
  it('renders correctly', () => {
    const props: SpotlightContactTabProps = {
      person,
      emailInfo: person.primaryEmail,
      isInternal: false,
      isSelected: false
    }
    const { container } = renderWithRouter(<SpotlightContactTab {...props} />)
    expect(container).toMatchSnapshot()
  })
})
