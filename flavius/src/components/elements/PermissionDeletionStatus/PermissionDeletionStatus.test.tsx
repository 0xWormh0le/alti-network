import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import PermissionDeletionStatus from './PermissionDeletionStatus'

describe('AppSpotlightAppbarItem', () => {
  it('renders correctly', () => {
    const props = {
      riskId: '',
    }

    const { container } = renderWithRouter(<PermissionDeletionStatus {...props} />)
    expect(container).toMatchSnapshot()
  })
})
