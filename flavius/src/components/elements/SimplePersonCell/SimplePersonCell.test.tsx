import React from 'react'
import { personMock } from 'test/mocks'
import { renderWithRouter } from 'test/support/helpers'
import { SimplePersonCell, SimplePersonCellProps } from './SimplePersonCell'

describe('SimplePersonCell', () => {
  it('renders correctly', () => {
    const props: SimplePersonCellProps = {
      personInfo: personMock
    }
    const { container } = renderWithRouter(<SimplePersonCell {...props} />)
    expect(container).toMatchSnapshot()
  })
})
