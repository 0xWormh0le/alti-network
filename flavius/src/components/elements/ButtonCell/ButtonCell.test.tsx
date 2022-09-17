import React from 'react'
import { render } from '@testing-library/react'
import ButtonCell, { ButtonCellProps } from './ButtonCell'
import noop from 'lodash/noop'

describe('Button', () => {
  it('renders correctly', () => {
    const props: ButtonCellProps = {
      onClick: noop,
      value: 'hello'
    }
    const { container } = render(<ButtonCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
