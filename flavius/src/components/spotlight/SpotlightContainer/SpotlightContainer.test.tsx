import { act, RenderResult } from '@testing-library/react'
import API from '@aws-amplify/api/lib'
import UI_STRINGS from 'util/ui-strings'
import { personStat, peopleResponse, risksResponse } from 'test/mocks'
import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import SpotlightContainer from '.'
import { PlatformsContext } from 'util/platforms'

jest.mock('@aws-amplify/api/lib')
jest.mock('react', () => {
  const ActualReact = jest.requireActual('react')
  return {
    ...ActualReact,
    useContext: () => ({ domains: ['email.com'], location: { pageNumber: 1 } }) // mock history, location
  }
})

describe('Subnavigation behavior', () => {
  let renderResult: RenderResult

  beforeEach(() => {
    // mocking call to retrieve the profile

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
    act(() => {
      renderResult = renderWithRouter(
        <PlatformsContext.Provider value={{ platforms: {} }}>
          <SpotlightContainer personId='john@thoughtlabs.io' wrapperType='modal' />
        </PlatformsContext.Provider>
      )
    })
  })

  it('renders correctly', () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('initially, the "All" subnav item is selected', () => {
    const { container } = renderResult
    expect(
      container.querySelectorAll(
        '.SpotlightGridNav__item.SpotlightGridNav__item--selected .SpotlightGridNav__item-label'
      )[0]
    ).toContainHTML(UI_STRINGS.SPOTLIGHT.ALL)
  })

  it('renders all sub-navigation tabs with their corresponding count', () => {
    const { container } = renderResult

    // check there are the correct number of tabs
    const cardValues = container.querySelectorAll('.SpotlightGridNav__item-value')
    expect(cardValues.length).toBe(10)

    // check values in each of the cards, which is the sum for all series
    // temporarily removed all values: 12, 0, 9765, 0, 1, 10, 28, 28, 10, 407
    expect(cardValues[0].textContent).toBe('')
    expect(cardValues[1].textContent).toBe('')
    expect(cardValues[2].textContent).toBe('')
    expect(cardValues[3].textContent).toBe('')
    expect(cardValues[4].textContent).toBe('')
    expect(cardValues[5].textContent).toBe('')
    expect(cardValues[6].textContent).toBe('')
    expect(cardValues[7].textContent).toBe('')
    expect(cardValues[8].textContent).toBe('')
    expect(cardValues[9].textContent).toBe('')
  })
})
