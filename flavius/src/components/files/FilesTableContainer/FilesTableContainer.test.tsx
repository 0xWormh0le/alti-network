import React from 'react'
import API from '@aws-amplify/api/lib'

import { filesResponse } from 'test/mocks'
import FilesTableContainer, { FilesTableContainerProps } from './FilesTableContainer'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('@aws-amplify/api/lib')

const props: FilesTableContainerProps = {
  riskId: '1ghSxcB-ETCezb9odJLeHJufyFrBC_cG3'
}

describe('FilesTableContainer', () => {
  beforeEach(() => {
    // Mocking server response, to return an empty array
    const apiGet: any = API.get
    apiGet.mockResolvedValue({
      data: filesResponse
    })
  })

  it('renders correctly', () => {
    const { container } = renderWithRouter(<FilesTableContainer {...props} />)
    expect(container).toMatchSnapshot()
  })
})
