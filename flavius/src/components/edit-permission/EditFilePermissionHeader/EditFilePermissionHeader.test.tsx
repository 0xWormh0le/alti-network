import React from 'react'
import { fileMock } from 'test/mocks'
import EditFilePermissionHeader from './EditFilePermissionHeader'
import { renderWithRouter } from 'test/support/helpers'

describe('EditFilePermissionHeader', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<EditFilePermissionHeader file={fileMock} />)
    expect(container).toMatchSnapshot()
  })
})
