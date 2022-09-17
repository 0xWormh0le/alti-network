import React from 'react'
import { waitForElement } from '@testing-library/react'
import API from '@aws-amplify/api/lib'

import { sensitivePhrasesResponseMock } from 'test/mocks'
import { SensitivePhrases, checkDuplicates } from './SensitivePhrases'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('@aws-amplify/api/lib')

describe('SensitivePhrases', () => {
  beforeEach(() => {
    // Mocking server response, to return an empty array
    const apiGet: any = API.get
    apiGet.mockResolvedValue(sensitivePhrasesResponseMock)
  })

  it('renders correctly', async () => {
    const { container } = renderWithRouter(<SensitivePhrases />, {
      route: '/risk-settings',
      mountRoute: '/risk-settings'
    })
    await waitForElement(() => container.querySelectorAll('tr').length)
    expect(container).toMatchSnapshot()
  })
})

describe('checkDuplicates', () => {
  it('returns true if both phrase and exact fields are the same', () => {
    expect(
      checkDuplicates(sensitivePhrasesResponseMock.sensitivePhrases, sensitivePhrasesResponseMock.sensitivePhrases[0])
    ).toBe(true)
  })

  it('returns true if phrase fields match and exact fields do not match', () => {
    const sensitivePhrase = {
      phrase: sensitivePhrasesResponseMock.sensitivePhrases[0].phrase,
      exact: !sensitivePhrasesResponseMock.sensitivePhrases[0].exact
    }
    expect(checkDuplicates(sensitivePhrasesResponseMock.sensitivePhrases, sensitivePhrase)).toBe(true)
  })

  it('returns false if phrase fields do not match', () => {
    const sensitivePhrase1 = {
      phrase: 'test-not-match',
      exact: true
    }
    const sensitivePhrase2 = {
      phrase: 'test-not-match',
      exact: false
    }
    expect(checkDuplicates(sensitivePhrasesResponseMock.sensitivePhrases, sensitivePhrase1)).toBe(false)
    expect(checkDuplicates(sensitivePhrasesResponseMock.sensitivePhrases, sensitivePhrase2)).toBe(false)
  })
})
