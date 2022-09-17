import React from 'react'
import { withRouter } from 'react-router-dom'
import { renderWithRouter } from 'test/support/helpers'
import BaseModalPage from './BaseModalPage'

describe('BaseModalPage', () => {
  it('renders correctly', () => {
    const BaseModal = withRouter(BaseModalPage)
    const { container } = renderWithRouter(<BaseModal />)
    expect(container).toMatchSnapshot()
  })
})
