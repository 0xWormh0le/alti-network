import React from 'react'
import Button from 'components/elements/Button'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import padlock from 'icons/padlock.svg'
import smartPhone from 'icons/smartphone.svg'
import verified from 'icons/verified.svg'
import UI_STRINGS from 'util/ui-strings'
import './HowItWorksStep.scss'

export interface HowItWorksStepProps {
  onStepCompleted: () => void
}

const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ onStepCompleted }) => (
  <section className='HowItWorksStep TwoFactorAuthentication__step'>
    <Typography variant={TypographyVariant.H3} weight='semibold' className='HowItWorksStep__title'>
      {UI_STRINGS.SETTINGS.HOW_TWO_FACTOR_AUTH_WORKS}
    </Typography>
    <Typography variant={TypographyVariant.BODY_LARGE}>
      <img src={padlock} className='HowItWorksStep__icon' alt='padlock' />
      {UI_STRINGS.SETTINGS.WHEN_LOGGING_IN_YOU_WILL_NEED}
    </Typography>
    <Typography variant={TypographyVariant.BODY_LARGE}>
      <img src={smartPhone} className='HowItWorksStep__icon' alt='smartphone' />
      {UI_STRINGS.SETTINGS.LOGIC_CODE_WILL_BE_SENT}
    </Typography>
    <Typography variant={TypographyVariant.BODY_LARGE}>
      <img src={verified} className='HowItWorksStep__icon' alt='checkmark' />
      {UI_STRINGS.SETTINGS.WHEN_YOU_TYPE_YOU_WILL_KNOW}
    </Typography>
    <Button
      className='HowItWorksStep__button'
      action='primary'
      text={UI_STRINGS.BUTTON_LABELS.START}
      onClick={onStepCompleted}
    />
  </section>
)

export default HowItWorksStep
