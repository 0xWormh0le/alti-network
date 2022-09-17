import React, { useState, Fragment, useEffect } from 'react'
import { Typography, TypographyVariant } from 'components/elements/Typography/Typography'
import AppSpotlightAppbar from '../AppSpotlightAppbar'
import { AppSpotlightAppScopes } from '../AppSpotlightAppScopes/AppSpotlightAppScopes'
import uniq from 'lodash/uniq'
import { ScopeCatalog } from 'models/ScopeCatalog'
import ContentLoader from 'react-content-loader'
import UI_STRINGS from 'util/ui-strings'
import './AppSpotlightGrantContainer.scss'

export interface AppSpotlightGrantContainerProps {
  app: Maybe<Application>
  loading: boolean
}

export const AppSpotlightGrantContainer: React.FC<AppSpotlightGrantContainerProps> = ({ app, loading }) => {
  const [selectedServiceName, setSelectedServiceName] = useState('')
  const [serviceNames, setServiceNames] = useState([] as string[])
  const [items, setItems] = useState([] as string[])
  const [serviceNamesSorted, setServiceNamesSorted] = useState([] as string[])

  useEffect(() => {
    const _items = uniq(app?.grants).reduce((allGrants, grant) => {
      const grantMatch = ScopeCatalog[grant]
      if (grantMatch) {
        const { description, service } = grantMatch
        if (Array.isArray(allGrants[service])) {
          allGrants[service].push(description)
        } else {
          allGrants[service] = [description]
        }
      } else {
        if (Array.isArray(allGrants.other)) {
          allGrants.other.push(grant)
        } else {
          allGrants.other = [grant]
        }
      }
      return allGrants
    }, {} as any)

    const _serviceNames = Object.keys(_items)
    setItems(_items)
    setServiceNames(_serviceNames)
    setServiceNamesSorted(_serviceNames.sort())
  }, [app])

  useEffect(() => {
    // Sort the services alphabetically, then move 'other' to the end
    // const serviceNamesSorted = serviceNames.sort()
    if (!serviceNamesSorted) {
      return
    }

    const otherIndex = serviceNamesSorted.findIndex((element: any) => element === 'other')
    if (otherIndex > -1) {
      serviceNamesSorted.splice(otherIndex, 1)
      serviceNamesSorted.push('other')
    }

    setSelectedServiceName(serviceNamesSorted[0])
  }, [serviceNamesSorted, serviceNames])

  const [scopeDom, setScopeDom] = useState<HTMLDivElement>()

  const handleSelectionChange = (serviceName: string) => {
    setSelectedServiceName(serviceName)
  }

  const handleCloseScope = () => {
    if (scopeDom) {
      scopeDom.blur()
    }
  }

  return (
    <div className='AppSpotlightGrantContainer'>
      <div className='AppSpotlightGrantContainer__top'>
        <Typography variant={TypographyVariant.H3} weight='normal' className='AppSpotlightAppImage__top-title'>
          {UI_STRINGS.APPSPOTLIGHT.THIS_APP_GRANTED_TO}
        </Typography>
      </div>
      {loading ? (
        <ContentLoader
          backgroundColor='#F0F0F0'
          foregroundColor='#F7F7F7'
          height={124}
          width={620}
          uniqueKey='AppSpotlightGrantContainer__top'>
          <rect x={0} y={0} width={620} height={124} rx={4} ry={4} />
        </ContentLoader>
      ) : serviceNames.length > 0 ? (
        <Fragment>
          <div className='AppSpotlightGrantContainer__top-bar'>
            <AppSpotlightAppbar
              serviceNames={serviceNamesSorted}
              selected={selectedServiceName}
              onSelectionChanged={handleSelectionChange}
            />
          </div>
          <div
            tabIndex={0}
            className='AppSpotlightGrantContainer__bottom'
            ref={(dom) => {
              if (dom) {
                setScopeDom(dom)
              }
            }}>
            <span className='AppSpotlightGrantContainer__bottom--close' onClick={handleCloseScope}>
              ×
            </span>
            <AppSpotlightAppScopes scopes={items[selectedServiceName]} />
          </div>
        </Fragment>
      ) : (
        <div className='AppSpotlightGrantContainer--error'>
          <Typography variant={TypographyVariant.H3} weight='normal'>
            {UI_STRINGS.APPSPOTLIGHT.UNABLE_TO_DETERMINE}.
          </Typography>
        </div>
      )}
    </div>
  )
}

export default AppSpotlightGrantContainer
