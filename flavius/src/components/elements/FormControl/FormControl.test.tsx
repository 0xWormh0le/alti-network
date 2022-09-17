import React from 'react'
import { render } from '@testing-library/react'
import { FormControl, FormControlProps } from './FormControl'
import noop from 'lodash/noop'

describe('FormControl', () => {
  it('renders correctly', () => {
    const props: FormControlProps = {
      name: 'fullName',
      type: 'text',
      value: 'John Doe',
      onChange: noop
    }
    const { container } = render(<FormControl {...props} />)
    expect(container).toMatchSnapshot()
  })
})
