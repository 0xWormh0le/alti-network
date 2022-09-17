import React from 'react'
import TooltipIp, { getLocationInfo, IGeoLocation, storeIpAddressDetails, getIpAddressDetails } from './TooltipIp'
import { waitFor, waitForElement, render, fireEvent, act } from '@testing-library/react'
import { UI_STRINGS } from 'util/ui-strings'
import { badIpData, goodIpData, ipNoMap } from 'test/mocks'

const mockFetch = jest.fn()
window.fetch = mockFetch

describe('TableHeadingCell', () => {
  beforeAll(() => jest.spyOn(window, 'fetch'))
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const staticIP = '75.187.232.222'
  let fetchedData: IGeoLocation

  it('renders correctly', () => {
    const props = {
      ipAddress: staticIP
    }
    const { container } = render(<TooltipIp {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('Should get IP API info from API fetch', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => goodIpData
    })
    fetchedData = await getLocationInfo(staticIP)
    expect(fetchedData.stateProv).toBe('Ohio')
  })

  it('Should store data into local storage', () => {
    storeIpAddressDetails(staticIP, fetchedData)
    expect(getIpAddressDetails(staticIP)!.city).toBe('Willard')
  })

  it('shows error message for malformed or unknown ip', async () => {
    jest.fn().mockImplementationOnce(() => Promise.reject(badIpData))

    const props = {
      ipAddress: '0.0.0'
    }
    const { getByTestId } = render(<TooltipIp {...props} />)
    await act(async () => {
      const ipLabelItem = await waitFor(() => getByTestId('ipaddress'))
      fireEvent.mouseOver(ipLabelItem)
      const element = await waitForElement(() => getByTestId('errorMessage'))
      expect(element).toHaveTextContent(UI_STRINGS.TOOLTIP_IP.LOCATION_ERROR)
    })
  })

  it('shows error message for bad longitude and latitude coordinates', async () => {
    const asyncMock = mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ipNoMap
    })

    const props = {
      ipAddress: '25.100.100.10'
    }
    const { getByTestId } = render(<TooltipIp {...props} />)
    await asyncMock
    const ipLabelItem = await waitFor(() => getByTestId('ipaddress'))

    await act(async () => {
      fireEvent.mouseOver(ipLabelItem)
      const element = await waitForElement(() => getByTestId('coordsError'))
      expect(element).toHaveTextContent(UI_STRINGS.TOOLTIP_IP.MAP_COORDINATES_ERROR)
    })
    asyncMock.mockClear()
  })

  it('shows Willard, Ohio, United States for ip location', async () => {
    const asyncMock = mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => goodIpData
    })

    const props = {
      ipAddress: staticIP
    }
    await asyncMock
    const { getByTestId } = render(<TooltipIp {...props} />)
    const ipLabelItem = await waitFor(() => getByTestId('ipaddress'))
    await act(async () => {
      fireEvent.mouseOver(ipLabelItem)
      const element = await waitFor(() => getByTestId('formattedLocation'))
      expect(element).toHaveTextContent('Willard, Ohio, United States')
      await act(async () => {
        fireEvent.mouseOut(ipLabelItem)
      })
    })
    asyncMock.mockClear()
  })

  it(`shows no ip error: ${UI_STRINGS.TOOLTIP_IP.NO_IP}`, async () => {
    await act(async () => {
      const { getByTestId } = render(<TooltipIp />)
      const element = await waitFor(() => getByTestId('ipaddress'))
      expect(element).toHaveTextContent(UI_STRINGS.TOOLTIP_IP.NO_IP)
    })
  })

  it(`shows ${UI_STRINGS.TOOLTIP_IP.LOCATION_ERROR}`, async () => {
    const { getByTestId } = render(<TooltipIp />)
    const ipLabelItem = await waitFor(() => getByTestId('ipaddress'))
    await act(async () => {
      expect(ipLabelItem).toHaveTextContent(UI_STRINGS.TOOLTIP_IP.NO_IP)
    })
  })

  it('shows error message hover for no IP', async () => {
    jest.fn().mockImplementationOnce(() => Promise.reject({ message: UI_STRINGS.TOOLTIP_IP.NO_IP_ERROR }))

    const { getByTestId } = render(<TooltipIp />)
    await act(async () => {
      const ipLabelItem = await waitFor(() => getByTestId('ipaddress'))
      fireEvent.mouseOver(ipLabelItem)
      const element = await waitForElement(() => getByTestId('errorMessage'))
      expect(element).toHaveTextContent(UI_STRINGS.TOOLTIP_IP.NO_IP_ERROR)
    })
  })
})
