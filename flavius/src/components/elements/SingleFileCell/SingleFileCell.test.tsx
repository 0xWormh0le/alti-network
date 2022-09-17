import React from 'react'
import { fileMock } from 'test/mocks'
import { renderWithRouter } from 'test/support/helpers'
import { SingleFileCell, SingleFileCellProps } from './SingleFileCell'
import CONSTANTS from 'util/constants'
import UI_STRINGS from 'util/ui-strings'

describe('SingleFileCell', () => {
  it('renders correctly', () => {
    const props: SingleFileCellProps = {
      file: fileMock
    }
    const { container } = renderWithRouter(<SingleFileCell {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('displays folder with link if parentFolder.folderId and parentFolder.folderName are avaialble', async () => {
    const newFileMock = {
      ...fileMock,
      parentFolder: {
        folderId: '123456',
        folderName: 'rootFolder'
      }
    }
    const { container, findByText } = renderWithRouter(<SingleFileCell file={newFileMock} />)

    expect(await findByText('rootFolder')).toBeDefined()
    expect(container.querySelector('.SingleFileCell__folder-text')).toBeDefined()
    expect(container.querySelectorAll('a')).toHaveLength(2)
    expect(container.querySelectorAll('a')[1]).toHaveAttribute('href', '/dashboard/folder/123456?platformId=gsuite')
  })

  it(`displays folder with disabled link if parentFolder.folderId and parentFolder.folderName are avaialble, but parentFolder.folderName is ${CONSTANTS.EXTERNAL_OR_UNKNOWN}`, async () => {
    const newFileMock = {
      ...fileMock,
      parentFolder: {
        folderId: '123456',
        folderName: CONSTANTS.EXTERNAL_OR_UNKNOWN
      }
    }
    const { container, findByText } = renderWithRouter(<SingleFileCell file={newFileMock} />)

    expect(await findByText(UI_STRINGS.FILE.EXTERNAL_OR_UNKNOWN)).toBeDefined()
    expect(container.querySelector('.SingleFileCell__folder-text')).toBeDefined()
    expect(container.querySelectorAll('a')).toHaveLength(1)
    expect(container.querySelectorAll('a')[1]).not.toBeDefined()
  })
})
