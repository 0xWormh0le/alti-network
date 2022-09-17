import React from 'react'
import { render } from '@testing-library/react'
import { LoadingBar } from './LoadingBar'

describe('LoadingBar', () => {
  it('renders correctly', () => {
    const { container } = render(<LoadingBar />)
    expect(container).toMatchSnapshot()
  })
})
