import React from 'react'
import { act, RenderResult } from '@testing-library/react'

import AppSpotlightAuthorizedByTable, { AppSpotlightAuthorizedByTableProps } from './AppSpotlightAuthorizedByTable'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    domains: ['email.com'],
    location: { search: '' }
  }) // mock history, location
}))

const props: AppSpotlightAuthorizedByTableProps = {
  applicationId: '19570130570',
  platformId: 'gsuite'
}

describe('EventsTable', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    await act(async () => {
      renderResult = renderWithRouter(<AppSpotlightAuthorizedByTable {...props} />)
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
