import { DoubleArrow } from '../../icons'
import React, { useCallback } from 'react'
import './ModernTable.scss'
import ErrorBox from 'elements/ErrorBox'

interface ModernTableProps<T extends { [k: string]: any }> {
  isLoading?: boolean
  loadingComponent?: React.ReactElement
  noResultsMessage?: string
  style?: React.CSSProperties
  /** Items to render */
  items: T[]
  /** Override how a specific field renders by providing a render function */
  scopedSlots?: { [k: string]: (val: T) => React.ReactNode }
  className?: string
  /** Optionally render a column with no header at the end of the table */
  actions?: (val: T) => React.ReactNode
  /** Define which fields from the items objects to be shown */
  fields: string[]
  /** If a header is clickable to sort */
  sortingHeaders?: string[]
  setSort?: (nextSort: 'asc' | 'desc') => void
  setOrderBy?: (nextOrderBy: string) => void
  /** Current sorting State */
  sort?: 'desc' | 'asc'
  /**
   * Current field being ordered by,
   * must match one of the fields. If not provided and there is only one sortingHeader,
   * that will be the default orderBy
   */
  orderBy?: string
  /** Rendered at the bottom of the table */
  children?: React.ReactNode
}

const sortingStateArrows = {
  none: <DoubleArrow className='' />,
  desc: '↓',
  asc: '↑'
}

function ModernTable<T>(props: ModernTableProps<T>) {
  const {
    items,
    scopedSlots,
    fields,
    actions,
    className,
    sortingHeaders,
    loadingComponent,
    isLoading,
    sort,
    orderBy,
    setSort,
    setOrderBy,
    noResultsMessage,
    children
  } = props

  const headerMapper = (field: string) => {
    if (sortingHeaders && sortingHeaders.includes(field) && sort) {
      const currentlySorted = orderBy === field || Object.keys(sortingHeaders).length === 1
      return (
        <th
          key={field}
          className='Table__heading-cell-sortable'
          onClick={(_) => {
            const nextState = sort === 'desc' ? 'asc' : 'desc'
            if (setSort) setSort(nextState)
            if (orderBy !== field && setOrderBy) setOrderBy(field)
          }}>
          <span>{field}</span>
          <span className='Table__heading-sorting-state'>{sortingStateArrows[currentlySorted ? sort : 'none']}</span>
        </th>
      )
    }
    return (
      <th className='Table__heading-cell' key={field}>
        <span>{field}</span>
      </th>
    )
  }

  const rowMapper = (val: T, index: number) => {
    return (
      <tr className='Table__row' key={index}>
        {[
          ...fields.map((f) => {
            if (scopedSlots && scopedSlots[f])
              return (
                <td key={f} className='Table__cell'>
                  {scopedSlots[f](val)}
                </td>
              )

            return (
              <td key={f} className='Table__cell'>
                {val[f]}
              </td>
            )
          }),
          actions && (
            <td key={'actions'} className='Table__cell'>
              {actions(val)}
            </td>
          )
        ]}
      </tr>
    )
  }

  const memoedRowMapper = useCallback(rowMapper, [items, scopedSlots, fields])

  if (isLoading) {
    if (loadingComponent) return loadingComponent

    return <div>Loading Results...</div>
  }

  if (!items || items.length === 0)
    return <ErrorBox mainMessage={noResultsMessage || 'No Results Found'} secondaryMessage='' />

  return (
    <div className={`Table ${className || ''}`}>
      <table className={'Table__table'}>
        <thead>
          <tr className='Table__heading'>
            {fields.map(headerMapper)}
            {actions && <th key='actions' className='Table_heading-cell' />}
          </tr>
        </thead>
        <tbody>{items.map(memoedRowMapper)}</tbody>
      </table>
      {children && <div className='Table__children'>{children}</div>}
    </div>
  )
}

export default ModernTable
