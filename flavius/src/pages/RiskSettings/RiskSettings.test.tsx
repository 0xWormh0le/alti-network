import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import RiskSettings from './RiskSettings'
import Auth from '@aws-amplify/auth'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'
import { sensitivePhrasesResponseMock } from 'test/mocks'
import { API } from 'aws-amplify'
import sortBy from 'lodash/sortBy'

jest.mock('@aws-amplify/auth')
jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

describe('RiskSettings', () => {
  beforeEach(async () => {
    const authUser: any = Auth.currentAuthenticatedUser
    const apiGet: any = API.get

    authUser.mockResolvedValue(true)
    apiGet.mockResolvedValue(sensitivePhrasesResponseMock)

    await act(async () => {
      renderResult = renderWithRouter(<RiskSettings />)
      await new Promise((r) => setTimeout(r, 1000))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has password elements', async () => {
    const { container } = renderResult
    const phrases = sortBy(
      sensitivePhrasesResponseMock.sensitivePhrases.filter((item) => item.exact),
      'phrase'
    )
    phrases.forEach((ph, i) => {
      expect(container.querySelectorAll('.Phrase')[i].textContent).toBe(ph.phrase)
    })
  })
})
