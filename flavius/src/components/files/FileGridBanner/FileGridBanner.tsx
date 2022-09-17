import React from 'react'

import NotificationWarningOutline from 'icons/notification-warning-outline'
import './FileGridBanner.scss'

export interface FileGridBannerProps {
  message: string
}

export const FileGridBanner: React.FC<FileGridBannerProps> = ({ message }) => {
  return (
    <div className='FileGridBanner'>
      <NotificationWarningOutline className='FileGridBanner__icon' />
      <span>{message}</span>
    </div>
  )
}

export default FileGridBanner
