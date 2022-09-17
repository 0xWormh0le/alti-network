import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import NumberedList from './NumberedList'

describe('NumberedList', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(
      <NumberedList>
        <span>item1</span>
        <span>item2</span>
      </NumberedList>
    )
    expect(container).toMatchSnapshot()
  })
})
