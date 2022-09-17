import Typography, { TypographyVariant } from 'components/elements/Typography'
import React from 'react'
import UI_STRINGS from 'util/ui-strings'
import './RiskAssessmentHeader.scss'

const RiskAssessmentHeader: React.FC = () => {
  return (
    <div className='GoogleApp__oval'>
      <Typography variant={TypographyVariant.H1}>{UI_STRINGS.GOOGLE_APP.RAPID_ASSESSMENT}</Typography>
    </div>
  )
}

export default RiskAssessmentHeader
