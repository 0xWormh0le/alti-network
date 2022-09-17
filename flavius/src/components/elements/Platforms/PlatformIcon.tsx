import React from 'react'
import { renderAttributeIfDev } from 'util/helpers'
import { platformImages } from 'config'
import './Platform.scss'

interface PlatformIconProps {
  platformId: string
  size?: number
  platformName?: string
}

const getStyle = (size: number) => ({
  width: `${size}px`,
  height: `${size}px`,
  maxHeight: 'none'
})

const PlatformIcon: React.FC<PlatformIconProps> = ({ platformId, size, platformName }) => {
  return (
    <div className='platform-icon-container' {...renderAttributeIfDev({ 'data-testid': 'platform-icon' })}>
      <img
        src={platformImages[platformId]?.Icon}
        alt={platformName || ''}
        className='platform-icon'
        title={platformName}
        style={size ? { ...getStyle(size) } : undefined}
      />
    </div>
  )
}

export default PlatformIcon
