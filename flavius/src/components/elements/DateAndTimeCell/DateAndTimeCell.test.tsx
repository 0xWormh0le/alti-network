import React from 'react'
import { render } from '@testing-library/react'
import { DateAndTimeCell, DateAndTimeCellProps } from './DateAndTimeCell'

describe('DateAndTimeCell', () => {
  it('renders correctly', () => {
    const props: DateAndTimeCellProps = {
      value: 1566492823
    }
    const { container } = render(<DateAndTimeCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
