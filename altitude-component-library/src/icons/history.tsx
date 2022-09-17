import React from 'react'
import BaseIcon from './BaseIcon'

class History extends BaseIcon {
  public render() {
    return (
      <svg viewBox='0 0 18 15' width='18' height='15' xmlns='http://www.w3.org/2000/svg' {...this.props}>
        <g fill='currentColor' fillRule='nonzero'>
          <path d='M8.48 4.348l-.002 3.71c0 .141.057.276.157.375l2.675 2.654.755-.75-2.518-2.498.002-3.491h-1.07z' />
          <path d='M9.6 0C5.844 0 2.738 2.8 2.217 6.429H0l2.666 2.678L5.333 6.43H3.296C3.806 3.393 6.434 1.07 9.6 1.07c3.529 0 6.4 2.884 6.4 6.429 0 3.545-2.87 6.429-6.4 6.429a6.356 6.356 0 0 1-5.046-2.475l-.84.66A7.415 7.415 0 0 0 9.598 15c4.117 0 7.466-3.365 7.466-7.5S13.716 0 9.6 0z' />
        </g>
      </svg>
    )
  }
}

export default History
