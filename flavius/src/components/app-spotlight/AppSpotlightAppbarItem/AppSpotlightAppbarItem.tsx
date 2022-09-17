import React from 'react'

import Typography, { TypographyVariant } from 'components/elements/Typography'

import './AppSpotlightAppbarItem.scss'

export interface AppSpotlightAppbarItemProp {
  key: string
  name: string
  image: string
  isSelected: boolean
  index: number
  onClick: (index: number) => void
}

export const AppSpotlightAppbarItem: React.FC<AppSpotlightAppbarItemProp> = (props) => {
  const className = props.isSelected ? 'AppSpotlightAppbarItem selected' : 'AppSpotlightAppbarItem'

  const { name, image } = props

  const handleItemClick = () => {
    props.onClick(props.index)
  }

  return (
    <div className={className} onClick={handleItemClick}>
      <div className='AppSpotlightAppbarItem__wrapper'>
        <img alt={name} src={image} className='AppSpotlightAppbarItem__wrapper--image' draggable='false' />
        <Typography
          variant={TypographyVariant.LABEL}
          weight='normal'
          className='AppSpotlightAppbarItem__wrapper--title'>
          {name}
        </Typography>
      </div>
    </div>
  )
}

export default AppSpotlightAppbarItem
