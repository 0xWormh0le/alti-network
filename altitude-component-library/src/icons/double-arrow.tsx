import React from 'react'
import BaseIcon from './BaseIcon'

class DoubleArrow extends BaseIcon {
  public render() {
    return (
      <svg className={this.props.className} xmlns='http://www.w3.org/2000/svg' width='7' height='11' viewBox='0 0 7 11'>
        <path
          fill='currentColor'
          fillRule='evenodd'
          d='M3.884 10.71l-.016.011-.051.045a.492.492 0 0 1-.636-.056L.355 7.884A.504.504 0 0 1 .3 7.246l.057-.067a.493.493 0 0 1 .705-.003l2.471 2.472L6.01 7.172a.504.504 0 0 1 .637-.055l.068.056a.493.493 0 0 1 0 .705l-2.83 2.831zM3.884.276L3.868.264 3.817.219a.492.492 0 0 0-.636.056L.355 3.102a.504.504 0 0 0-.055.637l.057.068a.493.493 0 0 0 .705.002l2.471-2.472L6.01 3.813a.504.504 0 0 0 .637.056l.068-.057a.493.493 0 0 0 0-.704L3.886.276z'
        />
      </svg>
    )
  }
}

export default DoubleArrow
