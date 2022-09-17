import React from 'react'
import { render } from '@testing-library/react'
import { default as IpCell, IpCellProps } from './IpCell'

describe('IpCell', () => {
  it('renders correctly', () => {
    const props: IpCellProps = {
      value: '74.155.155.25',
    }
    const { container } = render(<IpCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
