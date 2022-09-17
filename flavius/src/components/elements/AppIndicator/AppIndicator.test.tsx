import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { AppIndicator, AppIndicatorProps } from './AppIndicator'

describe('AppIndicator', () => {
  it('renders correctly', () => {
    const props: AppIndicatorProps = {
      className: 'test',
      value: 'GDrive',
      fileId: 'test-file-id'
    }
    const { container } = renderWithRouter(<AppIndicator {...props} />)
    expect(container).toMatchSnapshot()
  })
})
