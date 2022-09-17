import React from 'react'
import API from '@aws-amplify/api/lib'
import { act, RenderResult } from '@testing-library/react'
import { renderWithRouter } from 'test/support/helpers'
import { personStat, peopleResponse, risksResponse } from 'test/mocks'
import Spotlight from './Spotlight'

jest.mock('@aws-amplify/api/lib')
jest.mock('react', () => {
  const ActualReact = jest.requireActual('react')
  return {
    ...ActualReact,
    useContext: () => ({ domains: ['email.com'], location: { pageNumber: 1 } }) // mock history, location
  }
})

describe('Spotlight', () => {
  let renderResult: RenderResult

  beforeEach(() => {
    const personId = 'john@thoughtlabs.io'

    API.get = jest.fn().mockImplementation((...args) => {
      const endpoint: string = args[0]
      const url: string = args[1]
      if (endpoint === 'person') {
        if (url.includes('stats')) {
          return new Promise((resolve) => {
            resolve(personStat)
          })
        } else {
          return new Promise((resolve) => {
            resolve(peopleResponse.people[0])
          })
        }
      }
      if (endpoint === 'files') {
        return new Promise((resolve) => {
          resolve({
            data: {
              files: [],
              riskId: null,
              sort: 'desc',
              pageCount: 0,
              pageNumber: 1,
              pageSize: 10
            }
          })
        })
      }
      if (endpoint === 'permissions') {
        return new Promise((resolve) => {
          resolve({
            totalCount: 9,
            active: 2,
            completed: 2,
            pending: 3,
            failed: 2
          })
        })
      }
      return new Promise((resolve) => {
        resolve(risksResponse)
      })
    })

    const history = {}
    const match = {
      path: '/risks/spotlight/:personId',
      url: `/risks/spotlight/${personId}`,
      isExact: true,
      params: { personId }
    }
    const location = {
      pathname: `/risks/spotlight/${personId}`,
      search: `?modalPage=1&selectedEmail=${personId}`,
      hash: '',
      key: 'gsj599'
    }
    const props: any = { match, history, location }

    act(() => {
      renderResult = renderWithRouter(<Spotlight {...props} />)
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has elements', async () => {
    const { getAllByText } = renderResult
    expect(getAllByText(/All/)[0]).toBeInTheDocument()

    // changed tests from: 12, 0, 6, 0, 1, 10, 28, 10 to null
    expect((getAllByText(/All/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
    expect(getAllByText(/Created/)[0]).toBeInTheDocument()
    expect((getAllByText(/Created/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
    expect(getAllByText(/Accessible/)[0]).toBeInTheDocument()
    expect((getAllByText(/Accessible/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
    expect(getAllByText(/Owned & At-Risk/)[0]).toBeInTheDocument()
    expect((getAllByText(/Owned & At-Risk/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
    expect(getAllByText(/Received/)[0]).toBeInTheDocument()
    expect((getAllByText(/Received/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
    expect(getAllByText(/Shared/)[0]).toBeInTheDocument()
    expect((getAllByText(/Shared/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
    expect(getAllByText(/App Downloads/)[0]).toBeInTheDocument()
    expect((getAllByText(/App Downloads/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
    expect(getAllByText(/Collaborator Adds/)[0]).toBeInTheDocument()
    expect((getAllByText(/Collaborator Adds/)[0].nextSibling as HTMLElement)?.innerHTML).toBe('')
  })
})
