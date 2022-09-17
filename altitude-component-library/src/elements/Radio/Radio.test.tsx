import React from 'react'
import { render } from '@testing-library/react'

import { Radio, RadioProps } from './Radio'
import { noop } from 'test/support/helpers'

describe('Radio', () => {
  it('renders correctly', () => {
    const props: RadioProps = {
      labelText: 'Select it',
      name: 'select-it',
      checked: true,
      onChange: noop,
      className: 'Radio--custom',
      labelOnRight: true
    }
    const { container } = render(<Radio {...props} />)
    expect(container).toMatchSnapshot()
  })
})
