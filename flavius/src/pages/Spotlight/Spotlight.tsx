import React from 'react'
import Actionbar from 'components/base/Actionbar'
import Breadcrumb from 'components/elements/Breadcrumb'
import SpotlightContainer from 'components/spotlight/SpotlightContainer'
import SpotlightIcon from 'icons/spotlight'
import LiteSpotlightContainer from 'components/spotlight/SpotlightContainer/LiteSpotlightContainer'
import useQueryParam from 'util/hooks/useQueryParam'
import { isLitePlatform, PlatformsContext, useGetNormalizedCompanyPlatforms } from 'util/platforms'
import { useParams } from 'react-router'
import config from 'config'
import './Spotlight.scss'

const { navigationItemsNames } = config

const Spotlight: React.FC<{ closeModal: () => void }> = ({ closeModal }) => {
  const pageName = navigationItemsNames.SPOTLIGHT

  const [platforms] = useGetNormalizedCompanyPlatforms({ onlyActive: true, onlyLite: true })

  const breadcrumb = <Breadcrumb pageName={pageName} Icon={SpotlightIcon} />

  const [platformId] = useQueryParam<string>('platformId', '')
  const { personId } = useParams<{ personId: string }>()

  const isLite = isLitePlatform(platformId)

  return (
    <div className='ModalPage'>
      <PlatformsContext.Provider value={{ platforms }}>
        <div className='Spotlight'>
          <Actionbar titleComponent={breadcrumb} closeButtonAction={closeModal} />
          {isLite ? (
            <LiteSpotlightContainer platformId={platformId} personId={decodeURIComponent(personId)} />
          ) : (
            <SpotlightContainer personId={decodeURIComponent(personId)} wrapperType='modal' />
          )}
        </div>
      </PlatformsContext.Provider>
    </div>
  )
}

export default Spotlight
