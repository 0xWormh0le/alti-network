import React from 'react'
import { act } from 'react-dom/test-utils'
import { renderWithRouter } from 'test/support/helpers'

import { waitForElement } from '@testing-library/react'
import API from '@aws-amplify/api/lib'

import EditFilePermissionContainer, { EditFilePermissionContainerProps } from './EditFilePermissionContainer'
import { permissionsResponse, fileMock } from 'test/mocks'
import { RenderResult } from '@testing-library/react'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

const fileId = '1_AXAuCHCr8Zx1plVnW2xmQpbXoPdzKre'
const riskId = '39dfa55283318d31afe5a3ff4a0e3253e2045e43'

describe('EditFilePermissionContainer', () => {
  // when<any, any[]>(API.get as any)
  //   .calledWith('file')
  //   .mockResolvedValue(fileMock)
  // when<any, any[]>(API.get as any)
  //   .calledWith('file', {})
  //   .mockResolvedValue(permissionsResponse)

  beforeEach(async () => {
    API.get = jest.fn().mockImplementation((...args) => {
      const url: string = args[1]
      if (url.includes('permissions')) {
        return new Promise((resolve) => {
          resolve(permissionsResponse)
        })
      }
      return new Promise((resolve) => {
        resolve(fileMock)
      })
    })

    await act(async () => {
      const props: EditFilePermissionContainerProps = {
        fileId,
        riskId,
        platformId: 'gsuite'
      }
      renderResult = renderWithRouter(<EditFilePermissionContainer {...props} />)
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('should have 2 result rows', async () => {
    const { container } = renderResult

    const rows = await waitForElement(() => container.querySelectorAll('tr'))
    expect(rows).toHaveLength(3)
  })
})
