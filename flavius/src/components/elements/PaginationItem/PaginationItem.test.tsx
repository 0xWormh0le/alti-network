import React from 'react'
import { render } from '@testing-library/react'
import PaginationItem from './PaginationItem'

describe('PaginationItem', () => {
  it('renders correctly', () => {
    const { container } = render(<PaginationItem variant='arrow' />)
    expect(container).toMatchSnapshot()
  })
})
