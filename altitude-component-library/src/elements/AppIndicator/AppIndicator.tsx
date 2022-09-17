import React from 'react'
import { Link } from 'react-router-dom'
import cn from 'classnames'

import googleDriveIcon from '../../icons/google-drive-icon.png'
import './AppIndicator.scss'

export interface AppIndicatorProps {
  value: 'GDrive'
  fileId: string
  className?: string
}

/*
  For now, this only handles Goodle Drive links. If we want to add support for other types,
  We should add a check on 'value', along with extending the type to include other strings then `GDrive`
*/
export const AppIndicator: React.FC<AppIndicatorProps> = ({ className, value, fileId }) => (
  <span className={cn('AppIndicator', className)}>
    <Link to={{ pathname: `https://drive.google.com/open?id=${fileId}` }} target='_blank' rel='noopener noreferrer'>
      <img src={googleDriveIcon} className='AppIndicator__icon' alt='Google Drive' />
    </Link>
  </span>
)

export default AppIndicator
