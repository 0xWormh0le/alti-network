import React from 'react'
import FileGrid from '../FileGrid'
import { renderWithRouter } from 'test/support/helpers'
import API from '@aws-amplify/api/lib'

import { authenticatedUser } from 'test/mocks'
import { UserContextProvider } from 'models/UserContext'
import noop from 'lodash/noop'
import { UsageKind, UserKind, AccessLevel, FileGridNavType } from 'types/common'
import UI_STRINGS from 'util/ui-strings'
import CONSTANTS from 'util/constants'

jest.mock('@aws-amplify/api/lib')

const FILE_MOCK: IFile = {
  fileId: '1342451',
  fileName: 'Quarterly Earnings',
  app: 'GDrive' as AppType,
  platformId: 'gsuite',
  createdBy: {
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
  createdAt: 1504170378,
  lastModified: 1534150370,
  linkVisibility: 'external_discoverable' as LinkVisibility,
  internalAccessList: [],
  internalAccessCount: 0,
  externalAccessList: [],
  externalAccessCount: 0,
  mimeType: 'document',
  webLink: 'https://drive.google.com/file-id',
  parentFolder: {
    folderId: '1234',
    folderName: 'Earnings'
  }
}

const FILE_MOCK2: IFile = {
  fileId: '1342451',
  fileName: 'Quarterly Earnings',
  app: 'GDrive' as AppType,
  platformId: 'gsuite',
  createdBy: {
    name: {
      givenName: 'Joe',
      familyName: 'Schmough',
      fullName: 'Joe Schmough'
    },
    primaryEmail: {
      address: 'joe@gmail.com',
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
  createdAt: 1504170378,
  lastModified: 1534150370,
  linkVisibility: 'external_discoverable' as LinkVisibility,
  internalAccessList: [],
  internalAccessCount: 0,
  externalAccessList: [],
  externalAccessCount: 0,
  mimeType: 'document',
  webLink: 'https://drive.google.com/file-id',
  parentFolder: {
    folderId: '1234',
    folderName: 'Earnings'
  }
}

const domains = ['thoughtlabs.io']

const contextValue = {
  authenticatedUser,
  domains,
  userHasAuthenticated: () => true,
  setShowWelcomeDialog: (v: boolean) => v,
  showWelcomeDialog: false,
  isTrial: false
}

beforeEach(() => {
  // Mocking server response, to return an empty list of events
  const apiGet: any = API.get
  apiGet.mockResolvedValue({
    data: {
      events: [],
      orderBy: 'datetime',
      sort: 'desc',
      pageCount: 0,
      pageNumber: 1,
      pageSize: 10
    }
  })
})

describe('FileGrid', () => {
  it('should render FileGridHeader', () => {
    const { getByText } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <FileGrid
          file={FILE_MOCK}
          fileId={FILE_MOCK.fileId}
          loading={false}
          selection={FileGridNavType.TIMELINE}
          onChangeSelection={noop}
          isFolder={false}
        />
      </UserContextProvider>
    )

    expect(getByText('External & Discoverable')).toBeInTheDocument()
  })

  it('should render table of events', () => {
    const { container } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <FileGrid
          file={FILE_MOCK}
          fileId={FILE_MOCK.fileId}
          loading={false}
          selection={FileGridNavType.TIMELINE}
          onChangeSelection={noop}
          isFolder={false}
        />
      </UserContextProvider>
    )
    expect(container.querySelector('.FileEvents')).toBeTruthy()
  })

  it('should render status indicator instead of table if the file is externally owned', () => {
    const { container } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <FileGrid
          file={FILE_MOCK2}
          fileId={FILE_MOCK2.fileId}
          loading={false}
          selection={FileGridNavType.TIMELINE}
          onChangeSelection={noop}
          owner='hello@world.com'
          isFolder={false}
        />
      </UserContextProvider>
    )
    expect(container.querySelector('.FileGrid__external')).toBeTruthy()
  })

  describe('External Ownership', () => {
    it('shows banner if the file is externally owned', () => {
      const { container } = renderWithRouter(
        <UserContextProvider value={contextValue}>
          <FileGrid
            fileId={FILE_MOCK2.fileId}
            file={FILE_MOCK2}
            loading={false}
            selection={FileGridNavType.TIMELINE}
            onChangeSelection={noop}
            owner='hello@world.com'
            isFolder={false}
          />
        </UserContextProvider>
      )
      expect(container.querySelector('.FileGridBanner')).toBeTruthy()
    })

    it('shows no banner if the file is not externally owned', () => {
      const { container } = renderWithRouter(
        <UserContextProvider value={contextValue}>
          <FileGrid
            file={FILE_MOCK2}
            fileId={FILE_MOCK2.fileId}
            loading={false}
            selection={FileGridNavType.TIMELINE}
            onChangeSelection={noop}
            isFolder={false}
          />
        </UserContextProvider>
      )
      expect(container.querySelector('.FileGridBanner')).toBeFalsy()
    })
  })

  it('should render table of folder contents', () => {
    const { container, getByTestId } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <FileGrid
          file={FILE_MOCK}
          fileId={FILE_MOCK.fileId}
          loading={false}
          selection={FileGridNavType.FILES_IN_FOLDER}
          onChangeSelection={noop}
          isFolder={false}
        />
      </UserContextProvider>
    )

    expect(container.querySelector('.SectionTitle')).toHaveTextContent('Earnings')
    expect(container.querySelector('.SectionTitle span')).toHaveClass('FileGrid__section__title-folder')
    expect(container.querySelector('.FileGrid__section__title-folder')).not.toHaveClass('disabled')
    expect(getByTestId('folderList')).toBeTruthy()
  })

  it(`should render table of folder contents with title ${UI_STRINGS.FILE.EXTERNAL_OR_UNKNOWN} if parentFolder.folderName is ${CONSTANTS.EXTERNAL_OR_UNKNOWN}`, () => {
    const newFileMock = {
      ...FILE_MOCK,
      parentFolder: {
        folderId: '1234',
        folderName: CONSTANTS.EXTERNAL_OR_UNKNOWN
      }
    }
    const { container, getByTestId } = renderWithRouter(
      <UserContextProvider value={contextValue}>
        <FileGrid
          file={newFileMock}
          fileId={FILE_MOCK.fileId}
          loading={false}
          selection={FileGridNavType.FILES_IN_FOLDER}
          onChangeSelection={noop}
          isFolder={false}
        />
      </UserContextProvider>
    )

    expect(container.querySelector('.SectionTitle')).toHaveTextContent(UI_STRINGS.FILE.EXTERNAL_OR_UNKNOWN)
    expect(container.querySelector('.SectionTitle span')).toHaveClass('FileGrid__section__title-folder')
    expect(container.querySelector('.FileGrid__section__title-folder')).toHaveClass('disabled')
    expect(getByTestId('folderList')).toBeTruthy()
  })
})
