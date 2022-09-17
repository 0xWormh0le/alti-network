import React, { useState, useEffect, ReactElement, cloneElement, useCallback, useRef } from 'react'
import { DropdownContext } from './DropdownContext'
import { getComponentName } from 'util/helpers'
import Tooltip from 'components/widgets/Tooltip'
import './DropdownSelect.scss'

export interface DropdownSelectProps {
  children?: ReactElement[]
  showSelected?: boolean
  onClick?: (e: MouseEvent) => void
  noneSelected?: string
  onChange?: (items: any) => void
  tooltipText?: string
}

interface ICheckbox {
  label: string
  checked: boolean
  key: any
  value: any
}

interface EnumCheckboxes extends Array<ICheckbox | any> {}

const DropdownSelectRow: React.FC<DropdownSelectProps> = (props) => {
  const [showDropdown, setShowDropdown] = useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const [checkAll, setCheckAll] = useState(false)
  const [itemsAreChecked, setItemsCheckedOrNot] = useState<boolean[]>([])
  const [selectedText, setSelectedText] = useState('')
  const [checkboxArray, setCheckboxArray] = useState<null | EnumCheckboxes>()
  const [opacity, setOpacity] = useState(0)
  const [noneSelected, setNoneSelected] = useState(false)
  const [defaultCheckboxes, setDefaultCheckboxes] = useState<null | EnumCheckboxes>()
  const updateOnChange = props.onChange
  const tooltipText = props.tooltipText

  // we need a way to set the default checkboxes and initial checkbox array state
  const _items = useRef<boolean[]>()
  const _checkboxArray = useRef<EnumCheckboxes>()
  const _noneSelected = useRef(true)

  const initializeCheckboxItems = useCallback((childProps: any) => {
    if (childProps.hasOwnProperty('children')) {
      childProps.children.forEach((item: any) => {
        if (item.props.hasOwnProperty('children')) {
          initializeCheckboxItems(item.props.children)
        }
      })
    } else {
      childProps.forEach((item: any) => {
        const component = getComponentName(item)
        if (component === 'DropdownItem') {
          const selected = item.props.checked
          if (_items && _items.current) {
            _items.current.push(selected)
          }
          if (_checkboxArray && _checkboxArray.current) {
            _checkboxArray.current.push({
              label: item.props.label,
              checked: item.props.checked,
              value: item.props.value
            })
          }
          if (item.checked) {
            _noneSelected.current = false
          }
        }
      })
    }
  }, [])

  const initialize = useCallback(() => {
    _items.current = []
    _checkboxArray.current = []
    _noneSelected.current = true
    if (props && props.children) {
      initializeCheckboxItems(props)
      setItemsCheckedOrNot(_items.current)
      setNoneSelected(_noneSelected.current)
      if (_items.current.every((item) => item)) {
        setCheckAll(true)
      }
      setCheckboxArray(_checkboxArray.current)
      setDefaultCheckboxes(_checkboxArray.current)
    }
  }, [props, setCheckboxArray, setDefaultCheckboxes, initializeCheckboxItems])

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    document.body.addEventListener('click', (event: any) => {
      if (ref.current && !ref.current?.contains(event.target)) {
        setShowDropdown(false)
      }
    })
  }, [ref, setCheckAll])

  const handleClickAll = (checked: boolean) => {
    setCheckAll(checked)
    if (checked) {
      // set all items to checked (true)
      const checkedItems = itemsAreChecked.map((item) => true)
      setItemsCheckedOrNot(checkedItems)
      if (checkboxArray) {
        const previousCheckboxes = [...checkboxArray]
        previousCheckboxes.forEach((item: any, i: number) => (previousCheckboxes[i].checked = true))
        setCheckboxArray(previousCheckboxes)
        if (typeof updateOnChange === 'function') {
          const itemsToUpdate = previousCheckboxes.map((item: any) => item.value)
          updateOnChange(itemsToUpdate)
        }
      }
    } else {
      deselectAll()
    }
  }

  const deselectAll = () => {
    if (checkboxArray) {
      const previousCheckboxes = [...checkboxArray]
      previousCheckboxes.forEach((item: any, i: number) => (previousCheckboxes[i].checked = false))
      setCheckboxArray(previousCheckboxes)
      const arr = Array.from({ length: previousCheckboxes.length }, () => false)
      setItemsCheckedOrNot(arr)
    }
  }

  const updateItemChecked = (id: number, checked: boolean, value: any) => {
    /* we don't need to add 'All' to items that are checked */
    const arr = [...itemsAreChecked]
    arr[id] = checked
    if (!checked) {
      setCheckAll(false)
    }
    setItemsCheckedOrNot(arr)
    /* update the checkboxArray so we submit the correct payload */
    updateCheckboxes(id, checked, value)
  }

  const updateCheckboxes = (id: number, checked: boolean, value: string | number) => {
    if (checkboxArray) {
      const previousCheckboxes = [...checkboxArray]
      const item = { ...previousCheckboxes[id] }
      item.checked = checked
      previousCheckboxes[id] = item
      if (typeof updateOnChange === 'function') {
        const itemsChecked = previousCheckboxes
          .filter((checkbox: any) => checkbox.checked)
          .map((checkbox: any) => checkbox.value)
        updateOnChange(itemsChecked)
      }
      setCheckboxArray(previousCheckboxes)
    }
  }

  useEffect(() => {
    const numberOfItemsChecked = itemsAreChecked.filter((i: any) => i).length
    const allItemsAreChecked = numberOfItemsChecked === itemsAreChecked.length
    let _none
    let _selectedText
    if (allItemsAreChecked) {
      _selectedText = 'All'
      _none = false
    } else if (numberOfItemsChecked === 0) {
      _selectedText = props.noneSelected || ''
      _none = true
    } else {
      _selectedText = `${numberOfItemsChecked} selected`
      _none = false
    }
    setNoneSelected(_none)
    setSelectedText(_selectedText)
    setCheckAll(allItemsAreChecked)
  }, [itemsAreChecked, props.noneSelected, checkboxArray])

  const submit = (event: MouseEvent, func: (a: EnumCheckboxes | any) => void) => {
    if (func) {
      func(checkboxArray)
    }
  }

  const cloneChild = (child: React.ReactNode, i: number) => {
    if (React.isValidElement(child)) {
      // return React.cloneElement(child, { newProp: 'myNewProp' })
      const component = getComponentName(child)
      if (component === 'DropdownSelectSubmit') {
        return cloneElement(child, {
          key: i,
          id: i,
          onSubmit: (event: MouseEvent) => submit(event, child.props.onSubmit)
        })
      } else if (component === 'DropdownItemAll') {
        return cloneElement(child, {
          onClickAll: handleClickAll,
          key: i,
          id: i,
          updateItemChecked
        })
      } else if (child.props?.children) {
        return child.props.children.map((grandChild: React.ReactNode, j: number) => cloneChild(grandChild, j))
      } else if (component === 'DropdownItem') {
        return cloneElement(child, {
          key: i,
          id: i,
          checked: itemsAreChecked[i]
        })
      }
    }
    return child
  }

  useEffect(() => {
    setOpacity(showDropdown ? 1 : 0)
  }, [showDropdown, setOpacity])

  const cssPrefix = 'dropdown-select'
  return (
    <DropdownContext.Provider
      value={{ checkAll, items: itemsAreChecked, setShowDropdown, updateItemChecked, defaultCheckboxes }}>
      <div className={`${cssPrefix}-container`}>
        <div className={`${cssPrefix}-col`} ref={ref}>
          <div
            className={`${cssPrefix}-row`}
            onClick={() => {
              setShowDropdown(!showDropdown)
            }}>
            <div className={`${cssPrefix}-header`}>Platform</div>
            <div className={noneSelected ? `${cssPrefix}-header` : `${cssPrefix}-text`}>
              {tooltipText && !noneSelected ? (
                <Tooltip text={tooltipText}>
                  <span>{selectedText}</span>
                </Tooltip>
              ) : (
                <span>{selectedText}</span>
              )}
            </div>
            <div className={`${cssPrefix}-arrow-container`}>
              <div />
            </div>
          </div>
          {showDropdown && (
            <div className={`${cssPrefix}-dropdown`} style={{ opacity }}>
              {props.children?.map((e: React.ReactNode, i: number) => {
                return cloneChild(e, i)
              })}
            </div>
          )}
        </div>
      </div>
    </DropdownContext.Provider>
  )
}

export default DropdownSelectRow
