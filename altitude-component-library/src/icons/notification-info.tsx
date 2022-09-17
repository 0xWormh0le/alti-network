import React from 'react'
import BaseIcon from './BaseIcon'

class NotificationInfo extends BaseIcon {
  public render() {
    return (
      <svg className={this.props.className} width='16' height='16' xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 4c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1zm2 8H6v-1h1V8H6V7h3v4h1v1z'
          fill='#008EED'
          fillRule='evenodd'
        />
      </svg>
    )
  }
}

export default NotificationInfo
