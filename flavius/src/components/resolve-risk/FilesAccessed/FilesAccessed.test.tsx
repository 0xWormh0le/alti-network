import React from 'react'
import { fileMock } from 'test/mocks'
import FilesAccessed from './FilesAccessed'
import { renderWithRouter } from 'test/support/helpers'
import noop from 'lodash/noop'

describe('FilesAccessed', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(
      <FilesAccessed
        files={[fileMock, fileMock]}
        pageSize={1}
        pageCount={1}
        pageNumber={1}
        entityCount={2}
        loading={false}
        email='foo@bar.com'
        onPageChange={noop}
      />
    )
    expect(container).toMatchSnapshot()
  })
})
