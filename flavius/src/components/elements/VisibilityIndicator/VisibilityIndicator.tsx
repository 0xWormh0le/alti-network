import React from 'react'
import cn from 'classnames'

import './VisibilityIndicator.scss'

export interface VisibilityIndicatorProps {
  isInternal: boolean
  className?: string
}

export const VisibilityIndicator = ({ isInternal, className }: VisibilityIndicatorProps) => (
  <div
    className={cn(
      'VisibilityIndicator',
      {
        'VisibilityIndicator--internal': isInternal,
        'VisibilityIndicator--external': !isInternal
      },
      className
    )}>
    {isInternal ? 'Internal' : 'External'}
  </div>
)

export default VisibilityIndicator
