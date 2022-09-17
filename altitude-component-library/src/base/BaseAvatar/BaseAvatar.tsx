import React from 'react'
import './BaseAvatar.scss'

export interface BaseAvatarProps {
  src?: { url: string }
  name: string
  colorList?: string[]
  className?: string
  style?: React.CSSProperties
}

const getHex = (initials: string[], colorList?: string[]) => {
  if (colorList && colorList.length) {
    const charCodes = initials.reduce((pv, cv) => pv + cv.charCodeAt(0), 0)
    return colorList[charCodes % colorList.length]
  }
  return 'transparent'
}

const BaseAvatar: React.FC<BaseAvatarProps> = ({ src, style, className = '', name, colorList }) => {
  const initials: string[] =
    name && name.length
      ? name
          .replace(/^\s+|\s+$|\s+(?=\s)/g, '') // trim any space at in the initials first
          .split(' ')
          .map((nameSegment) => nameSegment[0])
      : []

  return (
    <div
      className={`BaseAvatar ${className}`}
      style={{
        ...style
      }}>
      {src?.url ? (
        <div className='BaseAvatar__image'>
          <img
            style={{
              width: `2em`
            }}
            alt={initials.join('')}
            src={src.url}
          />
        </div>
      ) : (
        <div
          className='BaseAvatar__text'
          style={{
            backgroundColor: `${getHex(initials, colorList)}`
          }}>
          <div>{initials}</div>
        </div>
      )}
    </div>
  )
}

export default BaseAvatar
