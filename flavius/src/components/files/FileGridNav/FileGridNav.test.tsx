import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import FileGridNav, { FileGridNavProps } from './FileGridNav'
import noop from 'lodash/noop'
import { FileGridNavType } from 'types/common'

describe('FileGridNavProps', () => {
  it('renders correctly', () => {
    const props: FileGridNavProps = {
      selectedNavKey: FileGridNavType.TIMELINE,
      loading: false,
      onChangeSelection: noop,
      isFolder: false
    }

    const { container } = renderWithRouter(<FileGridNav {...props} />)
    expect(container).toMatchSnapshot()
  })
})
