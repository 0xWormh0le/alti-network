import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import { LocationHistoryContextProvider } from './models/LocationHistoryContext'

describe('App', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(
      <BrowserRouter>
        <LocationHistoryContextProvider>
          <App />
        </LocationHistoryContextProvider>
      </BrowserRouter>
    )
    expect(container).toMatchSnapshot()
  })
})
