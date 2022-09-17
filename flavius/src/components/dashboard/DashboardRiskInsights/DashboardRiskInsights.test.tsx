import React from 'react'
import { waitForElement } from '@testing-library/react'
import API from '@aws-amplify/api/lib'

import { renderWithRouter } from 'test/support/helpers'
import { DashboardRiskInsights } from './DashboardRiskInsights'

import { UsageKind, UserKind, AccessLevel } from 'types/common'

jest.mock('@aws-amplify/api/lib')

describe('DashboardRiskInsights', () => {
  beforeEach(() => {
    const apiGet: any = API.get
    apiGet.mockResolvedValue({
      mostRisksCreated: {
        person: {
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
          name: {
            givenName: '',
            familyName: '',
            fullName: ''
          },
          avatar: {
            url: '',
            url_etag: ''
          },
          internal: true,
          internalCount: 0,
          externalCount: 0,
          accessCount: 0,
          riskCount: 53,
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
        },
        count: 53
      },
      highestRiskFile: {
        file: {
          fileName: 'aes_test.c',
          fileId: '1-3Rb6ikp_NP5CsBNaSeHuUp5J0ND65bP',
          createdAt: null,
          lastModified: null,
          internalAccessCount: null,
          externalAccessCount: 7,
          linkVisibility: 'external',
          externalAccessList: [],
          internalAccessList: [],
          createdBy: {
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
            name: {
              givenName: '',
              familyName: '',
              fullName: ''
            },
            avatar: {
              url: '',
              url_etag: ''
            },
            internal: false,
            internalCount: 0,
            externalCount: 0,
            accessCount: 0,
            riskCount: 96,
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
        },
        count: 7
      },
      mostAtRiskFilesOwned: {
        person: {
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
          name: {
            givenName: '',
            familyName: '',
            fullName: ''
          },
          avatar: {
            url: '',
            url_etag: ''
          },
          internal: true,
          internalCount: 0,
          externalCount: 0,
          accessCount: 0,
          riskCount: 2508,
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
        },
        count: 2508
      },
      mostExternalAccess: {
        person: {
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
          name: {
            givenName: '',
            familyName: '',
            fullName: ''
          },
          avatar: {
            url: '',
            url_etag: ''
          },
          internal: false,
          internalCount: 0,
          externalCount: 0,
          accessCount: 0,
          riskCount: 96,
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
        },
        count: 96
      }
    })
  })

  it('renders correctly', async () => {
    const { container } = renderWithRouter(<DashboardRiskInsights />)
    await waitForElement(() => container.querySelectorAll('.DashboardRiskInsights__tile-item').length)
    expect(container).toMatchSnapshot()
  })
})
