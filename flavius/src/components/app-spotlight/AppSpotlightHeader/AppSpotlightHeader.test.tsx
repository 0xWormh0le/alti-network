import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightHeader from './AppSpotlightHeader'
import apiMock from 'api/apiMock'

describe('AppSpotlightHeader', () => {
  it('renders correctly', async () => {
    const app = (await apiMock.APIMock.getApplication()) as Application

    const { container } = renderWithRouter(<AppSpotlightHeader app={app} loading={false} />)

    expect(container).toMatchSnapshot()
  })
})
