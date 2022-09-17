import React from 'react'
import { withRouter } from 'react-router-dom'
import { renderWithRouter } from 'test/support/helpers'
import Routes from './Routes'

describe('Routes', () => {
  it('renders correctly', () => {
    const RoutesComp = withRouter(Routes)
    const { container } = renderWithRouter(<RoutesComp />)
    expect(container).toMatchSnapshot()
  })
})
