import React from 'react'
import ContentLoader from 'react-content-loader'

import Typography, { TypographyVariant } from 'components/elements/Typography'
import Tooltip from 'components/widgets/Tooltip'
import UI_STRINGS from 'util/ui-strings'
import './PhraseCount.scss'

export const TOTAL_PHRASE_COUNT = 20

export interface PhraseCountProps {
  count: number
  loading?: boolean
}

const PhraseCountLoading = () => (
  <ContentLoader
    backgroundColor='#eeeeee'
    foregroundColor='#fdfdfd'
    preserveAspectRatio='none'
    height={11}
    width={15}
    uniqueKey='phrasecount-loading'
    className='PhraseCount__loading'>
    <rect x={0} y={0} width={15} height={11} rx={2} ry={2} />
  </ContentLoader>
)

export const PhraseCount: React.FC<PhraseCountProps> = ({ loading, count }) => {
  return (
    <Typography variant={TypographyVariant.BODY_SMALL} className='PhraseCount'>
      <Tooltip text={UI_STRINGS.RISK_SETTINGS.MAXIMUM_PHASES}>
        <span>
          {loading ? <PhraseCountLoading /> : count} of {TOTAL_PHRASE_COUNT} available phrases
        </span>
      </Tooltip>
    </Typography>
  )
}

export default PhraseCount
