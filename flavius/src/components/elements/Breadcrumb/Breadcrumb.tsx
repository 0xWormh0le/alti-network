import React from 'react'
import { Link } from 'react-router-dom'
import { LocationHistoryContextConsumer } from 'models/LocationHistoryContext'
import { modalRoutes, locationIsAModalRoute, searchWithoutModalParams } from 'util/helpers'
import { capitalize } from 'lodash'
import './Breadcrumb.scss'

export interface BreadcrumbProps {
  pageName: string
  state?: any
  Icon?: React.ComponentType<SvgProps>
}

function buildBreadcrumbLastVisitedItems(locations: string[], state: any, onClick?: (path: string) => void) {
  // Check if the previous location was a modal in the history of visited pathnames, if so, filter
  // all the modal locations, and then transform them into items that can be rendered on the breadcrump
  // with their link
  if (locations?.length >= 2 && locationIsAModalRoute(locations[locations.length - 2])) {
    // discard the last location because it is the current route
    const currentLocation = locations[locations.length - 1]
    const linkableLocations = locations.slice(0, locations.length - 1)

    return linkableLocations
      .filter(locationIsAModalRoute)
      .filter((linkableLocation) => linkableLocation !== currentLocation)
      .map((breadCrumbPath, index) => {
        let pageName = ''

        for (const modalRoute of modalRoutes) {
          if (breadCrumbPath.includes(modalRoute)) {
            pageName = capitalize(modalRoute.slice(1, -1))
            break
          }
        }

        const lastSearch = searchWithoutModalParams()
        const nextLocation = state
          ? {
              pathname: `${breadCrumbPath}`,
              state,
              search: lastSearch
            }
          : `${breadCrumbPath}${lastSearch === '' ? '?' : lastSearch + '&'}breadcrumbPosition=${index}`

        return {
          Icon: null,
          pageName,
          render: () => (
            <Link
              onClick={() => {
                if (onClick) {
                  onClick(breadCrumbPath)
                }
              }}
              to={nextLocation}
              className='Breadcrumb__item Breadcrumb__link'>
              {pageName}
            </Link>
          ),
          separatorEnd: true
        }
      })
  } else {
    return []
  }
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ pageName, state, Icon }) => {
  const currentItem = {
    Icon,
    pageName,
    render: () => <div className='Breadcrumb__item'>{pageName}</div>,
    separatorEnd: false
  }

  return (
    <LocationHistoryContextConsumer>
      {({ breadcrumbLocations, deleteFromBreadcrumbLocations }) => {
        const itemsToRender = [
          ...buildBreadcrumbLastVisitedItems(breadcrumbLocations, state, deleteFromBreadcrumbLocations),
          currentItem
        ]

        return (
          <div className='Breadcrumb'>
            {itemsToRender.map((item, index) => (
              <React.Fragment key={item.pageName + index}>
                {item.Icon && <item.Icon className='Icon' alt={item.pageName} />}
                {item.render()}
                {item.separatorEnd && <span className='Breadcrumb__separator'>&gt;</span>}
              </React.Fragment>
            ))}
          </div>
        )
      }}
    </LocationHistoryContextConsumer>
  )
}

export default Breadcrumb
