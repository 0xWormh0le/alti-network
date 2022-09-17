import React from 'react'
import SignupComp from './Signup'
import { withRouter } from 'react-router-dom'
import { renderWithRouter } from 'test/support/helpers'

jest.mock('@aws-amplify/api/lib')
const userHasAuthenticated = jest.fn()

describe('Signup', () => {
  it('renders correctly', () => {
    const Signup = withRouter(SignupComp)
    const { container } = renderWithRouter(<Signup userHasAuthenticated={userHasAuthenticated} />)
    expect(container).toMatchSnapshot()
  })
})
