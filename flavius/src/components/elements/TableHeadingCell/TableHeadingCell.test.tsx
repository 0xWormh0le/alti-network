import React from 'react'
import { render } from '@testing-library/react'
import TableHeadingCell from './TableHeadingCell'

describe('TableHeadingCell', () => {
  it('renders correctly', () => {
    const props = {
      title: 'Example Table',
      cellProperties: { sortable: true },
    }
    const { container } = render(<TableHeadingCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
