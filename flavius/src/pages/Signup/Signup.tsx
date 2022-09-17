import React from 'react'
import Auth from '@aws-amplify/auth'
import FormControl, { FormControlProps } from 'components/elements/FormControl'
import FormGroup from 'components/elements/FormGroup'
import FormLabel from 'components/elements/FormLabel'
import Actionbar from 'components/base/Actionbar'
import Button from 'components/elements/Button'
import { alertError, alertInfo } from 'util/alert'
import { ISignUpResult } from 'amazon-cognito-identity-js'
import { RouteComponentProps } from 'react-router'
import { SetAuthenticatedUser } from 'models/UserContext'
import SetPasswordField from 'components/elements/SetPasswordField'
import BasePage from '../BasePage'
import config from 'config'
import UI_STRINGS from 'util/ui-strings'

import './Signup.scss'

interface SignupProps extends RouteComponentProps {
  userHasAuthenticated: SetAuthenticatedUser
}

interface SignupState {
  isLoading: boolean
  fullName: string
  email: string
  phoneNumber: string
  userName: string
  password: string
  confirmPassword: string
  confirmationCode: string
  newUser: ISignUpResult | null
  passwordStrength: 0 | 1 | 2 | 3 | 4
}

export default class Signup extends BasePage<SignupProps, SignupState> {
  protected pageName = config.navigationItemsNames.SIGN_UP

  constructor(props: SignupProps) {
    super(props)
    this.state = {
      isLoading: false,
      fullName: '',
      email: '',
      phoneNumber: '',
      userName: '',
      password: '',
      confirmPassword: '',
      confirmationCode: '',
      newUser: null,
      passwordStrength: 0
    }
  }

  public renderPageContent() {
    const { newUser } = this.state
    return (
      <div className='Signup'>
        <Actionbar titleComponent={UI_STRINGS.SIGNUP.SIGNUP} />
        <div className='Signup__form'>{newUser === null ? this.renderForm() : this.renderConfirmationForm()}</div>
      </div>
    )
  }

  private handleChange = (event: React.FormEvent<FormControlProps>) => {
    switch (event.currentTarget.id) {
      case 'fullName':
        this.setState({
          fullName: event.currentTarget.value as string
        })
        break
      case 'email':
        this.setState({
          email: event.currentTarget.value as string
        })
        break
      case 'userName':
        this.setState({
          userName: event.currentTarget.value as string
        })
        break
      case 'password':
        this.setState({
          password: event.currentTarget.value as string
        })
        break
      case 'confirmPassword':
        this.setState({
          confirmPassword: event.currentTarget.value as string
        })
        break
      case 'confirmationCode':
        this.setState({
          confirmationCode: event.currentTarget.value as string
        })
        break
      default:
        throw new Error('Signup error: tried to assign a value to an unkown input field')
    }
  }

  private handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const { fullName, email, phoneNumber, userName, password } = this.state
    this.setState({ isLoading: true })
    try {
      const newUser = await Auth.signUp({
        username: userName,
        password,
        attributes: {
          name: fullName,
          email,
          phone_number: phoneNumber
        }
      })
      this.setState({ newUser })
    } catch (error) {
      if (error.code === 'UsernameExistsException') {
        // if the username exists, attempt to resend code
        try {
          alertInfo(UI_STRINGS.SIGNUP.USER_ALREADY_EXISTS)
          await Auth.resendSignUp(userName)
        } catch (resendCodeError) {
          alertError(resendCodeError.message)
        }
      } else {
        alertError(error.message)
      }
    }
    this.setState({ isLoading: false })
  }

  private handleConfirmationSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const { userName, confirmationCode, password } = this.state
    const { userHasAuthenticated, history } = this.props
    this.setState({ isLoading: true })
    try {
      await Auth.confirmSignUp(userName, confirmationCode)
      await Auth.signIn(userName, password)
      const user = await Auth.currentUserInfo()
      userHasAuthenticated(user)
      history.push('/dashboard')
    } catch (error) {
      alertError(error.message)
      this.setState({ isLoading: false })
    }
  }

  private validateForm() {
    const { fullName, email, phoneNumber, userName, password, confirmPassword } = this.state
    // TODO: do a more complex validation using validate.js module
    return (
      fullName.length > 0 &&
      email.length > 0 &&
      phoneNumber.length > 0 &&
      userName.length > 0 &&
      password.length > 0 &&
      password === confirmPassword
    )
  }

  private validateConfirmationForm() {
    const { confirmationCode } = this.state
    return confirmationCode.length > 0
  }

  private renderConfirmationForm() {
    const { confirmationCode, isLoading } = this.state
    return (
      <form onSubmit={this.handleConfirmationSubmit}>
        <FormGroup controlId='confirmationCode'>
          <FormLabel>{UI_STRINGS.LOGIN.CONFIRMATION_CODE}</FormLabel>
          <FormControl autoFocus={true} type='tel' value={confirmationCode} onChange={this.handleChange} />
          <div className='text-muted'>{UI_STRINGS.SIGNUP.PLEASE_CHECK_EMAIL_FOR_CODE}</div>
        </FormGroup>
        <Button
          className='Signup__button'
          action='primary'
          disabled={!this.validateConfirmationForm()}
          type='submit'
          isLoading={isLoading}
          text={UI_STRINGS.BUTTON_LABELS.VERIFY}
          loadingText={UI_STRINGS.SETTINGS.VERIFYING}
        />
      </form>
    )
  }

  private renderForm() {
    const { isLoading, fullName, email, phoneNumber, userName, password, confirmPassword } = this.state
    return (
      <form onSubmit={this.handleSubmit}>
        <FormGroup controlId='fullName'>
          <FormLabel>{UI_STRINGS.SIGNUP.FULL_NAME}</FormLabel>
          <FormControl autoFocus={true} value={fullName} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup controlId='phoneNumber'>
          <FormLabel>{UI_STRINGS.SIGNUP.PHONE_NUMBER}</FormLabel>
          <FormControl
            type='tel'
            placeholder='Valid format: +14325551212'
            value={phoneNumber}
            onChange={this.handleChange}
          />
        </FormGroup>
        <FormGroup controlId='email'>
          <FormLabel>{UI_STRINGS.LOGIN.EMAIL}</FormLabel>
          <FormControl type='email' value={email} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup controlId='userName'>
          <FormLabel>{UI_STRINGS.SIGNUP.USERNAME}</FormLabel>
          <FormControl value={userName} onChange={this.handleChange} />
        </FormGroup>
        <FormGroup controlId='password'>
          <SetPasswordField password={password} handleChange={this.handleChange} />
        </FormGroup>
        <FormGroup controlId='confirmPassword'>
          <FormLabel>{UI_STRINGS.SIGNUP.CONFIRM_PASSWORD}</FormLabel>
          <FormControl value={confirmPassword} type='password' onChange={this.handleChange} />
        </FormGroup>
        <Button
          className='Signup__button'
          action='primary'
          disabled={!this.validateForm()}
          type='submit'
          isLoading={isLoading}
          text={UI_STRINGS.SIGNUP.SIGNUP}
          loadingText={UI_STRINGS.SIGNUP.SIGNING_UP}
        />
      </form>
    )
  }
}
