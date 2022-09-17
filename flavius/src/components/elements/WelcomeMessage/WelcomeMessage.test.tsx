import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { WelcomeMessage } from './WelcomeMessage'

describe('WelcomeMessage', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<WelcomeMessage />)
    expect(container).toMatchSnapshot()
  })
})
