import React from 'react'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from 'test/support/helpers'
import { GENERAL_URLS } from 'api/endpoints'
import { when } from 'jest-when'
import Dashboard from './Dashboard'
import { act } from 'react-dom/test-utils'
import { RenderResult, waitForElement } from '@testing-library/react'
import { statsData, tilesData, dashviewStats } from 'test/mocks'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

interface ICustomWindow extends Window {
  ResizeObserver?: any
}
const customWindow: ICustomWindow = window

describe('Dashboard', () => {
  beforeEach(async () => {
    // Setup ResizeObserver and offset* properties
    // see: https://github.com/wbkd/react-flow/issues/716
    customWindow.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn()
    }))

    Object.defineProperties(window.HTMLElement.prototype, {
      offsetHeight: {
        get() {
          return parseFloat(this.style.height) || 1
        }
      },
      offsetWidth: {
        get() {
          return parseFloat(this.style.width) || 1
        }
      }
    })
    ;(window.SVGElement as any).prototype.getBBox = () => ({ x: 0, y: 0, width: 0, height: 0 })

    const apiGet: any = API.get
    const categories = ['highestRiskFile', 'mostAtRiskFilesOwned', 'mostExternalAccess', 'mostRisksCreated']
    categories.forEach((category) => {
      when<any, string[]>(apiGet)
        .calledWith('risks', `${GENERAL_URLS.RISKS}/tiles?category=${category}`)
        .mockResolvedValue(tilesData[category])
    })

    when<any, string[]>(apiGet).calledWith('risks', `${GENERAL_URLS.RISKS}/stats`).mockResolvedValue(statsData)
    when<any, string[]>(apiGet)
      .calledWith('dashview_stats', `${GENERAL_URLS.DASHVIEW_STATS}`)
      .mockResolvedValue(dashviewStats)

    await act(async () => {
      renderResult = renderWithRouter(<Dashboard />)
      await new Promise((r) => setTimeout(r, 200))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('> Risk Insights has elements', async () => {
    const { getByText } = renderResult
    expect(getByText(/Creator of Most Risks/i)).toBeInTheDocument()
    expect(getByText(/File with Most Risks/i)).toBeInTheDocument()
    expect(getByText(/Owner of Most At-Risk Files/i)).toBeInTheDocument()
    expect(getByText(/External Account with Most File Access/i)).toBeInTheDocument()

    expect(getByText(/risks created/i)).toBeInTheDocument()
    expect(getByText(/risks associated/i)).toBeInTheDocument()
    expect(getByText(/at-risk files owned/i)).toBeInTheDocument()
    expect(getByText(/files accessible by external account/i)).toBeInTheDocument()
  })

  it('> Risk Summary has elements', async () => {
    const { getByText } = renderResult
    expect(getByText(/Relationship Risks/i)).toBeInTheDocument()
    expect(getByText(/Activity Risks/i)).toBeInTheDocument()
    expect(getByText(/Informational Risks/i)).toBeInTheDocument()
  })

  it('> Risk table header text', async () => {
    const { getByText } = renderResult
    expect(getByText(/RISK SEVERITY/i)).toBeInTheDocument()
    expect(getByText(/RISK TYPE/i)).toBeInTheDocument()
    expect(getByText(/RISK COUNT/i)).toBeInTheDocument()
  })

  describe('page font size', () => {
    it('matches', async () => {
      const { getByText } = renderResult
      const headerEl = getByText(/Dashboard/i)
      const riskInsightsEl = getByText(/Risk Insights/i)
      const riskSummaryEl = getByText(/Risk Summary/i)
      const creatorRisksEl = getByText(/Creator of Most Risks/i)
      const fileRisksEl = getByText(/File with Most Risks/i)
      const ownerFilesEl = getByText(/Owner of Most At-Risk Files/i)
      const externalAccountEl = getByText(/External Account with Most File Access/i)
      const risksCreatedEl = getByText(/risks created/i)
      const risksAssociatedEl = getByText(/risks associated/i)
      const filesOwnedEl = getByText(/at-risk files owned/i)
      const filesAccessibleEl = getByText(/files accessible by external account/i)
      const relationshipRisksEl = getByText(/Relationship Risks/i)
      const activityRisksEl = getByText(/Activity Risks/i)
      const informationalRisksEl = getByText(/Informational Risks/i)
      const RISKSEVERITYEl = getByText(/RISK SEVERITY/i)
      const RISKTYPEEl = getByText(/RISK TYPE/i)
      const RISKCOUNTEl = getByText(/RISK COUNT/i)

      const fontSize = {
        header: parseInt(window.getComputedStyle(headerEl).fontSize, 10),
        riskInsights: parseInt(window.getComputedStyle(riskInsightsEl).fontSize, 10),
        riskSummary: parseInt(window.getComputedStyle(riskSummaryEl).fontSize, 10),
        creatorRisks: parseInt(window.getComputedStyle(creatorRisksEl).fontSize, 10),
        fileRisks: parseInt(window.getComputedStyle(fileRisksEl).fontSize, 10),
        ownerFiles: parseInt(window.getComputedStyle(ownerFilesEl).fontSize, 10),
        externalAccount: parseInt(window.getComputedStyle(externalAccountEl).fontSize, 10),
        risksCreated: parseInt(window.getComputedStyle(risksCreatedEl).fontSize, 10),
        risksAssociated: parseInt(window.getComputedStyle(risksAssociatedEl).fontSize, 10),
        filesOwned: parseInt(window.getComputedStyle(filesOwnedEl).fontSize, 10),
        filesAccessible: parseInt(window.getComputedStyle(filesAccessibleEl).fontSize, 10),
        relationshipRisks: parseInt(window.getComputedStyle(relationshipRisksEl).fontSize, 10),
        activityRisks: parseInt(window.getComputedStyle(activityRisksEl).fontSize, 10),
        informationalRisks: parseInt(window.getComputedStyle(informationalRisksEl).fontSize, 10),
        RISKSEVERITY: parseInt(window.getComputedStyle(RISKSEVERITYEl).fontSize, 10),
        RISKTYPE: parseInt(window.getComputedStyle(RISKTYPEEl).fontSize, 10),
        RISKCOUNT: parseInt(window.getComputedStyle(RISKCOUNTEl).fontSize, 10)
      }

      expect(headerEl).toBeInTheDocument()
      expect(riskInsightsEl).toBeInTheDocument()
      expect(riskSummaryEl).toBeInTheDocument()
      expect(fontSize.header).toBeGreaterThan(fontSize.riskInsights)
      expect(fontSize.header).toBeGreaterThan(fontSize.riskSummary)

      expect(creatorRisksEl).toBeInTheDocument()
      expect(creatorRisksEl).toHaveClass('DashboardRiskTile__title')

      expect(fileRisksEl).toBeInTheDocument()
      expect(fileRisksEl).toHaveClass('DashboardRiskTile__title')

      expect(ownerFilesEl).toBeInTheDocument()
      expect(ownerFilesEl).toHaveClass('DashboardRiskTile__title')

      expect(externalAccountEl).toBeInTheDocument()
      expect(externalAccountEl).toHaveClass('DashboardRiskTile__title')

      expect(risksCreatedEl).toBeInTheDocument()
      expect(risksCreatedEl).toHaveClass('DashboardRiskTile__label')

      expect(risksAssociatedEl).toBeInTheDocument()
      expect(risksAssociatedEl).toHaveClass('DashboardRiskTile__label')

      expect(filesOwnedEl).toBeInTheDocument()
      expect(filesOwnedEl).toHaveClass('DashboardRiskTile__label')

      expect(filesAccessibleEl).toBeInTheDocument()
      expect(filesAccessibleEl).toHaveClass('DashboardRiskTile__label')

      expect(relationshipRisksEl).toBeInTheDocument()
      expect(relationshipRisksEl).toHaveClass('DashboardCards__card-label')

      expect(activityRisksEl).toBeInTheDocument()
      expect(activityRisksEl).toHaveClass('DashboardCards__card-label')

      expect(informationalRisksEl).toBeInTheDocument()
      expect(informationalRisksEl).toHaveClass('DashboardCards__card-label')

      expect(RISKSEVERITYEl).toBeInTheDocument()
      expect(RISKSEVERITYEl).toHaveClass('RiskTypesList--severity-column')

      expect(RISKTYPEEl).toBeInTheDocument()
      expect(RISKTYPEEl).toHaveClass('RiskTypesList--type-column')

      expect(RISKCOUNTEl).toBeInTheDocument()
      expect(RISKCOUNTEl).toHaveClass('RiskTypesList--count-column')
    })
  })

  describe('check page classes are matched with text content', () => {
    it('check header title', async () => {
      const { container } = renderWithRouter(<Dashboard />)

      const dashboardEl = await waitForElement(() => container.querySelectorAll('.PageTitle')[0])

      expect(dashboardEl).toHaveClass('Typography')
      expect(dashboardEl).toHaveTextContent('Dashboard')

      const riskInsightsEl = await waitForElement(() => container.querySelectorAll('.SectionTitle')[1])

      expect(riskInsightsEl).toHaveClass('Typography')
      expect(riskInsightsEl).toHaveTextContent('Risk Insights')

      const riskSummary = await waitForElement(() => container.querySelectorAll('.SectionTitle')[1])

      expect(riskSummary).toHaveClass('Typography')
      expect(riskSummary).toHaveTextContent('Risk Insights')
    })

    it('check risk title', async () => {
      const { container } = renderWithRouter(<Dashboard />)

      const creatorRisksEl = await waitForElement(() => container.querySelectorAll('.DashboardRiskTile__title')[0])

      expect(creatorRisksEl).toHaveClass('Typography')
      expect(creatorRisksEl).toHaveTextContent('Creator of Most Risks')

      const fileRisksEl = await waitForElement(() => container.querySelectorAll('.DashboardRiskTile__title')[1])

      expect(fileRisksEl).toHaveClass('Typography')
      expect(fileRisksEl).toHaveTextContent('File with Most Risks')

      const externalAccountEl = await waitForElement(() => container.querySelectorAll('.DashboardRiskTile__title')[2])

      expect(externalAccountEl).toHaveClass('Typography')
      expect(externalAccountEl).toHaveTextContent('Owner of Most At-Risk Files')

      const ownerFilesEl = await waitForElement(() => container.querySelectorAll('.DashboardRiskTile__title')[3])

      expect(ownerFilesEl).toHaveClass('Typography')
      expect(ownerFilesEl).toHaveTextContent('External Account with Most File Access')
    })
  })

  describe('Buttons', () => {
    let getAllByText: (...args: any[]) => any

    beforeEach(() => {
      getAllByText = renderResult.getAllByText
    })

    it('clicking "Show all risks" button redirects to Top Risks page', async () => {
      const showAllRisksButton = await waitForElement(() => getAllByText('Show All Sharing Risks')[0])
      const anchor = showAllRisksButton.parentElement

      expect(anchor).toHaveClass('NavButton')
      expect(anchor.getAttribute('href')).toEqual(expect.stringContaining('/risks?riskTypeIds='))
    })

    it('clicking the first "See all" button redirects to Top Risks page with filters applied', async () => {
      const firstSeeAllButton = await waitForElement(() => getAllByText('See all')[0])
      const anchor = firstSeeAllButton.parentElement

      expect(anchor).toHaveClass('NavButton')
      expect(anchor.getAttribute('href')).toEqual(expect.stringContaining('/risks?riskTypeIds='))
    })
  })
})
