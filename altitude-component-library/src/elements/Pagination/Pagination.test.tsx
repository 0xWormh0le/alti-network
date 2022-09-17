import React from 'react'
import { render } from '@testing-library/react'
import Pagination from './Pagination'
import { noop } from 'util/helpers'

describe('Pagination', () => {
  it('renders correctly', () => {
    const { container } = render(<Pagination pageNumber={0} totalCount={10} pageSize={4} onPageChange={noop} />)
    expect(container).toMatchSnapshot()
  })
})
