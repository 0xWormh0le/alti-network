import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { NavButton, NavButtonProps } from './NavButton'

describe('NavButton', () => {
  it('renders correctly', () => {
    const props: NavButtonProps = {
      route: '/risks',
      action: 'primary',
      isLoading: false,
      text: 'Top Risks',
      loadingText: 'Loading',
      className: 'Button--custom',
      disabled: false
    }
    const { container } = renderWithRouter(<NavButton {...props} />)
    expect(container).toMatchSnapshot()
  })
})
