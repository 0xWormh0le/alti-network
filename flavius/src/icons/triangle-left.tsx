import React from 'react'
import BaseIcon from './BaseIcon'

class TriangleLeft extends BaseIcon {
  public render() {
    return (
      <svg
        className={this.props.className}
        viewBox='0 0 20 20'
        width={20}
        height={20}
        xmlns='http://www.w3.org/2000/svg'>
        <polygon points='5,10 15,1 15,19' fill='currentColor' />
      </svg>
    )
  }
}

export default TriangleLeft
