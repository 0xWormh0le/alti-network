import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightAppbarItem from './AppSpotlightAppbarItem'
import noop from 'lodash/noop'

describe('AppSpotlightAppbarItem', () => {
  it('renders correctly', () => {
    const props = {
      key: '',
      name: '',
      image: '',
      isSelected: true,
      index: 0,
      onClick: noop
    }

    const { container } = renderWithRouter(<AppSpotlightAppbarItem {...props} />)
    expect(container).toMatchSnapshot()
  })
})
