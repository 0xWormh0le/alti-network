import React from 'react'

import { AccessLists, AccessListsProps } from './AccessLists'
import { fileMock } from 'test/mocks'
import { renderWithRouter } from 'test/support/helpers'

describe('AccessLists', () => {
  it('renders correctly', () => {
    const props: AccessListsProps = {
      file: fileMock
    }
    const { container } = renderWithRouter(<AccessLists {...props} />)
    expect(container).toMatchSnapshot()
  })
})
