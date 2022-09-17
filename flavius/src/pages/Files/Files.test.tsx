import React from 'react'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from 'test/support/helpers'
import Files from './Files'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'
import { risksData } from 'test/mocks'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

describe('Files', () => {
  beforeEach(async () => {
    const apiGet: any = API.get

    apiGet.mockResolvedValue(risksData)

    await act(async () => {
      const props: any = {
        match: {
          path: '/risks/files/:riskId',
          url: '/risks/files/9be1f616c26c92be69dfdcaa981d543f9f8f19da',
          isExact: true,
          params: { riskId: '9be1f616c26c92be69dfdcaa981d543f9f8f19da' }
        },
        location: {
          pathname: '/risks/files/9be1f616c26c92be69dfdcaa981d543f9f8f19da'
        },
        history: {}
      }
      renderResult = renderWithRouter(<Files {...props} />)
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
