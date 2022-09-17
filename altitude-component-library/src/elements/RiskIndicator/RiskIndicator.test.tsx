import React from 'react'
import { render } from '@testing-library/react'
import { RiskIndicator, RiskIndicatorProps } from './RiskIndicator'

describe('RiskIndicator', () => {
  it('renders correctly', () => {
    const props: RiskIndicatorProps = {
      value: 6
    }
    const { container } = render(<RiskIndicator {...props} />)
    expect(container).toMatchSnapshot()
  })
})
