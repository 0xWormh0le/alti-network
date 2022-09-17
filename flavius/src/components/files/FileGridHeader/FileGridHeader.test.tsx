import React from 'react'
import { fileMock } from 'test/mocks'
import FileGridHeader from './FileGridHeader'
import { renderWithRouter } from 'test/support/helpers'
import CONSTANTS from 'util/constants'
import UI_STRINGS from 'util/ui-strings'

describe('FileGridHeader', () => {
  it('renders correctly', () => {
    const { container } = renderWithRouter(<FileGridHeader file={fileMock} loading={false} />)
    expect(container).toMatchSnapshot()
  })

  it('displays folder with link if parentFolder.folderId and parentFolder.folderName are avaialble', () => {
    const newFileMock = {
      ...fileMock,
      parentFolder: {
        folderId: '123456',
        folderName: 'rootFolder'
      }
    }
    const { container } = renderWithRouter(<FileGridHeader file={newFileMock} loading={false} />)

    expect(container.querySelector('.FileGridHeader__file-info-link')).toHaveAttribute(
      'href',
      '/dashboard/folder/123456?platformId=gsuite'
    )
    expect(container.querySelector('.FileGridHeader__file-info-link')).not.toHaveClass('disabled')
    expect(container.querySelector('.FileGridHeader__file-info-link')).toHaveTextContent('rootFolder')
  })

  it(`displays folder with disabled link if parentFolder.folderId and parentFolder.folderName are avaialble, but parentFolder.folderName is ${CONSTANTS.EXTERNAL_OR_UNKNOWN}`, async () => {
    const newFileMock = {
      ...fileMock,
      parentFolder: {
        folderId: '123456',
        folderName: CONSTANTS.EXTERNAL_OR_UNKNOWN
      }
    }
    const { container } = renderWithRouter(<FileGridHeader file={newFileMock} loading={false} />)

    expect(container.querySelector('.FileGridHeader__file-info-link')).toHaveClass('disabled')
    expect(container.querySelector('.FileGridHeader__file-info-link')).toHaveTextContent(
      UI_STRINGS.FILE.EXTERNAL_OR_UNKNOWN
    )
  })
})
