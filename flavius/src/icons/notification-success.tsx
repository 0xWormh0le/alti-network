import React from 'react'
import BaseIcon from './BaseIcon'

class NotificationSuccess extends BaseIcon {
  public render() {
    return (
      <svg className={this.props.className} width={16} height={16} xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM4.2 8.292l.916-.86L7.2 9.693l4.113-4.329.887.852-5 5.284-3-3.208z'
          fill='#9ACF36'
          fillRule='evenodd'
        />
      </svg>
    )
  }
}

export default NotificationSuccess
