import React from 'react'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from 'test/support/helpers'
import EditFilePermission from './EditFilePermission'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'
import { fileResponse } from 'test/mocks'
import { getQueryString } from 'util/helpers'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

describe('EditFilePermission', () => {
  beforeEach(async () => {
    const apiGet: any = API.get

    const riskId = '637cf1fcf4e2fc776ef668c34767bf7085d5a4a7'
    const fileId = '19570130570'

    apiGet.mockResolvedValue(fileResponse)

    await act(async () => {
      const history = {}
      const match = {
        path: `/risks/${riskId}/permissions/file/:fileId?platform-id=${getQueryString('platformId')}`,
        url: `/risks/${riskId}/permissions/file/${fileId}?platform-id=${getQueryString('platformId')}`,
        isExact: true,
        params: { fileId }
      }
      const location = {
        pathname: `/risks/${riskId}/permissions/file/${fileId}`,
        search: `?modalPage=1&platform-id=${getQueryString('platformId')}`,
        hash: '',
        key: 'gsj599'
      }
      const props: any = { match, history, location }
      renderResult = renderWithRouter(<EditFilePermission {...props} />)
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has elements', async () => {
    const { getAllByText } = renderResult
    if (fileResponse.fileName) {
      expect(getAllByText(fileResponse.fileName)[0]).toBeInTheDocument()
    }
    // permissionsResponse.permissions.forEach((permission: Permission) => {
    //   if (permission.permissionEmailAddress) {
    //     expect(getAllByText(permission.permissionEmailAddress)[0]).toBeInTheDocument()
    //   }
    // })
  })
})
