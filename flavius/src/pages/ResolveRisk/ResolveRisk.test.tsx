import React from 'react'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from 'test/support/helpers'
import ResolveRisk from './ResolveRisk'
import { act } from 'react-dom/test-utils'
import { when } from 'jest-when'
import { RenderResult } from '@testing-library/react'
import { GENERAL_URLS } from 'api/endpoints'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

describe('ResolveRisk', () => {
  beforeEach(async () => {
    const apiGet: any = API.get
    const data = JSON.parse(
      '{"files": [{"createdAt": 1596045136, "createdBy": {"accessCount": 0, "avatar": {"url": "avatar", "url_etag": "avatar"}, "primaryEmail": {"address": "", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "recoveryEmail": {"address": "test@email.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "name": {"givenName": null, "familyName": null}, "emails": [], "riskCount": 0}, "externalAccessCount": 0, "externalAccessList": [], "fileId": "1twMLSepL5JXTtvfZvdJAEQ6Vc3jDsxH_xkPRql8QuBA", "fileName": "test-external", "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document", "internalAccessCount": 0, "internalAccessList": [], "lastIngested": 1602569505, "lastModified": 1596045218, "linkVisibility": "none", "md5Checksum": null, "mimeType": "document", "sharedToDomains": [], "trashed": false}, {"createdAt": 1596044926, "createdBy": {"accessCount": 0, "avatar": {"url": "avatar", "url_etag": "avatar"}, "primaryEmail": {"address": "", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "recoveryEmail": {"address": "test@email.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "name": {"givenName": null, "familyName": null}, "emails": [], "riskCount": 0}, "externalAccessCount": 0, "externalAccessList": [], "fileId": "1QtwZk6fMLR2rbZOMCzKaqyqA5uqiJgq35hE-Sfya6l4", "fileName": "FileSharedExternally", "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.document", "internalAccessCount": 0, "internalAccessList": [], "lastIngested": 1602569505, "lastModified": 1596045094, "linkVisibility": "none", "md5Checksum": null, "mimeType": "document", "sharedToDomains": [], "trashed": false}, {"createdAt": 1596044859, "createdBy": {"accessCount": 0, "avatar": {"url": "avatar", "url_etag": "avatar"}, "primaryEmail": {"address": "", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "recoveryEmail": {"address": "test@email.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "name": {"givenName": null, "familyName": null}, "emails": [], "riskCount": 0}, "externalAccessCount": 0, "externalAccessList": [], "fileId": "0APHZWbLMYZLHUk9PVA", "fileName": "Drive", "iconUrl": null, "internalAccessCount": 0, "internalAccessList": [], "lastIngested": 1602539219, "lastModified": 1596044859, "linkVisibility": "none", "md5Checksum": null, "mimeType": "folder", "sharedToDomains": [], "trashed": false}, {"createdAt": 1533945876, "createdBy": {"accessCount": 0, "avatar": {"url": "avatar", "url_etag": "avatar"}, "primaryEmail": {"address": "dev-01@g-drive-usage-monitoring.iam.gserviceaccount.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "recoveryEmail": {"address": "test@email.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "name": {"givenName": "dev-01", "familyName": "dev-01"}, "emails": [], "riskCount": 0}, "externalAccessCount": 0, "externalAccessList": [], "fileId": "0Bw5MKqz8XL31c3RhcnRlcl9maWxl", "fileName": "Getting started", "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/pdf", "internalAccessCount": 0, "internalAccessList": [], "lastIngested": 1602569627, "lastModified": 1590699867, "linkVisibility": "none", "md5Checksum": null, "mimeType": "application/pdf", "sharedToDomains": [], "trashed": false}, {"createdAt": 1572495460, "createdBy": {"accessCount": 0, "avatar": {"url": "avatar", "url_etag": "avatar"}, "primaryEmail": {"address": "dev-01@g-drive-usage-monitoring.iam.gserviceaccount.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "recoveryEmail": {"address": "test@email.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "name": {"givenName": "dev-01", "familyName": "dev-01"}, "emails": [], "riskCount": 0}, "externalAccessCount": 0, "externalAccessList": [], "fileId": "1CL7KqjXvMhRHKrRzoz77IMmxmi7On7Ev", "fileName": "test_from_jupyter", "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/octet-stream", "internalAccessCount": 0, "internalAccessList": [], "lastIngested": 1602569627, "lastModified": 1590699842, "linkVisibility": "none", "md5Checksum": null, "mimeType": "application/octet-stream", "sharedToDomains": [], "trashed": false}, {"createdAt": 1572500789, "createdBy": {"accessCount": 0, "avatar": {"url": "avatar", "url_etag": "avatar"}, "primaryEmail": {"address": "dev-01@g-drive-usage-monitoring.iam.gserviceaccount.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "recoveryEmail": {"address": "test@email.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "name": {"givenName": "dev-01", "familyName": "dev-01"}, "emails": [], "riskCount": 0}, "externalAccessCount": 0, "externalAccessList": [], "fileId": "1ijMT05DsyedURDteWNj6y6yWfQOhLGdv", "fileName": "bitcoin.png", "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/image/png", "internalAccessCount": 0, "internalAccessList": [], "lastIngested": 1602569627, "lastModified": 1590699819, "linkVisibility": "none", "md5Checksum": null, "mimeType": "image/png", "sharedToDomains": [], "trashed": false}, {"createdAt": 1536107396, "createdBy": {"accessCount": 0, "avatar": {"url": "avatar", "url_etag": "avatar"}, "primaryEmail": {"address": "michael@altitudenetworks.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "recoveryEmail": {"address": "test@email.com", "kind": 1, "primary": true, "accessCount": 0, "riskCount": 0, "lastDeletedPermissions": 0}, "name": {"givenName": "Michael", "familyName": "Coates"}, "emails": [], "riskCount": 0}, "externalAccessCount": 0, "externalAccessList": [], "fileId": "1Rtyg3zaPmpo-6qI6VTn0ngP10uSiFLIogodIL59v-xI", "fileName": "shared with thoughtlabs", "iconUrl": "https://drive-thirdparty.googleusercontent.com/256/type/application/vnd.google-apps.presentation", "internalAccessCount": 0, "internalAccessList": [], "lastIngested": 1602569680, "lastModified": 1536107417, "linkVisibility": "none", "md5Checksum": null, "mimeType": "presentation", "sharedToDomains": [], "trashed": false}], "orderBy": "lastModified", "pageCount": 1, "pageCountCacheTTL": 3600000, "pageCountLastUpdated": 1603465646, "pageNumber": 1, "pageSize": 10, "riskId": "247a1352d5f209f2b4d60050c017998169bb8432", "sort": "DESC"}'
    )

    const resolutionStatus = { active: 1, completed: 0, failed: 0, pending: 0, totalCount: 1 }
    const riskId = '247a1352d5f209f2b4d60050c017998169bb8432'

    when<any, string[]>(apiGet)
      .calledWith('files', `${GENERAL_URLS.FILES}?risk-id=${riskId}&page-number=1`)
      .mockResolvedValue(data)
    when<any, string[]>(apiGet)
      .calledWith('permissions', `${GENERAL_URLS.PERMISSIONS}/status?risk-id=${riskId}`)
      .mockResolvedValue(resolutionStatus)

    await act(async () => {
      const history = {}
      const match = {
        path: '/risks/resolve/:riskId',
        url: `/risks/resolve/${riskId}`,
        isExact: true,
        params: { riskId }
      }
      const location = {
        pathname: `/risks/resolve/${riskId}`,
        search: `?riskId=${riskId}&riskTypeId=2000&email=michael%40altitudenetworks.com&fileCount=7`,
        hash: '',
        key: 'gsj599'
      }
      const props: any = { match, history, location }
      renderResult = renderWithRouter(<ResolveRisk {...props} />)
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has elements', async () => {
    const { getByText, container } = renderResult
    expect(getByText(/test-external/i)).toBeInTheDocument()
    expect(getByText(/FileSharedExternally/i)).toBeInTheDocument()
    expect(getByText(/Drive/i)).toBeInTheDocument()
    expect(getByText(/Getting started/i)).toBeInTheDocument()
    expect(container.querySelectorAll('.FilesAccessed .Table__row button')[0]).not.toHaveClass('Button--disabled')
    expect(container.querySelectorAll('.FilesAccessed .Table__row button')[1]).not.toHaveClass('Button--disabled')
    expect(container.querySelectorAll('.FilesAccessed .Table__row button')[2]).not.toHaveClass('Button--disabled')
    expect(container.querySelectorAll('.FilesAccessed .Table__row button')[3]).toHaveClass('Button--disabled')
  })
})
