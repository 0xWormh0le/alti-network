import React from 'react'
import Auth from '@aws-amplify/auth'

import { alertError, alertSuccess } from 'util/alert'
import { FormControlProps } from 'components/elements/FormControl'
import { TOTP_MFA_TYPE } from 'pages/Login'
import Button from 'components/elements/Button'
import CongratsStep from '../CongratsStep'
import DisableStep from '../DisableStep'
import HowItWorksStep from '../HowItWorksStep'
import ScanQrCodeStep from '../ScanQrCodeStep'
import SectionTitle from 'components/elements/SectionTitle'
import VerifyStep from '../VerifyStep'
import UI_STRINGS from 'util/ui-strings'

import './TwoFactorAuthentication.scss'

type ConfigurationStep = 'initial' | 'howitworks' | 'scanqr' | 'verify' | 'congrats' | 'disable'

export interface TwoFactorAuthenticationProps {
  user: SettingsUser
}

interface TwoFactorAuthenticationState {
  enabled: boolean
  step: ConfigurationStep
  authCode: string
  challengeAnswer: string
  password: string
  buttonLoading: boolean
}

class TwoFactorAuthentication extends React.Component<TwoFactorAuthenticationProps, TwoFactorAuthenticationState> {
  public state: TwoFactorAuthenticationState = {
    enabled: false,
    step: 'initial',
    authCode: '',
    challengeAnswer: '',
    password: '',
    buttonLoading: false
  }

  public async componentDidMount() {
    // check whether 2fa is enabled for this user
    const { user } = this.props
    this.setState({ enabled: user.preferredMFA !== 'NOMFA' })
  }

  private alertErrorAndSetInitialState(errorMessage: string) {
    alertError(errorMessage)
    this.setState({ step: 'initial' })
  }

  private onMainButtonClick = async () => {
    const { enabled } = this.state
    this.setState({ step: enabled ? 'disable' : 'howitworks' })
  }

  private completeHowItWorksStep = async () => {
    const { user } = this.props

    try {
      const code = await Auth.setupTOTP(user)
      this.setState({ step: 'scanqr', authCode: code })
    } catch (error) {
      this.alertErrorAndSetInitialState(error.message)
    }
  }

  private completeScanQrCodeStep = () => {
    this.setState({ step: 'verify' })
  }

  private completeVerifyStep = async () => {
    const { user } = this.props
    const { challengeAnswer } = this.state

    this.setState({ buttonLoading: true })

    try {
      await Auth.verifyTotpToken(user, challengeAnswer)
      await Auth.setPreferredMFA(user, 'TOTP')

      this.setState({ step: 'congrats' })
    } catch (error) {
      this.alertErrorAndSetInitialState(error.message)
    } finally {
      this.setState({ buttonLoading: false, challengeAnswer: '' })
    }
  }

  private completeDisableStep = async () => {
    const { user } = this.props
    const { password, challengeAnswer } = this.state

    this.setState({ buttonLoading: true })

    try {
      // check that the user's password and confirmation code are correct before disabling MFA
      const signedInUser = await Auth.signIn(user.username, password)
      await Auth.confirmSignIn(signedInUser, challengeAnswer, TOTP_MFA_TYPE)

      await Auth.setPreferredMFA(user, 'NOMFA')
      alertSuccess(UI_STRINGS.SETTINGS.TWO_FACTOR_AUTH_DISABLED)
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        // error due to an invalid password
        alertError('Password is incorrect')
        this.setState({ step: 'initial' })
      } else if (error.code === 'CodeMismatchException') {
        // error due to an invalid verification code
        alertError('Confirmation Code is incorrect')
        this.setState({ step: 'initial' })
      } else {
        // any other error is handled as usual
        this.alertErrorAndSetInitialState(error.message)
      }
    } finally {
      this.setState({ buttonLoading: false, password: '', challengeAnswer: '' })
    }
  }

  private handleChallengeAnswerChange = (event: React.FormEvent<FormControlProps>) => {
    this.setState({
      challengeAnswer: event.currentTarget.value as string
    })
  }

  private handlePasswordChange = (event: React.FormEvent<FormControlProps>) => {
    this.setState({
      password: event.currentTarget.value as string
    })
  }

  public render() {
    const { user } = this.props
    const { enabled, step, authCode, challengeAnswer, password, buttonLoading } = this.state
    const isInitialStep = step === 'initial'

    return (
      <div className='TwoFactorAuthentication'>
        <SectionTitle titleText={UI_STRINGS.SETTINGS.TWO_FACTOR_AUTHENTICATION} />
        <p>{UI_STRINGS.SETTINGS.SETUP_2FA_USING_TOTP}</p>
        <Button
          action='primary'
          text={UI_STRINGS.SETTINGS.ENABLE_DISABLE_2FA_FOR_USER(enabled)}
          disabled={!isInitialStep}
          onClick={this.onMainButtonClick}
        />
        {!isInitialStep && <hr className='TwoFactorAuthentication__separator' />}
        {step === 'howitworks' && <HowItWorksStep onStepCompleted={this.completeHowItWorksStep} />}
        {step === 'scanqr' && (
          <ScanQrCodeStep onStepCompleted={this.completeScanQrCodeStep} userName={user.username} authCode={authCode} />
        )}
        {step === 'verify' && (
          <VerifyStep
            challengeAnswer={challengeAnswer}
            onChallengeAnswerChange={this.handleChallengeAnswerChange}
            buttonLoading={buttonLoading}
            onStepCompleted={this.completeVerifyStep}
          />
        )}
        {step === 'congrats' && <CongratsStep />}
        {step === 'disable' && (
          <DisableStep
            password={password}
            onPasswordChange={this.handlePasswordChange}
            challengeAnswer={challengeAnswer}
            onChallengeAnswerChange={this.handleChallengeAnswerChange}
            buttonLoading={buttonLoading}
            onStepCompleted={this.completeDisableStep}
          />
        )}
      </div>
    )
  }
}

export default TwoFactorAuthentication
