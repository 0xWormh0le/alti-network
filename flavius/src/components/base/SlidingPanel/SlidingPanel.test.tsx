import React from 'react'
import { render } from '@testing-library/react'
import SlidingPanel from './SlidingPanel'

describe('SlidingPanel', () => {
  it('renders correctly', () => {
    const { container } = render(<SlidingPanel />)
    expect(container).toMatchSnapshot()
  })
})
