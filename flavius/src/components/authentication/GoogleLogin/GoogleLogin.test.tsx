import React from 'react'
import { render } from '@testing-library/react'

import noop from 'lodash/noop'
import GoogleLogin from './GoogleLogin'

describe('GoogleLogin', () => {
  it('renders correctly', () => {
    const props = {
      handleSuccessResponse: noop,
      isLoading: false
    }
    const { container } = render(<GoogleLogin {...props} />)
    expect(container).toMatchSnapshot()
  })
})
