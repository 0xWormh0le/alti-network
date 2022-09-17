import React from 'react'
import cn from 'classnames'
import { PlatformCell } from 'components/elements/Platforms'
import './AppIndicator.scss'

export interface AppIndicatorProps {
  value: string
  fileId: string
  className?: string
  platformId?: string
  webLink?: string
}

export const AppIndicator: React.FC<AppIndicatorProps> = ({ className, value, fileId, platformId, webLink }) => {
  const _platformId = platformId || 'gsuite'
  return (
    <span className={cn('AppIndicator', className)}>
      {fileId ? <PlatformCell platformId={_platformId} url={webLink} /> : <PlatformCell platformId={_platformId} />}
    </span>
  )
}

export default AppIndicator
