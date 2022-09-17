import React, { useContext, useEffect, useState } from 'react'
import { DropdownContext } from './DropdownContext'

interface DrowpdownItemProps {
  label: string
  value: string | number | null
  icon?: {
    type?: string
    color?: string
    src?: string
  }
  onClickAll?: (checked: boolean) => void
  id?: number
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>, value?: any) => void
}

const MAX_LENGTH = 250
const CHAR_WIDTH = 8

const DropdownItem: React.FC<DrowpdownItemProps> = (props) => {
  const { label, checked, icon, id, value } = props
  const iconBackground = icon && icon.type !== 'image' && icon.color ? icon.color : 'blue'
  const iconType = icon && icon.type ? icon.type : ''
  const iconSrc = icon && icon.src ? icon.src : undefined
  const cssPrefix = 'dropdown-item'
  const { updateItemChecked } = useContext(DropdownContext) as any
  const [isChecked, setChecked] = useState(checked)
  const [width, setWidth] = useState(200)

  useEffect(() => {
    const labelPixelWidth: number = label.length * CHAR_WIDTH
    setWidth(labelPixelWidth < MAX_LENGTH ? labelPixelWidth : MAX_LENGTH)
  }, [label])

  const checkboxHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    updateItemChecked(id, e.target.checked, value)
    if (props.onChange) {
      props.onChange(e, value)
    }
  }

  useEffect(() => {
    setChecked(checked)
  }, [checked])

  return (
    <div className={`${cssPrefix}-row`}>
      <div>
        <input type='checkbox' checked={isChecked} onChange={checkboxHandler} />
      </div>
      <div>
        {iconType === 'image' || iconSrc ? (
          <img src={iconSrc} alt={label} title={label} />
        ) : (
          <span style={{ background: iconBackground }} className={`${cssPrefix}-circle`} />
        )}
      </div>
      <div style={{ minWidth: `${width}px` }}>{label}</div>
    </div>
  )
}

DropdownItem.displayName = 'DropdownItem'
export default DropdownItem
