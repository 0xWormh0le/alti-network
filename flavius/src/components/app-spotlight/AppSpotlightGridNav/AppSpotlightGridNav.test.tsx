import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'
import AppSpotlightGridNav from './AppSpotlightGridNav'
import { navTabs } from '../AppSpotlightContainer/AppSpotlightContainer'
import apiMock from 'api/apiMock'

describe('AppSpotlightGridNav', () => {
  it('renders correctly', async () => {
    const appStats = await apiMock.APIMock.getApplicationStats()

    const { container } = renderWithRouter(
      <AppSpotlightGridNav appStats={appStats} subNavTab={navTabs[0]} loading={false} onSubNavClick={noop} />
    )

    expect(container).toMatchSnapshot()
  })
})
