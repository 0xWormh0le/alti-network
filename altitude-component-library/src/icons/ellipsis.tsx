import React from 'react'
import BaseIcon from './BaseIcon'

class EllipsisIcon extends BaseIcon {
  public render () {
    const {alt, className} = this.props
    return (
      <svg className={className} viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg' role='img' width='256' height='256'>
        <title>{alt}</title>
        <circle cx='57.6' cy='128' r='18'/>
        <circle cx='128' cy='128' r='18'/>
        <circle cx='198.4' cy='128' r='18'/>
      </svg>
    )
  }
}

export default EllipsisIcon
