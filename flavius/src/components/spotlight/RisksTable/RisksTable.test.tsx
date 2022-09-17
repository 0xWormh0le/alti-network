import React from 'react'
import { act, RenderResult } from '@testing-library/react'

import RisksTable, { RisksTableProps } from './RisksTable'
import { GENERAL_URLS } from 'api/endpoints'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    domains: ['email.com'],
    location: { search: '' }
  }) // mock history, location
}))

const props: RisksTableProps = {
  queryParams: { personId: 'michael@altitudenetworks.com' },
  exportUrl: `${GENERAL_URLS.RISKS}?person-id=michael@altitudenetworks.com`
}

describe('RisksTable', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    await act(async () => {
      renderResult = renderWithRouter(<RisksTable {...props} />)
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
