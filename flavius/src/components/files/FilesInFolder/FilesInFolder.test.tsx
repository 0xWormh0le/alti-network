import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import FilesInFolder, { FileInFolderProps } from './FilesInFolder'
import { act, waitForElement } from '@testing-library/react'

describe('FilesInFolder', () => {
  const props = {
    fileId: 'sample-id',
    folderId: '25551212',
    folderName: '25sensitivefiles'
  } as FileInFolderProps

  it('renders correctly', () => {
    const { container } = renderWithRouter(<FilesInFolder {...props} />)
    expect(container).toMatchSnapshot()
  })
  it('should display 25sensitivefiles for folder name', async () => {
    const { getByTestId } = renderWithRouter(<FilesInFolder {...props} />)
    await act(async () => {
      const element = await waitForElement(() => getByTestId('folderList'))
      expect(element).toBeDefined()
    })
  })
})
