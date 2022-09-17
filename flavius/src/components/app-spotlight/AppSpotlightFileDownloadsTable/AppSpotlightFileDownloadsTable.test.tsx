import React from 'react'
import { act, RenderResult } from '@testing-library/react'

import AppSpotlightFileDownloadsTable, { AppSpotlightFileDownloadsTableProps } from './AppSpotlightFileDownloadsTable'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    domains: ['email.com'],
    location: { search: '' }
  }) // mock history, location
}))

const props: AppSpotlightFileDownloadsTableProps = {
  applicationId: '19570130570',
  platformId: 'gsuite',
  eventType: 'download'
}

describe('EventsTable', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    await act(async () => {
      renderResult = renderWithRouter(<AppSpotlightFileDownloadsTable {...props} />)
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
