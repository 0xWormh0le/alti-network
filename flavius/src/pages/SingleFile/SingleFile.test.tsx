import React from 'react'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from 'test/support/helpers'
import SingleFile from './SingleFile'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'
import { fileMock } from 'test/mocks'
import moment from 'moment'
import CONSTANTS from 'util/constants'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

const fileId = '1_AXAuCHCr8Zx1plVnW2xmQpbXoPdzKre'
const riskId = '39dfa55283318d31afe5a3ff4a0e3253e2045e43'

describe('SingleFile', () => {
  beforeEach(async () => {
    // @ts-ignore
    API.get.mockResolvedValue(fileMock)

    await act(async () => {
      const history = {}
      const match = {
        path: '/risks/file/:fileId',
        url: `/risks/file/${fileId}`,
        isExact: true,
        params: { fileId }
      }
      const location = {
        pathname: `/risks/file/${fileId}`,
        search: `?riskId=${riskId}&riskTypeId=0&fileCount=10`,
        hash: '',
        key: 'gsj599'
      }
      const props: any = { match, history, location }
      renderResult = renderWithRouter(<SingleFile {...props} />)
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('renders correctly', async () => {
    // @ts-ignore
    API.get.mockResolvedValue(fileMock)
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has elements', async () => {
    const { container } = renderResult
    const { TIME_DISPLAY_FORMAT } = CONSTANTS

    expect(container.querySelectorAll('.FileInfo__name')[0].innerHTML).toBe(fileMock.fileName)
    expect(
      container.querySelectorAll('.OwnedBy.FileAttributeGroup .FileGridHeader__file-attribute-value')[0].innerHTML
    ).toMatch(new RegExp(`.*${fileMock.createdBy?.name?.givenName} ${fileMock.createdBy?.name?.familyName}`))
    expect(
      container.querySelectorAll('.FileSharing.FileAttributeGroup .FileGridHeader__file-attribute-value')[0].innerHTML
    ).toBe(`${fileMock.internalAccessCount} Internal, ${fileMock.externalAccessCount} External`)
    expect(
      container.querySelectorAll('.File__created.FileAttributeGroup .FileGridHeader__file-attribute-value time')[0]
        .innerHTML
    ).toBe(moment(fileMock.createdAt * 1000).format(TIME_DISPLAY_FORMAT.DATE_FORMAT))
    expect(
      container.querySelectorAll('.File__modified.FileAttributeGroup .FileGridHeader__file-attribute-value time')[0]
        .innerHTML
    ).toBe(moment(fileMock.lastModified * 1000).format(TIME_DISPLAY_FORMAT.DATE_FORMAT))
  })
})
