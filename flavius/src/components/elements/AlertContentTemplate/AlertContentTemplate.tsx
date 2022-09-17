import React from 'react'
import cn from 'classnames'

import IconClose from 'icons/close'
import IconNotificationError from 'icons/notification-error'
import IconNotificationInfo from 'icons/notification-info'
import IconNotificationSuccess from 'icons/notification-success'
import IconNotificationWarning from 'icons/notification-warning'
import './AlertContentTemplate.scss'

export interface AlertContentTemplateProps {
  classNames: string
  condition: 'error' | 'info' | 'success' | 'warning'
  handleClose: () => any
  id: string
  message: string
  styles: React.CSSProperties
  customFields?: { [key: string]: string }
}

const icons = {
  error: IconNotificationError,
  info: IconNotificationInfo,
  success: IconNotificationSuccess,
  warning: IconNotificationWarning
}

export const AlertContentTemplate: React.FC<AlertContentTemplateProps> = ({
  handleClose,
  message,
  condition,
  id,
  styles,
  classNames,
  customFields: { description } = {}
}) => {
  const Icon = icons[condition]
  return (
    <div className={cn(classNames, 'FlaviusAlert', `FlaviusAlert--${condition}`)} id={id} style={styles}>
      <div className='FlaviusAlert__body'>
        <Icon className='FlaviusAlert__icon' />
        <div className='FlaviusAlert__content'>
          {message}
          {description && <div className='FlaviusAlert__description'>{description}</div>}
        </div>
        <span tabIndex={0} className='FlaviusAlert__close' onClick={handleClose}>
          <IconClose className='FlaviusAlert__close-icon' />
        </span>
      </div>
    </div>
  )
}

export default AlertContentTemplate
