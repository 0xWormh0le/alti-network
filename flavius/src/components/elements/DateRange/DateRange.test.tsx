import React from 'react'
import { render } from '@testing-library/react'
import { DateRange, DateRangeProps } from './DateRange'

describe('DateRange', () => {
  it('renders correctly', () => {
    const props: DateRangeProps = {
      from: 1566492823,
      to: 1566502823,
      className: 'DateRange--custom'
    }
    const { container } = render(<DateRange {...props} />)
    expect(container).toMatchSnapshot()
  })
})
