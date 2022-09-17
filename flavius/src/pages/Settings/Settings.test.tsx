import React from 'react'
import { renderWithRouter } from 'test/support/helpers'
import Settings from './Settings'
import Auth from '@aws-amplify/auth'
import { act } from 'react-dom/test-utils'
import { RenderResult } from '@testing-library/react'

jest.mock('@aws-amplify/auth')

let renderResult: RenderResult

describe('Settings', () => {
  beforeEach(async () => {
    const authUser: any = Auth.currentAuthenticatedUser
    authUser.mockResolvedValue(true)

    await act(async () => {
      renderResult = renderWithRouter(<Settings />, { route: '/settings/accounts', mountRoute: '/settings' })
      await new Promise((r) => setTimeout(r, 100))
    })
  })

  it('renders correctly', async () => {
    const { container } = renderResult
    expect(container).toMatchSnapshot()
  })

  it('has password elements', async () => {
    const { getByText } = renderResult
    expect(getByText(/Current Password/i)).toBeInTheDocument()
    expect(getByText(/Confirm New Password/i)).toBeInTheDocument()
  })
})
