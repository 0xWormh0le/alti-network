import React from 'react'

import AppSpotlightAppImage from '../AppSpotlightAppImage'
import { AppSpotlightGrantContainer } from '../AppSpotlightGrantContainer/AppSpotlightGrantContainer'
import UI_STRINGS from 'util/ui-strings'

import './AppSpotlightHeader.scss'

export interface AppSpotlightHeaderProps {
  loading: boolean
  app: Maybe<Application>
}

export const AppSpotlightHeader: React.FC<AppSpotlightHeaderProps> = ({ app, loading }) => {
  const innerApp = app
    ? app
    : {
        name: '',
        marketplaceURI: '',
        imageURI: '',
        id: ''
      }
  const { name, marketplaceURI, imageURI, id } = innerApp
  const marketplaceLink =
    parseInt(marketplaceURI, 10) === 1
      ? `https://gsuite.google.com/marketplace/app/${name.toLowerCase().split(' ').join('_')}/${id}`
      : ''
  const appTitle = name ? name : app && id ? `ID: ${id}` : UI_STRINGS.APPSPOTLIGHT.UNKNOWN
  return (
    <div className='AppSpotlightHeader'>
      <AppSpotlightAppImage
        appImageURI={imageURI}
        appTitle={appTitle}
        appMarketplaceURI={marketplaceLink}
        loading={loading}
      />
      <AppSpotlightGrantContainer app={app} loading={loading} />
    </div>
  )
}

export default AppSpotlightHeader
