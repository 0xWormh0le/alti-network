import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { RiskTypesList, RiskTypesListProps } from './RiskTypesList'

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

describe('RiskTypesList', () => {
  it('renders correctly', () => {
    const props: RiskTypesListProps = {
      riskTypes,
      categoryLabel: 'Sharing Risks'
    }
    const { container } = renderWithRouter(<RiskTypesList {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders loading skeletons correctly', () => {
    const props: RiskTypesListProps = {
      riskTypes,
      loading: true,
      categoryLabel: 'Sharing Risks'
    }
    const { container } = renderWithRouter(<RiskTypesList {...props} />)
    expect(container).toMatchSnapshot()
  })
})
