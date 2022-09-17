import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'
import { SpotlightGridNav, SpotlightGridNavProps, checkPendingRemoveAccessStatus } from './SpotlightGridNav'
import INITIAL_TABS from '../Tabs'
import moment from 'moment'

describe('SpotlightGridNav', () => {
  it('renders correctly', () => {
    const props: SpotlightGridNavProps = {
      subNavTabs: INITIAL_TABS,
      selectedSubNavKey: INITIAL_TABS[0].seriesKey,
      onSubNavClick: noop,
      onRemoveAccessClick: noop,
      subNavLoaded: true,
      personInfo: [],
      selectedEmail: '',
      removedAccessCards: []
    }
    const { container } = renderWithRouter(<SpotlightGridNav {...props} />)
    expect(container).toMatchSnapshot()
  })
})

describe('Check Pending Removing Access status', () => {
  it('should be false in 24 hrs range', () => {
    const lastRemovedPermissions = moment().subtract(12, 'hours').unix()
    expect(checkPendingRemoveAccessStatus(lastRemovedPermissions)).toBe(false)
  })

  it('should be true after 24 hrs', () => {
    const lastRemovedPermissions = moment().subtract(25, 'hours').unix()
    expect(checkPendingRemoveAccessStatus(lastRemovedPermissions)).toBe(true)
  })
})
