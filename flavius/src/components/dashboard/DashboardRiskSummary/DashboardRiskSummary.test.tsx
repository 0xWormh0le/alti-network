import React from 'react'
import { fireEvent, waitForElement } from '@testing-library/react'
import { renderWithRouter } from 'test/support/helpers'
import API from '@aws-amplify/api/lib'
import DashboardRiskSummary from './DashboardRiskSummary'

jest.mock('@aws-amplify/api/lib')

beforeEach(() => {
  const apiGet: any = API.get
  apiGet.mockResolvedValue({
    stats: [
      { riskTypeId: 0, count: 22, severity: 5 as SeverityRange },
      { riskTypeId: 10, count: 4, severity: 5 as SeverityRange },

      { riskTypeId: 1011, count: 3, severity: 5 as SeverityRange },
      { riskTypeId: 1020, count: 27, severity: 8 as SeverityRange },
      { riskTypeId: 1021, count: 5, severity: 9 as SeverityRange },

      { riskTypeId: 2000, count: 15, severity: 6 as SeverityRange },
      { riskTypeId: 2001, count: 9, severity: 9 as SeverityRange },
      { riskTypeId: 2010, count: 5, severity: 9 as SeverityRange },
      { riskTypeId: 2011, count: 30, severity: 9 as SeverityRange },

      { riskTypeId: 3100, count: 73, severity: 6 as SeverityRange }
    ]
  })
})

describe('General rendering', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<DashboardRiskSummary />)
    expect(container).toMatchSnapshot()
  })
  it('renders cards, preview table and "Show all risks" button', async () => {
    const { getByText, getByLabelText } = renderWithRouter(<DashboardRiskSummary />)

    const sharingRisksCard = await waitForElement(() => getByText('Sharing Risks'))

    // cards
    expect(sharingRisksCard).toBeInTheDocument()
    expect(getByText('Relationship Risks')).toBeInTheDocument()
    expect(getByText('Activity Risks')).toBeInTheDocument()
    expect(getByText('Informational Risks')).toBeInTheDocument()

    // table
    expect(getByText('Risk severity')).toBeInTheDocument()
    expect(getByText('Risk count')).toBeInTheDocument()

    // show all risks button
    expect(getByLabelText('show all risks')).toBeInTheDocument()
  })
})

describe('Buttons', () => {
  let getAllByText: (...args: any[]) => any
  let getByLabelText: (...args: any[]) => any
  let getByText: (...args: any[]) => any

  beforeEach(() => {
    const renderResult = renderWithRouter(<DashboardRiskSummary />)
    getByLabelText = renderResult.getByLabelText
    getAllByText = renderResult.getAllByText
    getByText = renderResult.getByText
  })

  it('clicking "Show all risks" button redirects to Top Risks page', async () => {
    const showAllRisksButton = await waitForElement(() => getByLabelText('show all risks'))
    const anchor = showAllRisksButton.parentElement

    expect(anchor.getAttribute('href')).toBe('/risks?riskTypeIds=[1021,1020,1011]')
  })

  it('clicking the first "See all" button redirects to Top Risks page with filters applied', async () => {
    const firstSeeAllButton = await waitForElement(() => getAllByText('See all')[0])
    const anchor = firstSeeAllButton.parentElement

    expect(anchor.getAttribute('href')).toBe('/risks?riskTypeIds=[1021]')
  })

  it('shows label for show `all risks button` with correct category name when active card is changed', async () => {
    const showAllRisksButton = await waitForElement(() => getByLabelText('show all risks'))
    expect(showAllRisksButton).toHaveTextContent('Show All Sharing Risks')
    getByText('Relationship Risks').click()
    expect(showAllRisksButton).toHaveTextContent('Show All Relationship Risks')
    getByText('Activity Risks').click()
    expect(showAllRisksButton).toHaveTextContent('Show All Activity Risks')
    getByText('Informational Risks').click()
    expect(showAllRisksButton).toHaveTextContent('Show All Informational Risks')
  })
})

describe('Cards', () => {
  it('another cards gets selected when clicked', async () => {
    const { getByText, container } = renderWithRouter(<DashboardRiskSummary />)

    const generalRisksCard = await waitForElement(() => getByText('Informational Risks'))
    fireEvent.click(generalRisksCard)

    // check that the 4th card is now selected
    expect(container.querySelectorAll('.DashboardCards__card')[3]).toHaveClass('DashboardCards__card--active')
  })
})
