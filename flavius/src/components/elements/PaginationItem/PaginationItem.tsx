import React from 'react'
import cx from 'classnames'

import Typography from '../Typography'
import './PaginationItem.scss'

export const PaginationItemVariant = {
  ARROW: 'arrow',
  NUMBER: 'number',
  SIDE: 'side'
} as const

type PaginationItemVariantType = typeof PaginationItemVariant

type PaginationItemVariantKeys = keyof PaginationItemVariantType

export type PaginationItemVariantValues = typeof PaginationItemVariant[PaginationItemVariantKeys]

export interface PaginationItemProps {
  active?: boolean
  disabled?: boolean
  children?: React.ReactNode
  onPageChange?: (nextPage: number) => void
  pageNumber?: number
  variant: PaginationItemVariantValues
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  active,
  disabled,
  children,
  onPageChange,
  pageNumber,
  variant,
  ...otherProps
}) => {
  return (
    <div
      className={cx('PaginationItem', `PaginationItem--${variant}`)}
      onClick={pageNumber && onPageChange && !disabled && !active ? () => onPageChange(pageNumber) : undefined}
      {...otherProps}>
      <Typography
        variant='body-tiny'
        component='button'
        className={cx('PaginationItem__link', {
          'PaginationItem__link--active': active,
          'PaginationItem__link--disabled': disabled
        })}>
        {children || pageNumber}
      </Typography>
    </div>
  )
}

export default PaginationItem
