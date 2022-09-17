import React from 'react'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from 'test/support/helpers'
import AppSpotlight from './AppSpotlight'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'
import { applicationStat, appResponse, peopleResponse } from 'test/mocks'

jest.mock('@aws-amplify/api/lib')

let renderResult: RenderResult

describe('AppSpotlight', () => {
  beforeEach(async () => {
    const appId = '19570130570'

    API.get = jest.fn().mockImplementation((...args) => {
      const url: string = args[1]
      if (url.includes('stats')) return new Promise((resolve) => resolve(applicationStat))
      if (url.includes('people')) return new Promise((resolve) => resolve(peopleResponse))
      return new Promise((resolve) => resolve(appResponse))
    })

    await act(async () => {
      const history = {}
      const match = {
        path: '/risks/app-spotlight/:appId',
        url: `/risks/app-spotlight/${appId}`,
        isExact: true,
        params: { applicationId: appId }
      }
      const location = {
        pathname: `/risks/app-spotlight/${appId}`,
        search: `?modalPage=1`,
        hash: '',
        key: 'gsj599'
      }
      const props: any = { match, history, location }
      renderResult = renderWithRouter(<AppSpotlight {...props} />)
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has elements', async () => {
    const { getByTestId } = renderResult
    const appTitleElement = getByTestId('apptitle')
    expect(appTitleElement.innerHTML).toBe(appResponse.name)
    // peopleResponse.people.forEach(( { person }: { person: IPerson }) => {
    //   if (person.name.givenName) {
    //     expect(getAllByText(`${person.name.givenName} ${person.name.familyName}`)[0]).toBeInTheDocument()
    //   }
    // })
  })
})
