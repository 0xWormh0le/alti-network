import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import { DashboardCard, DashboardCards } from './DashboardCards'

const cards: DashboardCard[] = [
  {
    label: 'Sharing Risks',
    value: 0,
    groupType: 1 // risks with riskTypeId in the range 1XXX
  },
  {
    label: 'Relationship Risks',
    value: 0,
    groupType: 2 // risks with riskTypeId in the range 2XXX
  },
  {
    label: 'Activity Risks',
    value: 0,
    groupType: 3 // risks with riskTypeId in the range 3XXX
  },
  {
    label: 'Informational Risks',
    value: 0,
    groupType: 0 // risks with riskTypeId in the range 0XXX
  }
]

describe('DashboardCards', () => {
  it('renders correctly', () => {
    const props = {
      cards,
      selectedCardGroupType: 1,
      onCardClick: noop
    }
    const { container } = render(<DashboardCards {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders skeleton loader correctly', () => {
    const props = {
      cards,
      selectedCardGroupType: 1,
      onCardClick: noop,
      loading: true
    }
    const { container } = render(<DashboardCards {...props} />)
    expect(container).toMatchSnapshot()
  })
})
