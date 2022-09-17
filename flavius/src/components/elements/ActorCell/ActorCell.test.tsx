import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { renderWithRouter } from 'test/support/helpers'
import { render, act, waitForElement } from '@testing-library/react'
import ActorCell, { ActorCellProps } from './ActorCell'
import { ActorData } from 'test/mocks'
import { UsageKind } from 'types/common'

const actorCellProps: ActorCellProps = {
  value: {
    get: (x) => {
      if (x === 'name') return new Map(['familyName', 'givenName', 'fullName'].map((y) => [y, y]))
      if (x === 'primaryEmail' || x === 'recoveryEmail')
        return new Map<string, any>([
          ['address', 'email@email.com'],
          ['accessCount', 12],
          ['riskCount', 123],
          ['lastDeletedPermissions', 123],
          ['primary', true],
          ['kind', UsageKind.work]
        ])
      if (x === 'avatar') return new Map<string, any>()
      if (x === 'emails') return new Map<string, any>([])
      if (x === 'phones') return new Map<string, any>([])
      if (x === 'externalIds') return new Map<string, any>([])
      if (x === 'notes') return new Map<string, any>([])

      return x
    }
  }
}

describe('ActorCell Unit Tests', () => {
  it('renders correctly', () => {
    const props: ActorCellProps = actorCellProps
    const { container } = renderWithRouter(<ActorCell {...props} />)
    expect(container).toMatchSnapshot()
  })

  it('asserts actor cell is defined and displayed', async () => {
    const props: ActorCellProps = actorCellProps
    const { getByTestId } = render(
      <Router>
        <ActorCell {...props} />
      </Router>
    )
    await act(async () => {
      const element = await waitForElement(() => getByTestId('actorCellContainer'))
      expect(element).toBeDefined()
    })
  })

  it('shows actor cell has an anonymous user', async () => {
    const props = {
      value: null
    }
    const { getByTestId } = render(
      <Router>
        <ActorCell {...(props as any)} />
      </Router>
    )
    await act(async () => {
      await waitForElement(() => getByTestId('actorCellContainer'))
      const component = await waitForElement(() => getByTestId('actorFullName'))
      expect(component).toHaveTextContent('Anonymous User')
    })
  })

  it('shows actor cell has an actor named John Smith', async () => {
    const { getByTestId } = render(
      <Router>
        <ActorCell {...(ActorData.actorProps as any)} />
      </Router>
    )
    await act(async () => {
      await waitForElement(() => getByTestId('actorCellContainer'))
      const component = await waitForElement(() => getByTestId('actorFullName'))
      expect(component).toHaveTextContent('John Smith')
    })
  })
})
