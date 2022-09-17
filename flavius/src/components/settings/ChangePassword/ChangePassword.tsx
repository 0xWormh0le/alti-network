import React from 'react'
import Auth from '@aws-amplify/auth'
import SectionTitle from 'components/elements/SectionTitle'
import Button from 'components/elements/Button'
import { alertError, alertSuccess } from 'util/alert'
import { checkPasswordStrength } from 'util/helpers'
import FormControl, { FormControlProps } from 'components/elements/FormControl'
import FormGroup from 'components/elements/FormGroup'
import FormLabel from 'components/elements/FormLabel'
import SetPasswordField from 'components/elements/SetPasswordField'
import UI_STRINGS from 'util/ui-strings'
import './ChangePassword.scss'

export interface ChangePasswordProps {
  user: SettingsUser
}

interface ChangePasswordState {
  isChanging: boolean
  oldPassword: string
  password: string
  confirmPassword: string
}

class ChangePassword extends React.Component<ChangePasswordProps, ChangePasswordState> {
  public state = {
    isChanging: false,
    oldPassword: '',
    password: '',
    confirmPassword: ''
  }

  private handleSaveChangesClick = async (event: React.FormEvent) => {
    const { user } = this.props
    const { oldPassword, password } = this.state
    event.preventDefault()

    this.setState({ isChanging: true })

    try {
      await Auth.changePassword(user, oldPassword, password)

      alertSuccess(UI_STRINGS.SETTINGS.CHANGE_PASSWORD_SUCCESS)
      this.setState({
        oldPassword: '',
        password: '',
        confirmPassword: ''
      })
    } catch (error) {
      if (error.code === 'NotAuthorizedException' || error.code === 'InvalidParameterException') {
        alertError(UI_STRINGS.SETTINGS.CURRENT_PASSWORD_INVALID)
      } else {
        alertError(error.message)
      }
    } finally {
      this.setState({ isChanging: false })
    }
  }

  private handleChange = (event: React.FormEvent<FormControlProps>): void => {
    switch (event.currentTarget.id) {
      case 'oldPassword':
        this.setState({
          oldPassword: event.currentTarget.value as string
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
      default:
        throw new Error(
          `Change password error: tried to assign a value to an unkown input field: ${event.currentTarget.id}`
        )
    }
  }

  private validateForm() {
    const { oldPassword, password, confirmPassword } = this.state
    const { valid } = checkPasswordStrength(password)
    const match = password === confirmPassword

    return oldPassword.length > 0 && valid && match
  }

  private checkPasswordMatch() {
    const { password, confirmPassword } = this.state
    const match = password === confirmPassword
    if (!match) {
      alertError(UI_STRINGS.SETTINGS.PASSWORD_MUST_MATCH)
    }
  }

  public render() {
    const { isChanging, password, oldPassword, confirmPassword } = this.state

    return (
      <div className='ChangePassword'>
        <SectionTitle titleText={UI_STRINGS.SETTINGS.CHANGE_PASSWORD} />
        <form className='ChangePassword__form' onSubmit={(event) => this.handleSaveChangesClick(event)}>
          <FormGroup controlId='oldPassword'>
            <FormLabel>{UI_STRINGS.SETTINGS.CURRENT_PASSWORD}</FormLabel>
            <FormControl
              type='password'
              value={oldPassword}
              autoComplete='current-password'
              onChange={this.handleChange}
              placeholder='•••••'
            />
          </FormGroup>
          <hr className='ChangePassword__separator' />
          <SetPasswordField
            label={UI_STRINGS.SETTINGS.NEW_PASSWORD}
            password={password}
            handleChange={this.handleChange}
          />
          <FormGroup controlId='confirmPassword'>
            <FormLabel>{UI_STRINGS.SETTINGS.CONFIRM_NEW_PASSWORD}</FormLabel>
            <FormControl
              type='password'
              value={confirmPassword}
              autoComplete='new-password'
              onBlur={() => this.checkPasswordMatch()}
              onChange={this.handleChange}
              placeholder='•••••'
            />
          </FormGroup>
          <Button
            className='ChangePassword__button'
            action='primary'
            disabled={!this.validateForm()}
            type='submit'
            isLoading={isChanging}
            text={UI_STRINGS.SETTINGS.SAVE_CHANGES}
            loadingText={UI_STRINGS.SETTINGS.CHANGING_PASSWORD}
          />
        </form>
      </div>
    )
  }
}

export default ChangePassword
