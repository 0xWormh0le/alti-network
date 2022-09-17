import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import ModalWrapper from './ModalWrapper'

describe('People', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<ModalWrapper />)
    expect(container).toMatchSnapshot()
  })
})
