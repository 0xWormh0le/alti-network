import React from 'react'
import { render } from '@testing-library/react'
import { VisibilityIndicator, VisibilityIndicatorProps } from './VisibilityIndicator'

describe('VisibilityIndicator', () => {
  it('renders internal indicator correctly', () => {
    const props: VisibilityIndicatorProps = {
      isInternal: true
    }
    const { container } = render(<VisibilityIndicator {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('renders external indicator correctly', () => {
    const props: VisibilityIndicatorProps = {
      isInternal: false
    }
    const { container } = render(<VisibilityIndicator {...props} />)
    expect(container).toMatchSnapshot()
  })
})
