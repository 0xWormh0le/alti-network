import React from 'react'
import { Link } from 'react-router-dom'
import { isDemoEnv } from 'util/helpers'
import CONSTANTS from 'util/constants'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './WelcomeMessage.scss'

const { FEEDBACK_EMAIL_ADDRESS } = CONSTANTS

export const WelcomeMessage: React.FC<{}> = () => (
  <div className='WelcomeMessage'>
    <Typography variant={TypographyVariant.H1} className='WelcomeMessage__title'>
      Welcome to <span className='WelcomeMessage__app-name'>Altitude Networks</span>
    </Typography>
    <Typography variant={TypographyVariant.BODY} weight='medium' className='WelcomeMessage__first-paragraph'>
      We're very excited to provide you early access!
    </Typography>
    <Typography variant={TypographyVariant.BODY} className='WelcomeMessage__paragraph'>
      Please be candid with any feedback. What works, what doesn't, what would you like to see. Please use the chat
      system in the lower left of the screen or email us (
      <Link to={{ pathname: `mailto:${FEEDBACK_EMAIL_ADDRESS}` }} target='_blank'>
        {FEEDBACK_EMAIL_ADDRESS}
      </Link>
      ) with any questions or feedback.
    </Typography>
    <Typography variant={TypographyVariant.BODY} className='WelcomeMessage__paragraph'>
      Changes and new features will be deployed on an ongoing basis. For now, please enjoy the 'Top Risks' page which
      highlights key issues for review.
    </Typography>
    <Typography variant={TypographyVariant.BODY} className='WelcomeMessage__paragraph'>
      From the Top Risks page you can click on any file, person or list, to open a modal and explore more about it.
    </Typography>
  </div>
)

const WelcomeMessageDemo: React.FC<{}> = () => (
  <div className='WelcomeMessage'>
    <h3 className='WelcomeMessage__title'>
      Welcome to <span className='WelcomeMessage__app-name WelcomeMessage__app-name--demo'>Altitude Networks</span>
    </h3>
    <p className='WelcomeMessage__first-paragraph'>We're very excited to provide you access to our demo!</p>
    <p className='WelcomeMessage__paragraph'>
      Some functionality is limited in this demo, but we hope it gives you a taste of all we have to offer.
    </p>
    <p className='WelcomeMessage__paragraph'>
      Please don’t hesitate to reach out to us at (
      <Link to={{ pathname: `mailto:${FEEDBACK_EMAIL_ADDRESS}` }} target='_blank'>
        {FEEDBACK_EMAIL_ADDRESS}
      </Link>
      ) or via the chat bot in the lower left of your screen.
    </p>
  </div>
)

export default isDemoEnv ? WelcomeMessageDemo : WelcomeMessage
