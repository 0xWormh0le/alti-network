import React from 'react'
import { render } from '@testing-library/react'
import Pagination from './Pagination'
import noop from 'lodash/noop'

describe('Pagination', () => {
  it('renders correctly', () => {
    const { container } = render(<Pagination pageNumber={0} pageCount={3} onPageChange={noop} />)
    expect(container).toMatchSnapshot()
  })
})
