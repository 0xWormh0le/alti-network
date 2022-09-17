import React from 'react'
import { render, fireEvent, wait } from '@testing-library/react'
import Auth from '@aws-amplify/auth'
import TwoFactorAuthentication from '../TwoFactorAuthentication'

const userWithout2FA = {
  username: 'test',
  preferredMFA: 'NOMFA',
  attributes: {
    email: 'test@example.com',
    email_verified: true,
    name: 'Test',
    phoneNumber: '+9174445555',
    phoneNumber_verified: true,
    sub: 'test',
  },
}

const userWith2FA = {
  username: 'test2',
  preferredMFA: 'TOTP',
  attributes: {
    email: 'test2@example.com',
    email_verified: true,
    name: 'Test2',
    phoneNumber: '+9174443332',
    phoneNumber_verified: true,
    sub: 'test2',
  },
}

describe('When 2FA is enabled', () => {
  beforeEach(() => {
    // mocking the functions from aws-amplify
    Auth.signIn = jest.fn().mockResolvedValue({ username: 'test2' })
    Auth.confirmSignIn = jest.fn().mockResolvedValue('SUCCESS')
    Auth.setPreferredMFA = jest.fn().mockResolvedValue('SUCCESS')
  })

  it('renders correctly', () => {
    const { container } = render(<TwoFactorAuthentication user={userWith2FA} />)
    expect(container).toMatchSnapshot()
  })

  it('renders a button that can be used to disable 2FA', () => {
    const { getByText } = render(<TwoFactorAuthentication user={userWith2FA} />)
    const mainButton = getByText(/Disable 2FA/i)
    expect(mainButton).toBeInTheDocument()
  })

  it('there is a "Disable" step which asks for your password and code before disabling 2FA', async () => {
    const { getByLabelText, getByText, getByTestId, queryByText } = render(
      <TwoFactorAuthentication user={userWith2FA} />
    )

    fireEvent.click(getByText(/Disable 2FA/i))
    expect(getByText(/Disable Two-Factor Authentication/i)).toBeInTheDocument()

    // fill in the password and the confirmation code
    const passwordElement = getByLabelText(/password/i)
    fireEvent.change(passwordElement, { target: { value: 'Passw0rd!' } })
    const challengeElement = getByLabelText(/confirmation code/i)
    fireEvent.change(challengeElement, { target: { value: '123654' } })

    // click on confirm button, and then wait until all callbacks are executed
    fireEvent.click(getByTestId('confirm-disable-button'))

    // wait for the callbacks to execute
    await wait(() => expect(queryByText(/confirming/i)).not.toBeInTheDocument())

    expect(Auth.signIn).toHaveBeenCalledWith('test2', 'Passw0rd!')
    expect(Auth.confirmSignIn).toHaveBeenCalledWith({ username: 'test2' }, '123654', 'SOFTWARE_TOKEN_MFA')
    expect(Auth.setPreferredMFA).toHaveBeenCalledWith(userWith2FA, 'NOMFA')
  })
})

describe('When 2FA is disabled', () => {
  it('renders a button that can be used to enable 2FA', () => {
    const { getByText } = render(<TwoFactorAuthentication user={userWithout2FA} />)
    const mainButton = getByText(/Enable 2FA/i)
    expect(mainButton).toBeInTheDocument()
  })
})
