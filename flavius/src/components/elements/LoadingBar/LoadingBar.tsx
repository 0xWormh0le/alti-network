import React from 'react'
import cx from 'classnames'
import './LoadingBar.scss'

interface LoadingBarProps {
  className?: string
}

export const LoadingBar: React.FC<LoadingBarProps> = ({ className }) => (
  <div className={cx('LoadingBar', className)}>
    <div className='LoadingBar__inner' />
  </div>
)

export default LoadingBar
