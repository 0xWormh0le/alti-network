import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { UserKind } from 'types/common'
import FileCell, { MAX_LENGTH_NOT_SENSITIVE } from './FileCell'

it('renders correctly', () => {
  const fileCellValue: FileCellWithRisk = {
    fileName: 'Test Filename',
    fileCount: 1,
    riskId: 'risk1',
    fileId: 'fileA',
    mimeType: 'mimeType',
    platformId: 'gsuite',
    riskTypeId: 1020,
    pluginId: 'pluginId',
    pluginName: 'pluginName',
    app: 'app',
    email: 'email',
    iconUrl: 'iconUrl',
    personId: 'personId',
    text: 'text',
    sensitivePhrases: {
      ccNum: 3,
      sensitiveKeywords: [],
      sensitiveKeywordsFileCount: undefined,
      ssn: 1
    } as SensitivePhraseSingleFile,
    webLink: 'webLink',
    createdBy: {
      accessLevel: 0,
      projectId: 'projectId',
      userKind: UserKind.person,
      accessCount: 0,
      altnetId: 'altnetId',
      anonymous: false,
      primaryEmail: {
        accessCount: 0,
        kind: 0,
        lastDeletedPermissions: 0,
        primary: true,
        riskCount: 1,
        address: 'hello@world.com'
      }
    }
  }
  const { container } = renderWithRouter(<FileCell fileResponse={fileCellValue} />)
  expect(container).toMatchSnapshot()
})

it('links to an individual File page when the risk is related to one file', () => {
  // mocking the `file` object that is built after the data is retrieved
  const fileCellValue: FileCellWithRisk = {
    fileName: 'Test Filename',
    fileCount: 1,
    riskId: 'risk1',
    fileId: 'fileA',
    mimeType: 'mimeType',
    sensitivePhrases: {
      ccNum: 3,
      sensitiveKeywords: [],
      sensitiveKeywordsFileCount: undefined,
      ssn: 1
    } as SensitivePhraseSingleFile,
    webLink: 'webLink',
    app: 'app',
    email: 'email',
    iconUrl: 'iconUrl',
    personId: 'personId',
    pluginId: 'pluginId',
    pluginName: 'pluginName',
    riskTypeId: 1020,
    text: 'text',
    createdBy: {
      accessLevel: 0,
      projectId: 'projectId',
      userKind: UserKind.person,
      accessCount: 0,
      altnetId: 'altnetId',
      anonymous: false,
      primaryEmail: {
        accessCount: 0,
        kind: 0,
        lastDeletedPermissions: 0,
        primary: true,
        riskCount: 1,
        address: 'hello@world.com'
      }
    },
    platformId: 'gsuite'
  }

  const { getByTestId } = renderWithRouter(<FileCell fileResponse={fileCellValue} />)

  const linkElement = getByTestId('file-cell-link')
  expect(linkElement).toHaveAttribute(
    'href',
    '/dashboard/file/fileA?owner=hello@world.com&selection=sensitive&platformId=gsuite&sensitive=true'
  )
})

it('links to a list of Files when the risk is related to many files', () => {
  const fileCellValue: FileCellWithRisk = {
    fileName: 'Test Filename',
    fileCount: 4,
    riskId: 'risk2',
    platformId: 'gsuite',
    fileId: 'fileId',
    mimeType: 'mimeType',
    sensitivePhrases: {
      ccNumFileCount: 3,
      sensitiveKeywords: undefined,
      sensitiveKeywordsFileCount: 4,
      ssnFileCount: 4
    } as SensitivePhraseMultiFile,
    webLink: 'webLink',
    app: 'app',
    email: 'email',
    iconUrl: 'iconUrl',
    personId: 'personId',
    pluginId: 'pluginId',
    pluginName: 'pluginName',
    riskTypeId: 1020,
    text: 'text',
    createdBy: {
      accessLevel: 0,
      projectId: 'projectId',
      userKind: UserKind.person,
      accessCount: 0,
      altnetId: 'altnetId',
      anonymous: false,
      primaryEmail: {
        accessCount: 0,
        kind: 0,
        lastDeletedPermissions: 0,
        primary: true,
        riskCount: 1,
        address: 'hello@world.com'
      }
    }
  }

  const { getByTestId } = renderWithRouter(<FileCell fileResponse={fileCellValue} />)

  const linkElement = getByTestId('file-cell-link')
  expect(linkElement).toHaveAttribute(
    'href',
    '/dashboard/files/risk2?riskTypeId=1020&pluginId=pluginId&pluginName=pluginName&owner=personId&riskTypeId=1020&files-platformIds=["gsuite"]'
  )
})

it('shows file count when the risk is related to many files', () => {
  const fileCellValue: any = {
    fileName: '12345678901234567890123456789012345678901',
    fileCount: 4,
    riskId: 'risk2',
    platformId: 'gsuite',
    createdBy: {
      primaryEmail: {
        address: 'hello@world.com'
      }
    }
  }

  const { getByTestId } = renderWithRouter(<FileCell fileResponse={fileCellValue} />)

  const linkElement = getByTestId('file-cell-link')
  expect(linkElement).toHaveTextContent('4 files')
})

it(`truncates file name when the length is greater than ${MAX_LENGTH_NOT_SENSITIVE}`, () => {
  // mocking the `file` object that is built after the data is retrieved
  const fileCellValue: any = {
    fileName: 'a'.repeat(MAX_LENGTH_NOT_SENSITIVE + 1),
    riskId: 'risk2',
    platformId: 'gsuite',
    createdBy: {
      primaryEmail: {
        address: 'hello@world.com'
      }
    }
  }

  const { getByTestId } = renderWithRouter(<FileCell fileResponse={fileCellValue} />)

  const linkElement = getByTestId('file-cell-link')
  expect(linkElement).toHaveTextContent('…')
})
