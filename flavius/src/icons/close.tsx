import React from 'react'
import BaseIcon from './BaseIcon'

class Close extends BaseIcon {
  public render() {
    return (
      <svg
        className={this.props.className}
        viewBox='0 0 20 20'
        width={20}
        height={20}
        xmlns='http://www.w3.org/2000/svg'>
        <path
          d='M1.25 1.25l17.5 17.5m0-17.5l-17.5 17.5'
          stroke='currentColor'
          strokeWidth='4'
          fill='none'
          fillRule='evenodd'
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    )
  }
}
export default Close
