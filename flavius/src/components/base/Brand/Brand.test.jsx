import React from 'react'
import { render } from '@testing-library/react'
import Brand from './Brand'

describe('Brand', () => {
  it('renders brand name', () => {
    const { getByAltText } = render(<Brand />)
    expect(getByAltText('Navbar Logo')).toBeInTheDocument()
  })
})
