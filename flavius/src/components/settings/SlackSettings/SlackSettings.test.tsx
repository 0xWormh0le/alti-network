import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import SlackSettings from './SlackSettings'

describe('Slack Settings', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<SlackSettings />)
    expect(container).toMatchSnapshot()
  })
})
