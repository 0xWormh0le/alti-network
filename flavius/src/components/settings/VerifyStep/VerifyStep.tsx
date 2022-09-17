import React from 'react'

import Button from 'components/elements/Button'
import FormControl, { FormControlProps } from 'components/elements/FormControl'
import FormGroup from 'components/elements/FormGroup'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'

import './VerifyStep.scss'

export interface VerifyStepProps {
  buttonLoading: boolean
  challengeAnswer: string
  onChallengeAnswerChange: (event: React.FormEvent<FormControlProps>) => void
  onStepCompleted: () => void
}

const VerifyStep: React.FC<VerifyStepProps> = ({
  buttonLoading,
  challengeAnswer,
  onChallengeAnswerChange,
  onStepCompleted
}) => (
  <section className='VerifyStep TwoFactorAuthentication__step'>
    <form
      onSubmit={(event) => {
        event.preventDefault()
        onStepCompleted()
      }}>
      <Typography variant={TypographyVariant.H3} weight='semibold' className='VerifyStep__title'>
        {UI_STRINGS.SETTINGS.TRY_YOUR_CODE}
      </Typography>
      <p>{UI_STRINGS.SETTINGS.USE_YOUR_SECURITY_APP_TO_GENERATE}</p>
      <FormGroup controlId='challengeAnswer' className='VerifyStep__form-group'>
        <FormControl autoFocus={true} value={challengeAnswer} onChange={onChallengeAnswerChange} />
      </FormGroup>
      <Button
        className='VerifyStep__button'
        disabled={challengeAnswer === ''}
        action='primary'
        text={UI_STRINGS.BUTTON_LABELS.VERIFY}
        loadingText={UI_STRINGS.SETTINGS.VERIFYING}
        isLoading={buttonLoading}
        onClick={onStepCompleted}
      />
    </form>
  </section>
)

export default VerifyStep
