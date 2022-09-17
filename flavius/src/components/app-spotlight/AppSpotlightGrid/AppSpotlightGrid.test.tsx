import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightGrid, { AppSpotlightGridProps } from './AppSpotlightGrid'
import { navTabs } from '../AppSpotlightContainer/AppSpotlightContainer'
import noop from 'lodash/noop'

import { application as app } from 'test/mocks'
import { applicationStat as stats } from 'test/mocks'

describe('AppSpotlightGrid', () => {
  it('renders correctly', () => {
    const props: AppSpotlightGridProps = {
      appId: '',
      app,
      loading: false,
      wrapperType: 'modal' as WrapperTypeOptions,
      navTabs,
      selectedTab: 'authorizedBy' as AppSpotlightSubNavType,
      statsLoading: false,
      onSubNavClick: noop,
      stats,
      platformId: 'gsuite'
    }
    const { container } = renderWithRouter(<AppSpotlightGrid {...props} />)
    expect(container).toMatchSnapshot()
  })
})
