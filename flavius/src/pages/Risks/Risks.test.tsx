import React from 'react'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from 'test/support/helpers'
import Risks from './Risks'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'
import { risksResponse } from 'test/mocks'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

describe('Risks', () => {
  const mock = risksResponse
  beforeEach(async () => {
    // @ts-ignore
    API.get.mockResolvedValue(mock)

    await act(async () => {
      renderResult = renderWithRouter(<Risks />)
      await new Promise((r) => setTimeout(r, 200))
    })
  })

  it('renders correctly', async () => {
    // @ts-ignore
    API.get.mockResolvedValue(mock)
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has data items', async () => {
    // @ts-ignore
    API.get.mockResolvedValue(mock)
    const { container } = renderResult
    expect(container.querySelector('.Table__row')).toBeTruthy()
  })
})
