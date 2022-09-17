import React from 'react'

import { Button } from 'components/elements/Button/Button'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import appPlaceholderIcon from 'icons/appplaceholder.svg'
import ContentLoader from 'react-content-loader'
import UI_STRINGS from 'util/ui-strings'
import { renderAttributeIfDev } from 'util/helpers'
import './AppSpotlightAppImage.scss'

export interface AppSpotlightAppImageProps {
  appImageURI: string
  appTitle: string
  appMarketplaceURI: string
  loading: boolean
}

export const AppSpotlightAppImage: React.FC<AppSpotlightAppImageProps> = (props) => {
  const { appTitle, appMarketplaceURI, appImageURI, loading } = props
  return (
    <div className='AppSpotlightAppImage'>
      <div className='AppSpotlightAppImage__wrapper'>
        {loading ? (
          <ContentLoader
            backgroundColor='#F0F0F0'
            foregroundColor='#F7F7F7'
            height={72}
            width={72}
            uniqueKey='AppSpotlightAppImage__wrapper'>
            <rect x={0} y={0} width={72} height={72} rx={4} ry={4} />
          </ContentLoader>
        ) : (
          <img alt={appTitle} src={appImageURI || appPlaceholderIcon} />
        )}
      </div>
      <div className='AppSpotlightAppImage__title'>
        {loading ? (
          <ContentLoader
            backgroundColor='#F0F0F0'
            foregroundColor='#F7F7F7'
            height={23}
            width={200}
            uniqueKey='AppSpotlightAppImage__title'>
            <rect x={20} y={0} width={160} height={23} rx={4} ry={4} />
          </ContentLoader>
        ) : (
          <Typography
            variant={TypographyVariant.H3}
            weight='normal'
            className='AppSpotlightHeader__title-name'
            {...renderAttributeIfDev({ 'data-testid': 'apptitle' })}>
            {appTitle || 'Unknown App'}
          </Typography>
        )}
      </div>
      <div className='AppSpotlightAppImage__marketplace'>
        {loading ? (
          <ContentLoader
            backgroundColor='#F0F0F0'
            foregroundColor='#F7F7F7'
            height={36}
            width={200}
            uniqueKey='AppSpotlightAppImage__marketplace'>
            <rect x={20} y={0} width={160} height={36} rx={4} ry={4} />
          </ContentLoader>
        ) : appMarketplaceURI ? (
          <a href={appMarketplaceURI || ''} rel='noopener noreferrer' target='_blank'>
            <Button
              action='secondary'
              text={UI_STRINGS.APPSPOTLIGHT.VIEW_IN_GSUITE}
              loadingText=''
              className='AppSpotlightAppImage__marketplace--url'
            />
          </a>
        ) : (
          <Typography
            variant={TypographyVariant.BODY_SMALL}
            weight='normal'
            className='AppSpotlightAppImage__fallback-marketplace-link'>
            {UI_STRINGS.APPSPOTLIGHT.NOT_AVAILABLE_ON}
            <br />
            {UI_STRINGS.APPSPOTLIGHT.GSUITE_MARKET}
          </Typography>
        )}
      </div>
    </div>
  )
}

export default AppSpotlightAppImage
