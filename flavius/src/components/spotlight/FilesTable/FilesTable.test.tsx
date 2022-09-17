import React from 'react'
import { act, RenderResult } from '@testing-library/react'

import FilesTable, { FilesTableProps } from './FilesTable'
import { GENERAL_URLS } from 'api/endpoints'
import { renderWithRouter } from 'test/support/helpers'
import UI_STRINGS from 'util/ui-strings'

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    domains: ['email.com'],
    location: { search: '' }
  }) // mock history, location
}))

const props: FilesTableProps = {
  queryParams: { personId: 'michael@altitudenetworks.com' },
  fields: [
    UI_STRINGS.FILE.FILE_NAME,
    UI_STRINGS.FILE.FILE_OWNER,
    UI_STRINGS.EDIT_PERMISSIONS.CREATED_ON,
    UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED
  ],
  exportUrl: `${GENERAL_URLS.FILES}?person-id=michael@altitudenetworks.com`
}

describe('FilesTable', () => {
  let renderResult: RenderResult

  beforeEach(async () => {
    await act(async () => {
      renderResult = renderWithRouter(<FilesTable {...props} />)
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })
})
