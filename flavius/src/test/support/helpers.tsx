import React from 'react'
import { render } from '@testing-library/react'
import { createMemoryHistory, MemoryHistory } from 'history'
import { Route, MemoryRouter } from 'react-router-dom'

interface RouterArg {
  route?: string
  mountRoute?: string
  history?: MemoryHistory<any>
}

// handy function to use to test any component that relies on the router being in context
export function renderWithRouter(
  ui: JSX.Element,
  { route = '/', history = createMemoryHistory({ initialEntries: [route] }), mountRoute }: RouterArg = {}
) {
  history = createMemoryHistory()
  history.push('/')
  return {
    ...render(ui, {
      wrapper: (props) => (
        <MemoryRouter {...props} initialEntries={[route]}>
          <Route path={mountRoute}>{props.children}</Route>
        </MemoryRouter>
      )
    }),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history
  }
}

// tslint:disable-next-line no-empty
