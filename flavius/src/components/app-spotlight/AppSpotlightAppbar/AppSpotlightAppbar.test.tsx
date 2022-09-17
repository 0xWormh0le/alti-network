import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightAppbar from './AppSpotlightAppbar'
import noop from 'lodash/noop'

describe('AppSpotlightAppbar', () => {
  it('renders correctly', () => {
    const props = {
      serviceNames: [],
      selected: '',
      onSelectionChanged: noop
    }

    const { container } = renderWithRouter(<AppSpotlightAppbar {...props} />)
    expect(container).toMatchSnapshot()
  })
})
