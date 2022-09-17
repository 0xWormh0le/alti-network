import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightAppImage, { AppSpotlightAppImageProps } from './AppSpotlightAppImage'
import UI_STRINGS from 'util/ui-strings'
import apiMock from 'api/apiMock'

describe('AppSpotlightAppImage', () => {
  it('renders correctly', async () => {
    const { id, name, imageURI } = (await apiMock.APIMock.getApplication()) as Application
    const props: AppSpotlightAppImageProps = {
      appImageURI: imageURI,
      appTitle: UI_STRINGS.APPSPOTLIGHT.UNKNOWN,
      appMarketplaceURI: `https://gsuite.google.com/marketplace/app/${name.toLowerCase().split(' ').join('_')}/${id}`,
      loading: false,
    }

    const { container } = renderWithRouter(<AppSpotlightAppImage {...props} />)
    expect(container).toMatchSnapshot()
  })
})
