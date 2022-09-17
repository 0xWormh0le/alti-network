import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import Support from './Support'

describe('Support', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<Support />)
    expect(container).toMatchSnapshot()
  })
})
