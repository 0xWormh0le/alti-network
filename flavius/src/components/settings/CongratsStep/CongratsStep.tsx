import React from 'react'

import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import verified from 'icons/verified.svg'
import './CongratsStep.scss'

const CongratsStep: React.FC<{}> = () => (
  <section className='CongratsStep TwoFactorAuthentication__step'>
    <Typography variant={TypographyVariant.H3} weight='semibold' className='CongratsStep__title'>
      <img src={verified} className='CongratsStep__icon' alt='checkmark' />
      {UI_STRINGS.SETTINGS.CONGRATS_ENROLL}
    </Typography>
    <Typography variant={TypographyVariant.BODY_LARGE}>{UI_STRINGS.SETTINGS.CHANGE_WILL_AFFECT_NEXT_TIME}</Typography>
    <Typography variant={TypographyVariant.BODY_LARGE}>{UI_STRINGS.SETTINGS.WE_WILL_ASK_CONFIRMATION}</Typography>
  </section>
)

export default CongratsStep
