import React from 'react'
import TooltipBaseIcon from './TooltipBaseIcon'

class TooltipWrappedLockoutIcon extends TooltipBaseIcon {
  protected renderChild () {
    const { onClick, className } = this.props

    return (
      <svg
        className={className}
        xmlns='http://www.w3.org/2000/svg'
        width='16'
        height='21'
        viewBox='0 0 16 21'
        onClick={onClick ? event => onClick(event) : undefined}>
        <title>Lockout</title>
        <path d='M3.556 5.25C3.556 2.838 5.549.875 8 .875c2.45 0 4.444 1.963 4.444 4.375v2.625H3.556V5.25zm12 6.125a.441.441 0 0 0 .444-.438V8.313c0-.242-.2-.438-.444-.438h-2.223V5.25C13.333 2.355 10.941 0 8 0 5.059 0 2.667 2.355 2.667 5.25v2.625H.444A.441.441 0 0 0 0 8.313v12.25c0 .241.2.437.444.437h15.112a.441.441 0 0 0 .444-.438v-2.625c0-.241-.2-.437-.444-.437h-4v-.875h4a.441.441 0 0 0 .444-.438c0-.241-.2-.437-.444-.437h-4v-.875h4a.441.441 0 0 0 .444-.438c0-.241-.2-.437-.444-.437h-4v-.875h4a.441.441 0 0 0 .444-.438c0-.241-.2-.437-.444-.437h-4v-.875h4z'/>
      </svg>
    )
  }
}

export default TooltipWrappedLockoutIcon
