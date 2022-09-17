import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import Search from './Search'
import API from '@aws-amplify/api/lib'
import { act } from 'react-dom/test-utils'
jest.mock('@aws-amplify/api/lib')

describe('Search', () => {
  beforeEach(async () => {
    const apiGet: any = API.get
    apiGet.mockResolvedValue({
      people: [
        {
          accessCount: 0,
          accessLevel: 'member',
          altnetId: 'ce38d0e2-5a75-5174-ba3f-f27e59be378c',
          creationTime: 0,
          emails: {
            address: 'joe@thoughtlabs.io.test-google-a.com',
            kind: 'work',
            lastDeletedPermissions: 0,
            primary: false,
            riskCount: 0
          },
          externalCount: 2,
          internal: true,
          internalCount: 1,
          isEnrolledInMFA: false,
          lastLoginTime: 0,
          lastModifiedTime: 0,
          lastRemovedPermissions: 0,
          name: { familyName: 'f', fullName: 'joe f', givenName: 'joe' },
          primaryEmail: {
            accessCount: 0,
            address: 'joe@thoughtlabs.io',
            kind: 'work',
            lastDeletedPermissions: 0,
            primary: true
          },
          projectId: 'thoughtlabs',
          riskCount: 0
        }
      ]
    })
  })
  it('renders correctly', async () => {
    await act(async () => {
      const { container } = renderWithRouter(<Search />)
      expect(container).toMatchSnapshot()
    })
  })
})
