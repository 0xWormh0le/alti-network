import React from 'react'
import { act, RenderResult } from '@testing-library/react'

import AppSpotlightAssociatedRisksTable, {
  AppSpotlightAssociatedRisksTableProps
} from './AppSpotlightAssociatedRisksTable'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    domains: ['email.com'],
    location: { search: '' }
  }) // mock history, location
}))

const props: AppSpotlightAssociatedRisksTableProps = {
  applicationId: '19570130570',
  platformId: 'gsuite'
}

describe('EventsTable', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    await act(async () => {
      renderResult = renderWithRouter(<AppSpotlightAssociatedRisksTable {...props} />)
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
