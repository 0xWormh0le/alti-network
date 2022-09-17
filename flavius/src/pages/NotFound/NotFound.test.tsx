import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import NotFound from './NotFound'

describe('NotFound', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<NotFound />)
    expect(container).toMatchSnapshot()
  })
})
