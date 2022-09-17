import React from 'react'
import { renderWithRouter } from '../../../test/support/helpers'
import { render } from '@testing-library/react'
import PlatformIcon from './PlatformIcon'

describe('Platform Icon Test', () => {
  it('matches PlatformIcon snapshot', () => {
    const { container } = renderWithRouter(<PlatformIcon platformId='gsuite' platformName='Google Workspace' />)
    expect(container).toMatchSnapshot()
  })

  it('should have a title of gsuite', () => {
    const { getByTitle } = render(<PlatformIcon platformId='gsuite' platformName='Google Workspace' />)
    expect(getByTitle('Google Workspace').title).toBe('Google Workspace')
  })

  it('should have a title of Microsoft 365', () => {
    const { getByTitle } = render(<PlatformIcon platformId='o365' platformName='Microsoft 365' />)
    expect(getByTitle('Microsoft 365').title).toBe('Microsoft 365')
  })
})
