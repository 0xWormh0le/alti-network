import React from 'react'
import { waitForElement } from '@testing-library/react'

import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'
import { DashboardCard } from '../DashboardCards'
import { DashboardGrid, DashboardGridProps } from './DashboardGrid'

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

const riskTypes: RiskTypeSummary[] = [
  { count: 10, severity: 5, riskTypeId: 0 },
  { count: 8, severity: 5, riskTypeId: 10 },
  { count: 4, severity: 5, riskTypeId: 1011 },
  { count: 482, severity: 7, riskTypeId: 1020 },
  { count: 1, severity: 8, riskTypeId: 1050 },
  { count: 6, severity: 6, riskTypeId: 2000 },
  { count: 3, severity: 6, riskTypeId: 2010 },
  { count: 2, severity: 6, riskTypeId: 3100 }
]

describe('DashboardGrid', () => {
  it('renders correctly', async () => {
    const props: DashboardGridProps = {
      cards,
      riskTypes,
      selectedCardGroupType: 1,
      onCardClick: noop
    }
    const { container, getByLabelText } = renderWithRouter(<DashboardGrid {...props} />)
    const showAllRisksButton = await waitForElement(() => getByLabelText('show all risks'))
    expect(container).toMatchSnapshot()
    expect(showAllRisksButton).toHaveTextContent('Show All Sharing Risks')
  })

  it('shows button label for the selected group type correctly', async () => {
    const props: DashboardGridProps = {
      cards,
      riskTypes,
      selectedCardGroupType: 3,
      onCardClick: noop
    }
    const { getByLabelText } = renderWithRouter(<DashboardGrid {...props} />)
    const showAllRisksButton = await waitForElement(() => getByLabelText('show all risks'))
    expect(showAllRisksButton).toHaveTextContent('Show All Activity Risks')
  })

  it('shows `Show All Risks` if invalid gruopType is passed', async () => {
    const props: DashboardGridProps = {
      cards,
      riskTypes,
      selectedCardGroupType: 5,
      onCardClick: noop
    }
    const { getByLabelText } = renderWithRouter(<DashboardGrid {...props} />)
    const showAllRisksButton = await waitForElement(() => getByLabelText('show all risks'))
    expect(showAllRisksButton).toHaveTextContent('Show All Risks')
  })
})
