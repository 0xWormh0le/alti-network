import React from 'react'
import TooltipBaseIcon from './TooltipBaseIcon'

class TooltipWrappedEmailIcon extends TooltipBaseIcon {
  protected renderChild() {
    const { onClick, className } = this.props

    return (
      <svg
        className={className}
        xmlns='http://www.w3.org/2000/svg'
        width='21'
        height='19'
        viewBox='0 0 21 19'
        onClick={onClick ? event => onClick(event) : undefined}>
        <title>Email</title>
        <path d='M9.627 7.22L18.46.286A1.757 1.757 0 0 0 17.5 0H1.75c-.338 0-.652.1-.92.265l8.797 6.956' />
        <path d='M7.875 11.66c0-.716.587-1.296 1.313-1.296H14V9.068c0-.513.308-.978.784-1.186a1.327 1.327 0 0 1 1.416.231l3.05 2.761V1.727a1.7 1.7 0 0 0-.206-.798L9.898 8.111a.442.442 0 0 1-.545-.001L.227.895c-.14.248-.226.53-.226.832v9.5a1.74 1.74 0 0 0 1.75 1.728h6.124v-1.296' />
        <path d='M20.858 13.5l-5.25-4.75a.442.442 0 0 0-.471-.077.432.432 0 0 0-.262.395v2.16H9.187a.435.435 0 0 0-.437.431v4.318c0 .24.196.432.438.432h5.687v2.16a.432.432 0 0 0 .438.431.44.44 0 0 0 .295-.113l5.25-4.75a.43.43 0 0 0 0-.638' />
      </svg>
    )
  }
}

export default TooltipWrappedEmailIcon
