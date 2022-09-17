import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import DashboardRiskGraph from './DashboardRiskGraph'
import API from '@aws-amplify/api/lib'
import { dashboardGsuiteData, dashboardGsuiteDataZeros, dashboardNoData } from 'test/mocks'
import { act } from 'react-dom/test-utils'

jest.mock('@aws-amplify/api/lib')
interface ICustomWindow extends Window {
  ResizeObserver?: any
}
const customWindow: ICustomWindow = window

describe('Dashboard Unit Tests', () => {
  const apiGet: any = API.get
  beforeEach(() => {
    customWindow.ResizeObserver = jest.fn().mockImplementation(() => ({
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn()
    }))
  })

  it('Dashboard node 1 renders GSuite value 9', async () => {
    apiGet.mockResolvedValue(dashboardGsuiteData)
    const { container } = renderWithRouter(<DashboardRiskGraph />)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100))
      const div = container
        .querySelector('[data-id="node-user-accounts"]')
        ?.querySelector('.stat')
        ?.getElementsByTagName('div')[0]
      expect(div).toContainHTML('<div>9</div>')
    })
  })
  it('Dashboard node 2 renders a dash when null', async () => {
    apiGet.mockResolvedValue(dashboardGsuiteData)
    const { container } = renderWithRouter(<DashboardRiskGraph />)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100))
      const div = container
        .querySelector('[data-id="node-apps"]')
        ?.querySelector('.stat')
        ?.getElementsByTagName('div')[0]
      expect(div).toContainHTML('<div>-</div>')
    })
  })
  it('Displays "No results found" as all values are 0', async () => {
    apiGet.mockResolvedValue(dashboardGsuiteDataZeros)
    const { container } = renderWithRouter(<DashboardRiskGraph />)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100))
      const div = container.querySelector('.ErrorBox__main-message')
      expect(div).toHaveTextContent('No results found')
    })
  })
  it('Does not display graph as there is no data', async () => {
    apiGet.mockResolvedValue(dashboardNoData)
    const { container } = renderWithRouter(<DashboardRiskGraph />)
    await act(async () => {
      await new Promise((r) => setTimeout(r, 100))
      const div = container.querySelector('.ErrorBox__main-message')
      expect(div).toHaveTextContent('No results found')
    })
  })
})
