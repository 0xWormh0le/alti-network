import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'
import SpotlightContainer, { SpotlightContainerProps } from './SpotlightContainer'
import { BrowserRouter } from 'react-router-dom'
import StorybookAmplifyContainer from 'components/storybook-widgets/StorybookAmplifyContainer'
import { rest } from 'msw'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

export default {
  title: 'Spotlight/SpotlightContainer',
  component: SpotlightContainer
} as Meta

const personStatData = {
  labels: [
    1527811200, 1530403200, 1533081600, 1535760000, 1538352000, 1541030400, 1543622400, 1546300800, 1548979200,
    1551398400, 1554076800, 1556668800
  ],
  series: {
    appDownloads: [8, 0, 0, 0, 0, 2, 0, 0, 0, 18, 0, 0],
    personDownloads: [8, 0, 0, 0, 0, 2, 0, 0, 0, 18, 0, 0],
    collaborators: [3, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0],
    filesSharedWith: [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    allActivity: [98, 22, 29, 1, 0, 74, 0, 11, 23, 97, 52, 0],
    risks: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0],
    filesSharedBy: [3, 0, 0, 0, 0, 0, 0, 0, 0, 7, 0, 0],
    filesAccessible: [],
    atRiskFilesOwned: [],
    risksCreated: []
  }
}

const personData = {
  name: {
    familyName: 'John',
    givenName: 'Doe',
    fullName: 'John Doe'
  },
  primaryEmail: {
    address: 'john@thoughtlabs.io',
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
  accessCount: 9765,
  riskCount: 839,
  emails: [
    {
      address: 'john@altitudenetworks.com',
      primary: true,
      accessCount: 302,
      riskCount: 98,
      kind: UsageKind.personal,
      lastDeletedPermissions: 0
    }
  ],
  internal: false,
  internalCount: 2,
  externalCount: 3,
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

const risksData = {
  risks: [
    {
      app: 'GDrive',
      creator: {
        name: {
          familyName: 'John',
          givenName: 'Doe',
          fullName: 'John Doe'
        },
        primaryEmail: {
          address: 'bobbie@email.com',
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
        riskCount: 0,
        accessCount: 0,
        internal: false,
        internalCount: 0,
        externalCount: 0,
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
      datetime: 1611704400,
      fileCount: 157,
      owner: {
        app: 'GDrive',
        creator: {
          name: {
            familyName: 'John',
            givenName: 'Doe',
            fullName: 'John Doe'
          },
          primaryEmail: {
            address: 'bobbie@email.com',
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
          riskCount: 0,
          accessCount: 0,
          internal: false,
          internalCount: 0,
          externalCount: 0,
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
        datetime: 1611704400,
        fileCount: 157
      },
      plugin: {
        id: '123123',
        name: 'GDrive'
      },

      riskDescription: 'This is the risk description',
      riskId: '1652739801231',
      riskTypeId: 3010,
      riskTarget: [],
      sensitivePhrases: {
        ccNumFileCount: 0,
        sensitiveKeywordsFileCount: 0,
        ssnFileCount: 0
      },
      severity: 5
    }
  ]
}

const Template: Story<SpotlightContainerProps> = (args) => (
  <BrowserRouter>
    <StorybookAmplifyContainer>
      <SpotlightContainer {...args} />
    </StorybookAmplifyContainer>
  </BrowserRouter>
)

const handlers = [
  rest.get('/api/dev-01/person/1', (req, res, ctx) => {
    return res(ctx.json(personData))
  }),
  rest.get('/api/dev-01/person/1/stats', (req, res, ctx) => {
    return res(ctx.json(personStatData))
  }),
  rest.get('/api/dev-01/risks', (req, res, ctx) => {
    return res(ctx.json(risksData))
  }),
  rest.get('/api/dev-01/permissions/status', (req, res, ctx) => {
    return res(
      ctx.json({
        active: 1,
        completed: 2,
        failed: 3,
        pending: 4,
        totalCount: 10
      })
    )
  })
]

export const NoResults = Template.bind({})
NoResults.args = {}

NoResults.parameters = {
  msw: handlers
}

export const WithId = Template.bind({})
WithId.args = {
  personId: '1',
  wrapperType: 'page'
}

WithId.parameters = {
  msw: handlers
}
