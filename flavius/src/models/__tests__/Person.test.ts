import Person from '../Person'

import { UsageKind, UserKind, AccessLevel } from 'types/common'

describe('displayName()', () => {
  it('returns full name with first and last name when they are present', () => {
    const person = new Person({
      name: {
        givenName: 'John',
        familyName: 'Smith',
        fullName: 'John Smith'
      },
      avatar: {
        url: '',
        url_etag: ''
      },
      primaryEmail: {
        address: 'john.smith@company.org',
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
      internalCount: 1,
      externalCount: 0,
      internal: true,
      emails: [],
      accessCount: 0,
      riskCount: 99,
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

    expect(person.displayName).toBe('John Smith')
  })

  it('returns email up to @ when first name or last name is not available', () => {
    const person = new Person({
      name: {
        givenName: 'John',
        familyName: '',
        fullName: ''
      },
      primaryEmail: {
        address: 'john.smith@company.org',
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
        url: '',
        url_etag: ''
      },
      internalCount: 1,
      externalCount: 0,
      internal: true,
      emails: [],
      accessCount: 0,
      riskCount: 99,
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

    expect(person.displayName).toBe('john.smith')
  })

  it('returns Anonymous User when email and names are not available', () => {
    const person = new Person({
      name: {
        givenName: '',
        familyName: '',
        fullName: ''
      },
      primaryEmail: {
        address: '',
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
        url: '',
        url_etag: ''
      },
      internalCount: 1,
      externalCount: 0,
      internal: true,
      emails: [],
      accessCount: 0,
      riskCount: 99,
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

    expect(person.displayName).toBe('Anonymous User')
  })
})
