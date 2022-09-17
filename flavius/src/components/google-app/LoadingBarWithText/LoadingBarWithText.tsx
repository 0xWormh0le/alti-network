import Typography from 'components/elements/Typography'
import React from 'react'
import './LoadingBarWithText.scss'

interface LoadingBarWithTextProps {
  text: string
  percentage: number
}

const LoadingBarWithText: React.FC<LoadingBarWithTextProps> = ({ text, percentage }) => {
  return (
    <div style={{ gridTemplateColumns: `${percentage}% ${100 - percentage}%` }} className='LoadingBarWithText'>
      <div className='LoadingBarWithText__loading-half'>
        <Typography variant='h2'>{`${percentage}%`}</Typography>
      </div>
      <div className='LoadingBarWithText__text-half'>
        <Typography variant='h2'>{text}</Typography>
      </div>
    </div>
  )
}

export default LoadingBarWithText
