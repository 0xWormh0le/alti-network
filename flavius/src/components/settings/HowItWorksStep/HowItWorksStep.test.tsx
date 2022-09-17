import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import HowItWorksStep from './HowItWorksStep'

describe('HowItWorksStep', () => {
  it('renders correctly', () => {
    const localProps = {
      onStepCompleted: noop
    }
    const { container } = render(<HowItWorksStep {...localProps} />)
    expect(container).toMatchSnapshot()
  })
})
