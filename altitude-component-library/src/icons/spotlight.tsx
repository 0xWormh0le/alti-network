import React from 'react'
import BaseIcon from './BaseIcon'

class SpotlightIcon extends BaseIcon {
  public render() {
    return (
      <svg
        className={this.props.className}
        width='14px'
        height='18px'
        viewBox='0 0 14 18'
        version='1.1'
        xmlns='http://www.w3.org/2000/svg'>
        <path d='M4.804 0c-1.63 0-2.956 1.345-2.956 3 0 1.654 1.326 3 2.956 3s2.957-1.346 2.957-3c0-1.655-1.326-3-2.957-3M.37 6.75v.375c0 2.665.94 4.777 2.587 5.837V18h3.695v-5.038C8.3 11.902 9.24 9.79 9.24 7.125V6.75H.37z' />
        <g>
          <path d='M9.8 14c-1.158 0-2.1-.748-2.1-1.667s.942-1.666 2.1-1.666c1.158 0 2.1.747 2.1 1.666 0 .92-.942 1.667-2.1 1.667m4.097 1.488l-1.389-1.19-.499-.429c.37-.406.591-.915.591-1.469 0-1.323-1.256-2.4-2.8-2.4C8.256 10 7 11.077 7 12.4c0 1.324 1.256 2.4 2.8 2.4.646 0 1.24-.19 1.714-.506l.5.427 1.389 1.191a.38.38 0 0 0 .247.088c.09 0 .18-.03.247-.088a.27.27 0 0 0 0-.424' />
        </g>
      </svg>
    )
  }
}

export default SpotlightIcon
