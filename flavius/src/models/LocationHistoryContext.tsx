import React from 'react'
import pick from 'lodash/pick'
import { noop } from 'lodash'

const TRACKED_PARAMS = [
  'page',
  'pageNumber',
  'riskTypeIds',
  'selectedCardKey',
  'selectedSubNavKey',
  'selectedEmail',
  'platformIds',
  'userVisibilityState'
]

export const LocationHistoryContext = React.createContext({} as LocationHistoryContextProviderState)

interface LocationHistoryContextProviderProps {
  children: React.ReactNode
}

interface LocationHistoryContextProviderState {
  breadcrumbLocations: string[]
  trackedQueryParams: {}
  deleteFromBreadcrumbLocations?: (path: string) => void
  onLocationVisited?: (location: string, breadcrumbPosition?: number) => void
  onQueryParamsChanged?: (queryParams: object) => void
}

export class LocationHistoryContextProvider extends React.Component<
  LocationHistoryContextProviderProps,
  LocationHistoryContextProviderState
> {
  public state = {
    breadcrumbLocations: [], // array of the last location visited
    trackedQueryParams: {}, // keep track of the latest value for some interesting query params before opening modals
    deleteFromBreadcrumbLocations: noop
  }

  public render() {
    return (
      <LocationHistoryContext.Provider
        value={{
          breadcrumbLocations: this.state.breadcrumbLocations,
          deleteFromBreadcrumbLocations: (path) => {
            this.setState((prevState) => {
              return {
                breadcrumbLocations: prevState.breadcrumbLocations.slice(0, prevState.breadcrumbLocations.indexOf(path))
              }
            })
          },
          onLocationVisited: (location: string, breadcrumbPosition?: number) => {
            if (breadcrumbPosition === undefined) {
              // push new location to the back of the array and just keep the last 3
              this.setState((prevState) => ({
                breadcrumbLocations: [...prevState.breadcrumbLocations, location].slice(-3)
              }))
            } else {
              // this means the user clicked on the breadcrumb and navigated to a breadcrumb path,
              // we need to reset the locations stack in that case
              this.setState((prevState) => ({
                breadcrumbLocations: prevState.breadcrumbLocations.slice(0, breadcrumbPosition + 1)
              }))
            }
          },
          trackedQueryParams: this.state.trackedQueryParams,
          onQueryParamsChanged: (queryParams: object) => {
            this.setState({
              trackedQueryParams: pick(queryParams, TRACKED_PARAMS)
            })
          }
        }}>
        {this.props.children}
      </LocationHistoryContext.Provider>
    )
  }
}

// Consumer
export const LocationHistoryContextConsumer = LocationHistoryContext.Consumer
