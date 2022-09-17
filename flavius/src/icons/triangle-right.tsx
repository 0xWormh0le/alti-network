import React from 'react'
import BaseIcon from './BaseIcon'

class TriangleRight extends BaseIcon {
  public render() {
    return (
      <svg
        className={this.props.className}
        viewBox='0 0 20 20'
        width={20}
        height={20}
        xmlns='http://www.w3.org/2000/svg'>
        <polygon points='15,10 5,1 5,19' fill='currentColor' />
      </svg>
    )
  }
}

export default TriangleRight
