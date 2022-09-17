import React from 'react'
import { render } from '@testing-library/react'
import { Button, ButtonProps } from './Button'

describe('Button', () => {
  it('renders correctly', () => {
    const props: ButtonProps = {
      action: 'primary',
      isLoading: false,
      text: 'Action Button',
      loadingText: 'Loading',
      className: 'Button--custom',
      disabled: false
    }
    const { container } = render(<Button {...props} />)
    expect(container).toMatchSnapshot()
  })
})
