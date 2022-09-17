import React from 'react'

import LoadingBar from 'components/elements/LoadingBar'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'

import './SubmittingModalContent.scss'

export interface SubmittingModalContentProps {
  action: 'add' | 'delete'
}

export const SubmittingModalContent: React.FC<SubmittingModalContentProps> = ({ action }) => {
  return (
    <div className='SubmittingModalContent'>
      <Typography variant={TypographyVariant.H3} className='SubmittingModalContent__text'>
        {action === 'add' ? UI_STRINGS.RISK_SETTINGS.SUBMITTING_PHRASES : UI_STRINGS.RISK_SETTINGS.DELETING_PHRASES}
      </Typography>
      <LoadingBar />
    </div>
  )
}

export default SubmittingModalContent
