import { render, RenderResult } from '@testing-library/react'
import API from '@aws-amplify/api/lib'
import React from 'react'
import { act } from 'react-dom/test-utils'
import useFileApiClient from 'api/clients/fileApiClient'

jest.mock('@aws-amplify/api/lib')

describe('Operates as expected in components', () => {
  const TestPage: React.FC<any> = (props) => {
    const client = useFileApiClient({
      defaultPageSize: 10
    })
    const [rs] = client.useGetFile('', '')

    return <div>{rs && rs.fileName}</div>
  }

  let renderResult: RenderResult

  beforeEach(async () => {
    // @ts-ignore
    API.get.mockResolvedValue({ fileName: 'test' })

    await act(async () => {
      renderResult = render(<TestPage />)
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('Returns response', () => {
    const { container } = renderResult

    expect(container.getElementsByTagName('div')[0]).toContainHTML('<div>test</div>')
  })
})
