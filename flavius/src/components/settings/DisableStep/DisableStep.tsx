import React from 'react'
import Button from 'components/elements/Button'
import FormControl, { FormControlProps } from 'components/elements/FormControl'
import FormGroup from 'components/elements/FormGroup'
import FormLabel from 'components/elements/FormLabel'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import { renderAttributeIfDev } from 'util/helpers'
import './DisableStep.scss'

export interface DisableStepProps {
  buttonLoading: boolean
  password: string
  onPasswordChange: (event: React.FormEvent<FormControlProps>) => void
  challengeAnswer: string
  onChallengeAnswerChange: (event: React.FormEvent<FormControlProps>) => void
  onStepCompleted: () => void
}

const DisableStep: React.FC<DisableStepProps> = ({
  buttonLoading,
  password,
  onPasswordChange,
  challengeAnswer,
  onChallengeAnswerChange,
  onStepCompleted
}) => (
  <section className='DisableStep TwoFactorAuthentication__step'>
    <Typography variant={TypographyVariant.H3} weight='semibold' className='DisableStep__title'>
      {UI_STRINGS.SETTINGS.DISABLE_TWO_FACTOR_AUTH}
    </Typography>
    <Typography variant={TypographyVariant.BODY_LARGE}>
      {UI_STRINGS.SETTINGS.ENTER_YOUR_CURRENT_PW_AND_CONFIRM}
    </Typography>
    <Typography variant={TypographyVariant.BODY_LARGE}>
      {UI_STRINGS.SETTINGS.CHANGES_WILL_TAKE_EFFECT_NEXT_TIME}
    </Typography>
    <FormGroup controlId='password' className='DisableStep__form-group'>
      <FormLabel>{UI_STRINGS.SETTINGS.PASSWORD}</FormLabel>
      <FormControl autoFocus={true} type='password' value={password} onChange={onPasswordChange} />
    </FormGroup>
    <FormGroup controlId='challengeAnswer' className='DisableStep__form-group'>
      <FormLabel>{UI_STRINGS.SETTINGS.CONFIRMATION_CODE}</FormLabel>
      <FormControl value={challengeAnswer} onChange={onChallengeAnswerChange} />
    </FormGroup>
    <Button
      className='DisableStep__button'
      disabled={password === '' || challengeAnswer === ''}
      action='primary'
      text={UI_STRINGS.BUTTON_LABELS.CONFIRM}
      loadingText={UI_STRINGS.LOGIN.CONFIRMING}
      isLoading={buttonLoading}
      onClick={onStepCompleted}
      {...renderAttributeIfDev({ 'data-testid': 'confirm-disable-button' })}
    />
  </section>
)

export default DisableStep
