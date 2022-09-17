import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import DisableStep from './DisableStep'

describe('CongratsStep', () => {
  it('renders correctly', () => {
    const localProps = {
      buttonLoading: false,
      password: 'password',
      onPasswordChange: noop,
      challengeAnswer: 'answer',
      onChallengeAnswerChange: noop,
      onStepCompleted: noop
    }
    const { container } = render(<DisableStep {...localProps} />)
    expect(container).toMatchSnapshot()
  })
})
