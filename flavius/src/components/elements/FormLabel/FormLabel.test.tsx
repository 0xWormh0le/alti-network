import React from 'react'
import { render } from '@testing-library/react'
import { FormLabel, FormLabelProps } from './FormLabel'

describe('FormLabel', () => {
  it('renders correctly', () => {
    const props: FormLabelProps = {
      htmlFor: 'name',
      children: 'Name'
    }
    const { container } = render(<FormLabel {...props} />)
    expect(container).toMatchSnapshot()
  })
})
