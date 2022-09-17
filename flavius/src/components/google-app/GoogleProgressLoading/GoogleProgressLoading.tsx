import Typography from 'components/elements/Typography'
import React from 'react'
import LoadingBarWithText from '../LoadingBarWithText'
import LoadingWedge from '../LoadingWedge'

interface GoogleProgressLoadingProps {
  loadingWedgeText: string
  loadingBarText: string
  percentage: number
}

const GoogleProgressLoading: React.FC<GoogleProgressLoadingProps> = ({
  loadingBarText,
  loadingWedgeText,
  percentage
}) => {
  return (
    <div className='GoogleApp__progress-loading'>
      <LoadingWedge>
        <Typography variant='h2'>{loadingWedgeText}</Typography>
      </LoadingWedge>
      <LoadingBarWithText text={loadingBarText} percentage={percentage} />
    </div>
  )
}

export default GoogleProgressLoading
