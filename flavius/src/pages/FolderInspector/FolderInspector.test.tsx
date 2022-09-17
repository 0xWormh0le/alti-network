import React from 'react'
import { withRouter } from 'react-router-dom'
import { renderWithRouter } from 'test/support/helpers'
import FolderInspector from './FolderInspector'

describe('FolderInspector', () => {
  it('renders correctly', () => {
    const FolderInspectorRouted = withRouter(FolderInspector)
    const { container } = renderWithRouter(<FolderInspectorRouted />)
    expect(container).toMatchSnapshot()
  })
})
