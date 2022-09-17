import React from 'react'
import BaseIcon from './BaseIcon'

class Checkmark extends BaseIcon {
  public render() {
    return (
      <svg viewBox='0 0 13 9' width={13} height={9} xmlns='http://www.w3.org/2000/svg' {...this.props}>
        <path
          d='M12.188 1.824L5.452 8.687a1.06 1.06 0 0 1-1.506 0L.812 5.541a1.072 1.072 0 0 1 0-1.511 1.062 1.062 0 0 1 1.506 0l2.381 2.39L10.682.313a1.062 1.062 0 0 1 1.506 0 1.071 1.071 0 0 1 0 1.511z'
          fill='currentColor'
          fillRule='evenodd'
        />
      </svg>
    )
  }
}

export default Checkmark
