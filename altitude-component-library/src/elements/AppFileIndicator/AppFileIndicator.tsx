import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'

import googleDriveFileIcon from '../../icons/google-drive-file-icon.svg'
import './AppFileIndicator.scss'

export interface AppFileIndicatorProps {
  value: 'GDrive'
  fileId: string
  className?: string
}

export const AppFileIndicator: React.FC<AppFileIndicatorProps> = ({ className, value, fileId }) => (
  <span className={cn('AppFileIndicator', className)}>
    {value === 'GDrive' && (
      <Link to={{ pathname: `https://drive.google.com/open?id=${fileId}` }} target='_blank' rel='noopener noreferrer'>
        <img src={googleDriveFileIcon} className='AppFileIndicator__icon' alt='Google Drive File' />
      </Link>
    )}
  </span>
)

export default AppFileIndicator
