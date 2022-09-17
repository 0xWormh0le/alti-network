import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { AppFileIndicator, AppFileIndicatorProps } from './AppFileIndicator'

describe('AppFileIndicator', () => {
  it('renders correctly', () => {
    const props: AppFileIndicatorProps = {
      className: 'test',
      value: 'GDrive',
      webLink: 'https://drive.google.com'
    }
    const { container } = renderWithRouter(<AppFileIndicator {...props} />)
    expect(container).toMatchSnapshot()
  })
})
