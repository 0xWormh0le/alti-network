import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import { SetPasswordField, SetPasswordFieldProps } from './SetPasswordField'

describe('RiskIndicator', () => {
  it('renders correctly', () => {
    const props: SetPasswordFieldProps = {
      password: 'password',
      handleChange: noop,
      label: 'Password'
    }
    const { container } = render(<SetPasswordField {...props} />)
    expect(container).toMatchSnapshot()
  })
})
