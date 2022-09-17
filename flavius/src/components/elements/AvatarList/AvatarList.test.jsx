import React from 'react'
import Person from 'models/Person'
import AvatarList, { UNEXPANDED_MAX_AVATARS } from './AvatarList'
import { fireEvent } from '@testing-library/react'
import { renderWithRouter } from 'test/support/helpers'

import { UsageKind, UserKind, AccessLevel } from 'types/common'

const personEmail = {
  address: 'test@gmail.com',
  kind: UsageKind.personal,
  primary: true,
  accessCount: 0,
  riskCount: 0,
  lastDeletedPermissions: 0
}

const AVATAR_LIST = [
  new Person({
    name: {
      givenName: 'Jazmyn',
      familyName: 'Gillespie',
      fullName: ''
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '2342',
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
  }),
  new Person({
    name: {
      givenName: 'Celeste',
      familyName: 'Bradshaw',
      fullName: ''
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=15',
      url_etag: 'http://i.pravatar.cc/200?img=15'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '6543',
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
  }),
  new Person({
    name: {
      givenName: 'Kara',
      familyName: 'Clements',
      fullName: ''
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '4356',
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
  }),
  new Person({
    name: {
      givenName: 'Leonard',
      familyName: 'Ochoa',
      fullName: ''
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '7448',
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
  }),
  new Person({
    name: {
      givenName: 'John',
      familyName: 'Marshall',
      fullName: ''
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=12',
      url_etag: 'http://i.pravatar.cc/200?img=12'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '2876',
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
  }),
  new Person({
    name: {
      givenName: 'Laura',
      familyName: 'Anderson',
      fullName: ''
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '0979',
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
  }),
  new Person({
    name: {
      givenName: 'Rory',
      familyName: 'Garrett',
      fullName: ''
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '2451',
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
  }),
  new Person({
    name: {
      givenName: 'Timothy',
      familyName: 'Hines',
      fullName: ''
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '9986',
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
  }),
  new Person({
    name: {
      givenName: 'Mitchell',
      familyName: 'Andrade',
      fullName: ''
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '2845',
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
  }),
  new Person({
    name: {
      givenName: 'Kaylin',
      familyName: 'Cuevas',
      fullName: ''
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=19',
      url_etag: 'http://i.pravatar.cc/200?img=19'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '9876',
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
  }),
  new Person({
    name: {
      givenName: 'Bob',
      familyName: 'Shapiro',
      fullName: ''
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=59',
      url_etag: 'http://i.pravatar.cc/200?img=59'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '1198',
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
  }),
  new Person({
    name: {
      givenName: 'Luciana',
      familyName: 'Yedro',
      fullName: ''
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=87',
      url_etag: 'http://i.pravatar.cc/200?img=87'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '1195',
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
  }),
  new Person({
    name: {
      givenName: 'Sofia',
      familyName: 'Pratto',
      fullName: ''
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=88',
      url_etag: 'http://i.pravatar.cc/200?img=88'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '4014',
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
  }),
  new Person({
    name: {
      givenName: 'Magali',
      familyName: 'Fernandez',
      fullName: 'Fernandez'
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=54',
      url_etag: 'http://i.pravatar.cc/200?img=54'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '4054',
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
  }),
  new Person({
    name: {
      givenName: 'Marco',
      familyName: 'Arment',
      fullName: ''
    },
    avatar: {
      url: 'http://i.pravatar.cc/200?img=16',
      url_etag: 'http://i.pravatar.cc/200?img=16'
    },
    primaryEmail: personEmail,
    recoveryEmail: personEmail,
    accessCount: 0,
    riskCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    lastRemovedPermissions: '',
    internal: false,
    altnetId: '8754',
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
]

describe('AvatarList', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<AvatarList people={AVATAR_LIST} />)
    expect(container).toMatchSnapshot()
  })

  it('renders in unexpanded mode, not showing all elements', () => {
    const { container } = renderWithRouter(<AvatarList people={AVATAR_LIST} />)

    expect(container.querySelectorAll('.AvatarList__item').length).toBe(UNEXPANDED_MAX_AVATARS)
    expect(container.querySelectorAll('.AvatarList__expand').length).toBe(1)
  })

  describe('when the ellipsis button is clicked', () => {
    it('renders all elements and the button disappears', () => {
      const { container, getByTestId } = renderWithRouter(<AvatarList people={AVATAR_LIST} />)

      const expandButton = getByTestId('expand-avatar-list')
      fireEvent.click(expandButton)

      expect(container.querySelectorAll('.AvatarList__item').length).toBe(15)
      expect(expandButton).not.toBeInTheDocument()
    })
  })
})
