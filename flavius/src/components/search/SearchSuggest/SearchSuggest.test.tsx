import React from 'react'
import { render } from '@testing-library/react'

import SearchSuggest, { getOptionsFromPerson, getOptions, SearchSuggestProps } from './SearchSuggest'

import { UsageKind, UserKind, AccessLevel } from 'types/common'

const people = [
  {
    primaryEmail: {
      address: 'john@gmail.com',
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
      givenName: 'John',
      familyName: 'Doe',
      fullName: 'John Doe'
    },
    avatar: {
      url: 'avatar',
      url_etag: 'avatar'
    },
    internal: true,
    internalCount: 1,
    externalCount: 1,
    accessCount: 10940,
    riskCount: 124,
    emails: [
      {
        address: 'john@altitudenetworks.com',
        kind: UsageKind.personal,
        accessCount: 52,
        riskCount: 103,
        primary: true,
        lastDeletedPermissions: 0
      }
    ],
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
  },
  {
    primaryEmail: {
      address: 'michael@gmail.com',
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
      givenName: 'Michael',
      familyName: 'Jackson',
      fullName: 'Michael Jackson'
    },
    avatar: {
      url: 'avatar',
      url_etag: 'avatar'
    },
    internal: false,
    internalCount: 0,
    externalCount: 0,
    accessCount: 0,
    riskCount: 0,
    emails: [],
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
]

const domains = ['gmail.com', 'thoughtlabs.io']

describe('SearchSuggest', () => {
  describe('getOptionsFromPerson', () => {
    it('returns both internal and external items if other emails are included', () => {
      const options = getOptionsFromPerson(people[0])
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveProperty('label', 'John Doe')
      expect(options[0]).toHaveProperty('value', 'john@gmail.com')
      expect(options[0]).toHaveProperty('internal', true)
      expect(options[1]).toHaveProperty('label', 'John Doe')
      expect(options[1]).toHaveProperty('value', 'john@altitudenetworks.com')
      expect(options[1]).toHaveProperty('internal', false)
      expect(options[1]).toHaveProperty('file', false)
    })
  })

  describe('getSearchOptions', () => {
    it('returns items of filtered people whose full name or email includes search keywords in SearchSuggestValue type.', () => {
      const options = getOptions(people, 'joh', domains)
      expect(options).toHaveLength(2)
      expect(options[0]).toHaveProperty('label', 'John Doe')
      expect(options[0]).toHaveProperty('value', 'john@gmail.com')
      expect(options[0]).toHaveProperty('internal', true)
      expect(options[1]).toHaveProperty('label', 'John Doe')
      expect(options[1]).toHaveProperty('value', 'john@altitudenetworks.com')
      expect(options[1]).toHaveProperty('internal', false)
      expect(options[1]).toHaveProperty('file', false)

      const options2 = getOptions(people, 'michael@gmail.com', domains)
      expect(options2).toHaveLength(1)
      expect(options2[0]).toHaveProperty('label', 'Michael Jackson')
      expect(options2[0]).toHaveProperty('value', 'michael@gmail.com')
    })

    it('returns empty list when search keyword is blank.', () => {
      const options = getOptions(people, '', domains)
      expect(options).toHaveLength(0)
    })

    it('returns empty list when both people and search keyword are blank.', () => {
      const options = getOptions([], '', domains)
      expect(options).toHaveLength(0)
    })

    it('handles entering an exact email to search for external domain user', () => {
      const options = getOptions(people, 'amir@altitudenetworks.com', domains)
      expect(options).toHaveLength(1)
      expect(options[0]).toHaveProperty('label', 'amir@altitudenetworks.com')
      expect(options[0]).toHaveProperty('value', 'amir@altitudenetworks.com')
    })

    it('handles entering an exact file id to search for a file', () => {
      const options = getOptions(people, '1lNHg9vtmUeviUdpBV91Ku4CIhURhbHkqkHkGf2jAN4o', domains)
      expect(options).toHaveLength(1)
      expect(options[0]).toHaveProperty('label', '1lNHg9vtmUeviUdpBV91Ku4CIhURhbHkqkHkGf2jAN4o')
      expect(options[0]).toHaveProperty('value', '1lNHg9vtmUeviUdpBV91Ku4CIhURhbHkqkHkGf2jAN4o')
      expect(options[0]).toHaveProperty('file', true)
    })
  })

  describe('component', () => {
    it('renders correctly', () => {
      const props: SearchSuggestProps = {
        domains,
        people,
        onSelect: jest.fn()
      }
      const { container } = render(<SearchSuggest {...props} />)
      expect(container).toMatchSnapshot()
    })
  })
})
