import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightContainer, { AppSpotlightContainerProps } from './AppSpotlightContainer'

describe('AppSpotlightContainer', () => {
  it('renders correctly', () => {
    const props: AppSpotlightContainerProps = {
      platformId: 'gsuite',
      wrapperType: 'page',
      applicationId: 'application-id'
    }

    const { container } = renderWithRouter(<AppSpotlightContainer {...props} />)
    expect(container).toMatchSnapshot()
  })
})
