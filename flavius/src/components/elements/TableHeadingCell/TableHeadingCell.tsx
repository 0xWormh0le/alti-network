import React from 'react'
import cn from 'classnames'

import DoubleArrow from 'icons/double-arrow'
import './TableHeadingCell.scss'

export interface TableHeadingCellProps {
  title?: string
  columnId?: number
  onClick?: React.MouseEventHandler<Element>
  onMouseEnter?: React.MouseEventHandler<Element>
  onMouseLeave?: React.MouseEventHandler<Element>
  icon?: any
  iconClassName?: string
  className?: string
  style?: React.CSSProperties
  cellProperties: { [key: string]: string | number | boolean }
}

export const TableHeadingCell: React.FC<TableHeadingCellProps> = ({
  title,
  icon,
  iconClassName,
  cellProperties: { sortable }
}) => (
  <span className='TableHeadingCell'>
    {title}
    {sortable !== false && (
      <span className={cn('TableHeadingCell__icon', iconClassName)}>{icon || <DoubleArrow className='' />}</span>
    )}
  </span>
)

export default TableHeadingCell
