import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { Breadcrumb } from './Breadcrumb'
import FileIcon from 'icons/inspector'
import { BrowserRouter } from 'react-router-dom'
import { LocationHistoryContext } from 'models/LocationHistoryContext'

describe('Breadcrumb', () => {
  it('renders correctly', () => {
    const props = {
      pageName: 'Files',
      Icon: FileIcon
    }
    const { container } = renderWithRouter(
      <BrowserRouter>
        <LocationHistoryContext.Provider
          value={{
            breadcrumbLocations: ['/files/', '/spotlight/', '/page/'],
            trackedQueryParams: {}
          }}>
          <Breadcrumb {...props} />
        </LocationHistoryContext.Provider>
      </BrowserRouter>
    )
    expect(container).toMatchSnapshot()
  })
})
