import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import PhraseTable from './PhraseTable'
import { sensitivePhraseMock } from 'test/mocks'

jest.mock('@aws-amplify/api/lib')

describe('PhraseTable', () => {
  it('renders correctly', async () => {
    const { container } = render(<PhraseTable sensitivePhrases={sensitivePhraseMock} loading={false} onDelete={noop} />)
    expect(container).toMatchSnapshot()
    expect(container.querySelectorAll('tr').length - 1).toBe(sensitivePhraseMock.length)
  })

  it('renders content loader while loading', () => {
    const { container } = render(<PhraseTable sensitivePhrases={sensitivePhraseMock} loading={true} onDelete={noop} />)
    expect(container).toMatchSnapshot()
    expect(container.querySelector('.PhraseTableLoading')).toBeTruthy()
  })

  it('renders no results placeholder if empty sensitive phrases are passed', () => {
    const { container } = render(<PhraseTable sensitivePhrases={[]} loading={false} onDelete={noop} />)
    expect(container).toMatchSnapshot()
    expect(container.querySelector('.PhraseTable__no-results')).toBeTruthy()
    expect(container.querySelector('.PhraseTable__no-results')).toHaveTextContent('No Sensitive Phrases created.')
  })

  it('renders a placeholder with error message if hasError prop is set', () => {
    const { container } = render(<PhraseTable sensitivePhrases={[]} loading={false} onDelete={noop} hasError={true} />)
    expect(container).toMatchSnapshot()
    expect(container.querySelector('.ErrorBox')).toBeTruthy()
    expect(container.querySelector('.ErrorBox')).toHaveTextContent('Unable to retrieve Sensitive Phrases at this time.')
  })
})
