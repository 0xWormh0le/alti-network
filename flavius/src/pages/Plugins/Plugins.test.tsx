import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import Plugins from './Plugins'

describe('Plugins', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<Plugins />)
    expect(container).toMatchSnapshot()
  })
})
