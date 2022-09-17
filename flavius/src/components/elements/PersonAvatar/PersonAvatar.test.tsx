import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import PersonAvatar from './PersonAvatar'
import Person from 'models/Person'

import { UsageKind, UserKind, AccessLevel } from 'types/common'

const person = new Person({
  name: {
    givenName: 'Rory',
    familyName: 'Garrett',
    fullName: 'Rory Garrett'
  },
  primaryEmail: {
    address: 'rorygarret@mycompany.org',
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
  internalCount: 1,
  externalCount: 0,
  emails: [],
  internal: true,
  accessCount: 0,
  riskCount: 99,
  altnetId: 'rorygarret@mycompany.org',
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

describe('PersonAvatar', () => {
  describe('when the `clickable` prop is false', () => {
    it('does not render any links and PersonAvatar__clickable classname is not included', () => {
      const { container } = renderWithRouter(<PersonAvatar person={person} clickable={false} />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  describe('when the `clickable` prop is true', () => {
    it('wraps the element with a link (anchor tag) to the Spotlight page using the id from the person', () => {
      const { container } = renderWithRouter(<PersonAvatar person={person} clickable={true} />)
      expect(container.firstChild).toMatchSnapshot()
    })
  })

  it('renders tooltip for avatar', () => {
    const { container } = renderWithRouter(<PersonAvatar person={person} clickable={true} />)
    expect(container.querySelector('.PersonAvatar')).toHaveClass('trigger')
  })
})
