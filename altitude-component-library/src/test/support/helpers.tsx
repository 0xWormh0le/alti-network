// import React from 'react'
// import { Router } from 'react-router-dom'
import { render } from '@testing-library/react'
// import { RouterToUrlQuery } from 'react-url-query'
import { createMemoryHistory, MemoryHistory } from 'history'
import { MemoryRouter } from 'react-router-dom'

interface RouterArg {
  route?: string
  history?: MemoryHistory<any>
}

// handy function to use to test any component that relies on the router being in context
export function renderWithRouter(
  ui: JSX.Element,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }) }: RouterArg = {}
) {
  history = createMemoryHistory()
  history.push('/')
  return {
    ...render(ui, { wrapper: MemoryRouter }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  }
}

// tslint:disable-next-line no-empty
export const noop = () => {}
