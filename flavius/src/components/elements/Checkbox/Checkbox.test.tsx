import React from 'react'
import { render } from '@testing-library/react'

import { Checkbox, CheckboxProps } from './Checkbox'
import noop from 'lodash/noop'

describe('Checkbox', () => {
  it('renders correctly', () => {
    const props: CheckboxProps = {
      labelText: 'Check it',
      name: 'check-it',
      checked: true,
      onChange: noop,
      className: 'Checkbox--custom',
      labelOnRight: true
    }
    const { container } = render(<Checkbox {...props} />)
    expect(container).toMatchSnapshot()
  })
})
