import React from 'react'
import { fireEvent, waitForElement } from '@testing-library/react'
import Auth from '@aws-amplify/auth'
import API from '@aws-amplify/api/lib'
import { renderWithRouter } from '../../test/support/helpers'
import UI_STRINGS from 'util/ui-strings'
import Login from '.'

jest.mock('@aws-amplify/api/lib')

let userHasAuthenticated = jest.fn()
const location = {
  state: {
    from: { pathname: '/dashboard' }
  }
}
const userTest = {
  username: 'test',
  id: 'user-test-id',
  attributes: {
    email: 'test@example.com',
    name: 'Test',
    phoneNumber: '+9174445555'
  }
}
const userTest2 = {
  username: 'test2',
  id: 'user-test2-id',
  attributes: {
    email: 'test2@example.com',
    name: 'Test2',
    phoneNumber: '+9174443333'
  }
}

describe('when 2FA is disabled', () => {
  beforeEach(() => {
    userHasAuthenticated = jest.fn()

    // Mocking the functions from aws-amplify
    Auth.signIn = jest.fn().mockResolvedValue({ username: 'test' })
    Auth.currentUserInfo = jest.fn().mockResolvedValue(userTest)

    const analyticsMethod = jest.fn()

    window.analytics = {
      identify: analyticsMethod,
      track: analyticsMethod,
      alias: analyticsMethod,
      page: analyticsMethod
    }
  })

  it('calls Auth.signIn(), and also calls `userHasAuthenticated()`', async () => {
    const { getByTestId, getByLabelText, container } = renderWithRouter(
      <Login location={location} userHasAuthenticated={userHasAuthenticated} />
    )
    expect(container).toMatchSnapshot()

    // Fill in email and password, use fireEvent because they are controlled inputs
    const emailElement = getByLabelText(/email/i)
    fireEvent.change(emailElement, { target: { value: 'test@example.com' } })
    const passwordElement = getByLabelText(/password/i)
    fireEvent.change(passwordElement, { target: { value: 'Passw0rd!' } })

    // Get the form
    const form = getByTestId('login-credentials-form')
    // Wait for the Promise to resolve, after the form is submitted
    await waitForElement(() => fireEvent.submit(form))

    // Assert that functions have been called
    // expect(Auth.signIn).toHaveBeenCalledTimes(1)
    expect(Auth.signIn).toHaveBeenCalledWith('test@example.com', 'Passw0rd!')
    expect(Auth.currentUserInfo).toHaveBeenCalled()

    expect(userHasAuthenticated).toHaveBeenCalledWith(userTest)
  })

  it('enables Login button only when email is valid', () => {
    const { getByText, getByLabelText, container } = renderWithRouter(
      <Login location={location} userHasAuthenticated={userHasAuthenticated} />
    )
    expect(container).toMatchSnapshot()
    const loginButton = getByText(UI_STRINGS.LOGIN.LOGIN)

    // Fill in email and password, use fireEvent because they are controlled inputs
    const emailElement = getByLabelText(/email/i)
    fireEvent.change(emailElement, { target: { value: 'INVALID_EMAIL' } })
    const passwordElement = getByLabelText(/password/i)
    fireEvent.change(passwordElement, { target: { value: 'Passw0rd!' } })

    expect(loginButton).toBeDisabled()

    // Update email
    fireEvent.change(emailElement, { target: { value: 'test@example.com' } })

    expect(loginButton).toBeEnabled()
  })
})

describe('when 2FA is enabled', () => {
  beforeEach(() => {
    const apiMethod = API.post

    apiMethod.mockResolvedValueOnce({})

    userHasAuthenticated = jest.fn()

    // Mocking the functions from aws-amplify
    Auth.signIn = jest.fn().mockResolvedValue({ username: 'test2', challengeName: 'SOFTWARE_TOKEN_MFA' })
    Auth.confirmSignIn = jest.fn().mockResolvedValue('SUCCESS')
    Auth.currentUserInfo = jest.fn().mockResolvedValue(userTest2)
  })

  it('calls Auth.confirmSignIn(), and also calls `userHasAuthenticated()`', async () => {
    const { getByLabelText, getByText, getByTestId, container } = renderWithRouter(
      <Login location={location} userHasAuthenticated={userHasAuthenticated} />
    )
    expect(container).toMatchSnapshot()

    // Fill in email and password, use fireEvent because they are controlled inputs
    const emailElement = getByLabelText(/email/i)
    fireEvent.change(emailElement, { target: { value: 'test2@example.com' } })
    const passwordElement = getByLabelText(/password/i)
    fireEvent.change(passwordElement, { target: { value: 'Passw0rd!' } })

    // Wait for the Promise to resolve, after the form is submitted
    fireEvent.click(getByText(UI_STRINGS.LOGIN.LOGIN))
    const confirmationCodeElement = await waitForElement(() => getByLabelText(/confirmation code/i))

    // Assert there is a field for the confirmation code
    expect(confirmationCodeElement).toBeInTheDocument()

    // Fill in confirmation code
    fireEvent.change(confirmationCodeElement, { target: { value: '123456' } })

    // Get the form
    const form = getByTestId('login-confirmation-form')
    // Wait for the Promise to resolve, after the form is submitted
    await waitForElement(() => fireEvent.submit(form))

    // Assert that functions have been called
    // expect(Auth.confirmSignIn).toHaveBeenCalledTimes(1)
    expect(Auth.confirmSignIn).toHaveBeenCalledWith(
      {
        username: 'test2',
        challengeName: 'SOFTWARE_TOKEN_MFA'
      },
      '123456',
      'SOFTWARE_TOKEN_MFA'
    )
    expect(Auth.currentUserInfo).toHaveBeenCalled()

    expect(userHasAuthenticated).toHaveBeenCalledWith(userTest2)
  })
})
