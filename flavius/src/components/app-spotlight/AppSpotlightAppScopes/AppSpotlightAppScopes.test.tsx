import React from 'react'

import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightAppScopes from './AppSpotlightAppScopes'
import { ScopeCatalog } from 'models/ScopeCatalog'

describe('AppSpotlightAppScopes', () => {
  it('renders correctly', async () => {
    const scopes = Object.keys(ScopeCatalog)
    const { container } = renderWithRouter(<AppSpotlightAppScopes scopes={scopes} />)
    expect(container).toMatchSnapshot()
  })
})

describe('Grant access behavior', () => {
  it('changes content per item selection', async () => {
    const scopes = Object.keys(ScopeCatalog)
    const { container } = renderWithRouter(<AppSpotlightAppScopes scopes={scopes} />)

    const firstGrant = container.querySelectorAll('li')[0]

    expect(firstGrant).toHaveTextContent(scopes[0])
  })
})
