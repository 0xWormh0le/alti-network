import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import VerifyStep from './VerifyStep'

describe('VerifyStep', () => {
  it('renders correctly', () => {
    const localProps = {
      buttonLoading: false,
      challengeAnswer: 'answer',
      onChallengeAnswerChange: noop,
      onStepCompleted: noop
    }
    const { container } = render(<VerifyStep {...localProps} />)
    expect(container).toMatchSnapshot()
  })
})
