import React from 'react'
import { render, fireEvent, waitForElement } from '@testing-library/react'
import Auth from '@aws-amplify/auth'
import ChangePassword from './ChangePassword'

const user = {
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

beforeEach(() => {
  // mocking the functions from aws-amplify
  Auth.changePassword = jest.fn().mockResolvedValue('SUCCESS')
})

it('renders correctly', () => {
  const { container } = render(<ChangePassword user={user} />)
  expect(container).toMatchSnapshot()
})

it('renders three password inputs on the component', () => {
  const { getByLabelText, getAllByLabelText } = render(<ChangePassword user={user} />)

  // get the three password fields
  const oldPasswordElement = getByLabelText(/current password/i)
  const newPasswordElement = getAllByLabelText(/new password/i)[0]
  const confirmNewPasswordElement = getByLabelText(/confirm new password/i)

  // confirm they are on the page
  expect(oldPasswordElement).toBeInTheDocument()
  expect(newPasswordElement).toBeInTheDocument()
  expect(confirmNewPasswordElement).toBeInTheDocument()
})

it('does not allow to click "Save changes" button if the password is not at 10 characters long', () => {
  const { getByLabelText, getAllByLabelText, getByText } = render(<ChangePassword user={user} />)

  // get the three password fields, and fill them in
  const oldPasswordElement = getByLabelText(/current password/i)
  const newPasswordElement = getAllByLabelText(/new password/i)[0]
  const confirmNewPasswordElement = getByLabelText(/confirm new password/i)

  fireEvent.change(oldPasswordElement, { target: { value: 'oldPassw0rd!#$' } })
  fireEvent.change(newPasswordElement, { target: { value: 'shortpass' } }) // less than 10 chars
  fireEvent.change(confirmNewPasswordElement, { target: { value: 'shortpass' } })

  // assert that the button is not clickable
  expect(getByText(/save changes/i)).toBeDisabled()
})

it('does not allow to click "Save changes" button if the password is too weak', () => {
  const { getByLabelText, getAllByLabelText, getByText } = render(<ChangePassword user={user} />)

  // get the three password fields, and fill them in
  const oldPasswordElement = getByLabelText(/current password/i)
  const newPasswordElement = getAllByLabelText(/new password/i)[0]
  const confirmNewPasswordElement = getByLabelText(/confirm new password/i)

  fireEvent.change(oldPasswordElement, { target: { value: 'oldPassw0rd!#$' } })
  fireEvent.change(newPasswordElement, { target: { value: 'Weakpassword1' } }) // weak password, +10 chars
  fireEvent.change(confirmNewPasswordElement, { target: { value: 'Weakpassword1' } })

  // assert that the button is not clickable
  expect(getByText(/save changes/i)).toBeDisabled()
})

it('correctly calls Cognito API when the button is clicked', async () => {
  const { getByLabelText, getAllByLabelText, getByText } = render(<ChangePassword user={user} />)

  // get the three password fields, and fill them in
  const oldPasswordElement = getByLabelText(/current password/i)
  const newPasswordElement = getAllByLabelText(/new password/i)[0]
  const confirmNewPasswordElement = getByLabelText(/confirm new password/i)

  fireEvent.change(oldPasswordElement, { target: { value: 'oldPassw0rd!#$' } })
  fireEvent.change(newPasswordElement, { target: { value: 'n3wPassw0rdLargerThan10Chars' } })
  fireEvent.change(confirmNewPasswordElement, { target: { value: 'n3wPassw0rdLargerThan10Chars' } })

  // click on the button, to trigger request and wait for the Promises to resolve
  await waitForElement(() => fireEvent.click(getByText(/save changes/i)))

  // assert that the API functions are called
  expect(Auth.changePassword).toHaveBeenCalledWith(user, 'oldPassw0rd!#$', 'n3wPassw0rdLargerThan10Chars')
})
