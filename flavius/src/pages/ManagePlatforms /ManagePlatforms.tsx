// import PlatformCard from 'components/manage-platforms/PlatformCard'
// import React, { Fragment, useEffect, useState } from 'react'
import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { getAllPlatformsBasicData, useGetNormalizedCompanyPlatforms } from 'util/platforms'
import DisconnectPlatform from 'components/manage-platforms/DisconnectPlatform'
import UI_STRINGS from 'util/ui-strings'
import PlatformCard from 'components/manage-platforms/PlatformCard'
import PageTitle from 'components/elements/PageTitle'
import { alertError } from 'util/alert'
import './ManagePlatforms.scss'

const ManagePlatforms: React.FC = () => {
  const [focusedPlatformId, setFocusedPlatformId] = useState('')

  const [platforms, isLoading, refreshCache] = useGetNormalizedCompanyPlatforms({}, (err) => {
    alertError(UI_STRINGS.MANAGE_PLATFORMS.ERROR_FETCHING_PLATFORMS)
  })
  const basicPlatforms = getAllPlatformsBasicData()

  const { useBeginBoxAuth } = useLitePlatformApiClient({})

  const { useDisconnectBox } = useLitePlatformApiClient({
    handleSuccess: () => {
      refreshCache.call()
    }
  })
  const [boxlightAuth, , isBeginningBoxlightAuth, beginBoxAuth] = useBeginBoxAuth()
  const [, , isDisconnectingBoxLight, disconnectBox] = useDisconnectBox()

  const platformMetaData: Dictionary<{
    disconnect?: () => void
    connect?: () => void
    isInProgress: boolean
  }> = useMemo(
    () => ({
      [UI_STRINGS.PLATFORMS.GSUITE_ID]: {
        isInProgress: false
      },

      [UI_STRINGS.PLATFORMS.O365_ID]: {
        isInProgress: false
      },
      [UI_STRINGS.PLATFORMS.BOX_ID]: {
        connect: () => {
          beginBoxAuth.call()
        },
        disconnect: () => {
          disconnectBox.call()
        },
        isInProgress: isBeginningBoxlightAuth || isDisconnectingBoxLight
      }
    }),
    [disconnectBox, beginBoxAuth, isBeginningBoxlightAuth, isDisconnectingBoxLight]
  )

  useEffect(() => {
    if (boxlightAuth?.url) {
      window.location.href = boxlightAuth.url
    }
  }, [boxlightAuth])

  return (
    <Fragment>
      <div className='ManagePlatforms'>
        <PageTitle title={UI_STRINGS.MANAGE_PLATFORMS.TITLE} />
        <p className='ManagePlatforms__description'>{UI_STRINGS.MANAGE_PLATFORMS.DESCRIPTION}</p>
        <div className='ManagePlatforms__cards'>
          {basicPlatforms.map((platform) => {
            const { platformId } = platform

            const platformData = {
              ...platforms[platformId],
              ...platformMetaData[platformId]
            }
            return (
              <PlatformCard
                key={platformId}
                canConnect={platformData.canConnect}
                platform={platformData.platformId}
                isActive={platformData.isActive}
                isInProgress={platformData.isInProgress}
                connectedOn={platformData.connectedOn}
                isLoading={isLoading}
                onClickConnect={platformData.connect}
                onClickDisconnect={() => setFocusedPlatformId(platformId)}
                resources={platformData.resourcesLink}
              />
            )
          })}
        </div>
      </div>
      {focusedPlatformId && platforms
        ? platforms[focusedPlatformId] && (
            <DisconnectPlatform
              onConfirm={() =>
                platformMetaData[focusedPlatformId].disconnect && platformMetaData[focusedPlatformId].disconnect!()
              }
              platformId={focusedPlatformId}
              onCancel={() => setFocusedPlatformId('')}
            />
          )
        : null}
    </Fragment>
  )
}

export default ManagePlatforms
