import React from 'react'
import BaseIcon from './BaseIcon'

class NotificationError extends BaseIcon {
  public render() {
    return (
      <svg className={this.props.className} width={13} height={13} xmlns='http://www.w3.org/2000/svg'>
        <defs>
          <path
            d='M12.617 3.391L9.556.372A1.218 1.218 0 0 0 8.687 0L4.3.007c-.312 0-.618.127-.839.35L.468 3.306A1.595 1.595 0 0 0 0 4.438v4.2c0 .348.135.676.38.922l3.026 3.037c.259.26.602.402.968.402H8.62c.37 0 .717-.145.978-.407l2.922-2.932c.31-.31.481-.724.481-1.164V4.318c0-.35-.136-.68-.383-.927zm-6.463-.14c0-.206.167-.374.373-.374s.373.168.373.375v4.986a.374.374 0 0 1-.373.375.374.374 0 0 1-.373-.375V3.252zm.373 6.938a.487.487 0 1 1 .002-.974.487.487 0 0 1-.002.974z'
            id='a'
          />
        </defs>
        <g fill='none' fillRule='evenodd'>
          <mask id='b' fill='#fff'>
            <use xlinkHref='#a' />
          </mask>
          <use fill='#384048' xlinkHref='#a' />
          <g mask='url(#b)' fill='#E23115'>
            <path d='M-5.5-5.5h24v24h-24z' />
          </g>
        </g>
      </svg>
    )
  }
}

export default NotificationError
