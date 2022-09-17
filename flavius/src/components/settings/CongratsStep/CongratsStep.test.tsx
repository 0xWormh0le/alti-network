import React from 'react'
import { render } from '@testing-library/react'
import CongratsStep from './CongratsStep'

describe('CongratsStep', () => {
  it('renders correctly', () => {
    const { container } = render(<CongratsStep />)
    expect(container).toMatchSnapshot()
  })
})
