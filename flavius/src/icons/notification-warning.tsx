import React from 'react'
import BaseIcon from './BaseIcon'

class NotificationWarning extends BaseIcon {
  public render() {
    return (
      <svg className={this.props.className} width={16} height={14} xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M8 0L0 14h16L8 0zm-.8 5h1.5v1.4L8.3 10h-.8l-.4-3.6V5h.1zm.8 8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z'
          fill='#FBC310'
          fillRule='nonzero'
        />
      </svg>
    )
  }
}

export default NotificationWarning
