import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import { UserContextProvider } from 'models/UserContext'
import Sidebar from './Sidebar'
import { VisibilityLevel, VISIBILITY_LEVEL_ATTRIBUTE } from 'models/Visibility'

const userNoVisibilityLevel = {
  attributes: {
    name: 'John Doe'
  }
}

const userVisibilityLevelHigh = {
  attributes: {
    name: 'John Doe',
    [VISIBILITY_LEVEL_ATTRIBUTE]: VisibilityLevel.HIGH
  }
}

const userVisibilityLevelMedium = {
  attributes: {
    name: 'John Doe',
    [VISIBILITY_LEVEL_ATTRIBUTE]: VisibilityLevel.MEDIUM
  }
}

const userVisibilityLevelLow = {
  attributes: {
    name: 'John Doe',
    [VISIBILITY_LEVEL_ATTRIBUTE]: VisibilityLevel.LOW
  }
}

function renderSidebar(authenticatedUser) {
  return (
    <UserContextProvider value={{ authenticatedUser }}>
      <Sidebar />
    </UserContextProvider>
  )
}

// Basic example use on how to do snapshot testing on components
it('renders correctly with a user with no visibility level', () => {
  const { container } = renderWithRouter(renderSidebar(userNoVisibilityLevel))
  expect(container.firstChild).toMatchSnapshot()
})

describe('Visibility levels', () => {
  it('renders all menu items when the visibility level is `high`', () => {
    const { container } = renderWithRouter(renderSidebar(userVisibilityLevelHigh))
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders some menu items when the visibility level is `medium`', () => {
    const { container } = renderWithRouter(renderSidebar(userVisibilityLevelMedium))
    expect(container.firstChild).toMatchSnapshot()
  })

  it('renders some menu items when the visibility level is `low`', () => {
    const { container } = renderWithRouter(renderSidebar(userVisibilityLevelLow))
    expect(container.firstChild).toMatchSnapshot()
  })
})
