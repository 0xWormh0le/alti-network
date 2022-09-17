import React from 'react'

import ViewIcon from 'icons/view'
import HideIcon from 'icons/hide'
import FormControl, { FormControlProps } from 'components/elements/FormControl'
import FormGroup from 'components/elements/FormGroup'
import FormLabel from 'components/elements/FormLabel'
import { checkPasswordStrength } from 'util/helpers'
import './SetPasswordField.scss'

export interface SetPasswordFieldProps {
  password: string
  handleChange: (event: React.FormEvent<FormControlProps>) => void
  label?: string
}

interface SetPasswordFieldState {
  strength: -1 | PasswordScore
  plaintext: boolean
}

export class SetPasswordField extends React.Component<SetPasswordFieldProps, SetPasswordFieldState> {
  public state: SetPasswordFieldState = {
    strength: -1,
    plaintext: false
  }

  private handleBlur = (event: React.FormEvent<FormControlProps>): void => {
    const { password } = this.props
    const { valid, score } = checkPasswordStrength(password)

    this.setState({
      strength: valid ? score : 0
    })
  }

  private strengthLevelName() {
    const { strength } = this.state
    switch (strength) {
      case 4:
        return 'strong'
      case 3:
        return 'good'
      case 2:
        return 'fair'
      case 1:
      case 0:
        return 'weak'
      default:
        return ''
    }
  }

  private renderViewHidePassword() {
    return this.state.plaintext ? (
      <ViewIcon className='SetPasswordField__toggle-plaintext' />
    ) : (
      <HideIcon className='SetPasswordField__toggle-plaintext' />
    )
  }

  private togglePlaintext = () => {
    this.setState(state => ({
      plaintext: !state.plaintext
    }))
  }

  public render() {
    const { password, label, handleChange } = this.props
    const { plaintext } = this.state
    const strengthName = this.strengthLevelName()

    return (
      <FormGroup controlId='password'>
        <FormLabel>{label || 'Password'}</FormLabel>
        <FormControl
          value={password}
          type={plaintext ? 'text' : 'password'}
          onBlur={this.handleBlur}
          autoComplete='new-password'
          onChange={handleChange}
          placeholder='•••••'
        />
        <div onClick={this.togglePlaintext}>{this.renderViewHidePassword()}</div>
        <div className='SetPasswordField__strength-indicator-wrapper'>
          <div className={`SetPasswordField__strength-label SetPasswordField__strength-label--${strengthName}`}>
            {strengthName}
          </div>
          <div
            className={`SetPasswordField__strength-indicator SetPasswordField__strength-indicator--${strengthName}`}
          />
        </div>
        <ul className='SetPasswordField__helper-text'>
          <li>Passwords must be 10 or more characters.</li>
          <li>Passwords cannot be 'weak'</li>
          <li>Enabling 2FA greatly improves security.</li>
        </ul>
      </FormGroup>
    )
  }
}

export default SetPasswordField
