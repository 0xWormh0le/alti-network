import React from 'react'
import { waitForElement, fireEvent } from '@testing-library/react'

import { renderWithRouter } from 'test/support/helpers'
import AppSpotlightGrantContainer from './AppSpotlightGrantContainer'

import { application } from 'test/mocks'

import { ScopeCatalog } from 'models/ScopeCatalog'

describe('AppSpotlightGrantContainer', () => {
  it('renders correctly', async () => {
    const { container } = renderWithRouter(<AppSpotlightGrantContainer app={application} loading={false} />)
    expect(container).toMatchSnapshot()
  })
})

describe('Grant access behavior', () => {
  it('initially, the first icon is selected', async () => {
    const { container } = renderWithRouter(<AppSpotlightGrantContainer app={application} loading={false} />)

    const appbarItem = await waitForElement(() => container.querySelectorAll('.AppSpotlightAppbarItem')[0])

    expect(appbarItem).toHaveClass('selected')
  })

  it('changes selected icon when another item is clicked', async () => {
    const { container, getByText } = renderWithRouter(<AppSpotlightGrantContainer app={application} loading={false} />)

    fireEvent.click(getByText(/sheets/i))

    const clickedItem = await waitForElement(() => container.querySelectorAll('.AppSpotlightAppbarItem')[1])
    expect(clickedItem).toHaveClass('selected')
  })

  it('changes content per item selection', async () => {
    const { container } = renderWithRouter(<AppSpotlightGrantContainer app={application} loading={false} />)

    const clickedItem = await waitForElement(() => container.querySelectorAll('.AppSpotlightAppbarItem')[0])

    fireEvent.click(clickedItem)

    const scopeContent = container.querySelectorAll('.AppSpotlightAppScopes')[0]
    const firstGrant = scopeContent.querySelectorAll('li')[0]
    const firstGrantDescription = ScopeCatalog[application.grants[0]].description

    expect(firstGrant).toHaveTextContent(firstGrantDescription)
  })
})
