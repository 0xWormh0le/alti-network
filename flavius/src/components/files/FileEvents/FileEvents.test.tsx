import React from 'react'
import API from '@aws-amplify/api/lib'

import FileEvents, { FileEventsProps } from './FileEvents'
import { fileEventsResponse } from 'test/mocks'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('@aws-amplify/api/lib')

describe('FileEvents', () => {
  beforeEach(() => {
    // Mocking server response, to return an empty array
    const apiGet: any = API.get
    apiGet.mockResolvedValue({
      data: fileEventsResponse
    })
  })

  it('renders correctly', () => {
    const props: FileEventsProps = {
      fileId: '1ghSxcB-ETCezb9odJLeHJufyFrBC_cG3'
    }
    const { container } = renderWithRouter(<FileEvents {...props} />)
    expect(container).toMatchSnapshot()
  })
})
