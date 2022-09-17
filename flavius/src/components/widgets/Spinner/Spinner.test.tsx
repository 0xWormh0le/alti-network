import React from 'react'
import { render } from '@testing-library/react'

import Spinner from './Spinner'

describe('Spinner', () => {
  it('renders correctly', () => {
    const props = {
      className: 'Spinner__custom'
    }
    const { container } = render(<Spinner {...props} />)
    expect(container).toMatchSnapshot()
  })
})
