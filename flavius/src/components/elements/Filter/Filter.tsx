import React, { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import cx from 'classnames'
import Button from 'components/elements/Button'
import { useOnClickOutside } from 'util/hooks'
import Tooltip from 'components/widgets/Tooltip'
import './Filter.scss'

export interface FilterItem {
  id: string
  value: string
  selected: boolean
  label?: string
  renderComponent?: ReactNode
}

export interface FilterProps {
  containerClass?: string
  dropdownClass?: string
  displayAllOption: boolean
  headerLabel: string
  tooltipText?: string
  items: FilterItem[]
  resetItems?: FilterItem[] // in case we need to reset to certain options which may be different from items
  isSingleSelect?: boolean // single select mode, the UI will be sligthly different if true
  onSubmit: (items: FilterItem[]) => void
}

// only mapping the id, value, selected to local state
export const mapFilterItems = (items: FilterItem[]): FilterItem[] =>
  items && items.length > 0 ? items.map((item) => ({ id: item.id, value: item.value, selected: item.selected })) : []

const Filter: React.FC<FilterProps> = ({
  containerClass,
  dropdownClass,
  displayAllOption,
  headerLabel,
  tooltipText,
  items,
  resetItems,
  isSingleSelect,
  onSubmit
}) => {
  const [localItems, setLocalItems] = useState<FilterItem[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const selectedAll: boolean = localItems.every((item) => item.selected)
  const selectedItemsNum: number = localItems.filter((item) => item.selected).length
  const selectedItemIndex: number =
    localItems.findIndex((item) => item.selected) > -1 ? localItems.findIndex((item) => item.selected) : 0 // in single select mode, default to the first time if none is selected
  const filterContent = useRef<HTMLDivElement | null>(null)
  const dropdownContent = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<string>('0px')

  const initializeLocalItems = useCallback(() => {
    // check if items qulifies for isSinslgeSelect condition
    if (isSingleSelect) {
      const noDefaultSelect: number = items.findIndex((item) => item.selected)
      const allSelectedItems: FilterItem[] = items.filter((item) => item.selected)

      if (noDefaultSelect === -1) {
        throw new Error('If isSingleSelect is true, items should include one as selected true')
      } else if (allSelectedItems.length > 1) {
        throw new Error('If isSingleSelect is true, items should only include one as selected true')
      }
    }

    const newItems: FilterItem[] = mapFilterItems(items)
    setLocalItems(newItems)
  }, [isSingleSelect, items])

  useEffect(() => {
    initializeLocalItems()
  }, [initializeLocalItems])

  useEffect(() => {
    if (dropdownContent.current) {
      setMaxHeight(showDropdown ? `${dropdownContent.current.scrollHeight}px` : '0px')
    }
  }, [showDropdown])

  useOnClickOutside(filterContent, () => {
    if (!noFilterChange && showDropdown) {
      onSubmit(localItems)
    }
    setShowDropdown(false)
  })

  const noFilterChange = useMemo((): boolean => {
    let noChange = true

    if (items.length > 0 && localItems.length > 0) {
      items.forEach((item, i) => {
        if (item.selected !== localItems[i].selected) {
          noChange = false
        }
      })
    }

    return noChange
  }, [items, localItems])

  const handleMultiSelectItem = (selectedIndex: number) => {
    setLocalItems((prevItems) =>
      prevItems.map((item, i) => {
        if (i === selectedIndex) {
          return { ...item, selected: !item.selected }
        } else {
          return item
        }
      })
    )
  }

  const handleSingleSelectItem = (selectedIndex: number) => {
    setLocalItems((prevItems) => prevItems.map((item, i) => ({ ...item, selected: i === selectedIndex })))
    setShowDropdown(false)

    // call the onSubmit right away with updated data without waiting for local state updates
    const selectedItem = { ...localItems[selectedIndex], selected: true }
    onSubmit([selectedItem])
  }

  const handleSelectAll = () => {
    const partialSelected = localItems.some((item) => !item.selected)

    setLocalItems((prevItems) =>
      prevItems.map((item) => {
        return { ...item, selected: partialSelected }
      })
    )
  }

  const onApply = () => {
    onSubmit(localItems)
    setShowDropdown(false)
  }

  const onReset = () => {
    if (resetItems && resetItems.length > 0) {
      const newItems: FilterItem[] = mapFilterItems(resetItems)
      setLocalItems(newItems)
    } else {
      initializeLocalItems()
    }
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  if (!localItems.length) return null

  const selectedText = isSingleSelect ? (
    <span>{items[selectedItemIndex].label || items[selectedItemIndex].value}</span>
  ) : (
    <span>
      {selectedAll ? 'All' : selectedItemsNum === 0 ? `- no filters applied` : `${selectedItemsNum} selected`}
    </span>
  )

  return (
    <div ref={filterContent} className={cx('Filter__container', containerClass)}>
      <div className='Filter__header' onClick={toggleDropdown}>
        <div className='Filter__header-label'>{headerLabel}</div>
        <div
          className={cx('Filter__header-selected-text', {
            'Filter__header-selected-text-none': selectedItemsNum === 0
          })}>
          {tooltipText ? <Tooltip text={tooltipText}>{selectedText}</Tooltip> : selectedText}
          <div className={`Filter__header-arrow-${showDropdown ? `up` : `down`}`} />
        </div>
      </div>
      <div
        ref={dropdownContent}
        style={{ maxHeight: `${maxHeight}` }}
        className={cx(
          'Filter__dropdown',
          { 'Filter__dropdown-open': showDropdown, 'Filter__dropdown-close': !showDropdown },
          dropdownClass
        )}>
        <div className='Filter__dropdown-inner'>
          {localItems.map((item, i) => (
            <div
              key={item.id}
              className={cx('Filter__dropdown-item', { single: isSingleSelect })}
              // only have the onClick method on single select mode as we hide the checkbox instead
              onClick={isSingleSelect ? () => handleSingleSelectItem(i) : undefined}>
              {!isSingleSelect && (
                <input type='checkbox' checked={item.selected} onChange={() => handleMultiSelectItem(i)} />
              )}
              {items[i].renderComponent || items[i].label || item.value}
            </div>
          ))}
          {!isSingleSelect && (
            <>
              {displayAllOption && (
                <>
                  <hr />
                  <div className='Filter__dropdown-item'>
                    <input type='checkbox' checked={selectedAll} onChange={handleSelectAll} />
                    All
                  </div>
                </>
              )}
              <div className='Filter__action'>
                <Button
                  className='Filter__action-apply'
                  action='primary'
                  disabled={noFilterChange}
                  text={'Apply'}
                  onClick={onApply}
                />
                <button className='Filter__action-reset' onClick={onReset}>
                  Reset filter
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

Filter.defaultProps = {
  displayAllOption: true,
  headerLabel: '',
  items: []
}

export default Filter
