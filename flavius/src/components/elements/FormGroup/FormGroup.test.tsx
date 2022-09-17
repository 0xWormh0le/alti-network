import React from 'react'
import { render } from '@testing-library/react'
import { FormGroup, FormGroupProps } from './FormGroup'

describe('FormGroup', () => {
  it('renders correctly', () => {
    const props: FormGroupProps = {
      children: <div />
    }
    const { container } = render(<FormGroup {...props} />)
    expect(container).toMatchSnapshot()
  })
})
