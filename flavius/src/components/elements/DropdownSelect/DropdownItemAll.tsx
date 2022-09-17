import React, { useEffect, useState, useContext } from 'react'
import { DropdownContext } from './DropdownContext'
import './DropdownSelect.scss'

interface DropdownItemAllProps {
  onClickAll?: (checked: boolean) => void
  label?: string
}

const DropdownItemAll: React.FC<DropdownItemAllProps> = ({ onClickAll, label }) => {
  const [checked, setChecked] = useState(false)
  const { checkAll } = useContext(DropdownContext) as any

  useEffect(() => {
    setChecked(checkAll)
  }, [checkAll])

  const clickHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
    if (onClickAll) {
      onClickAll(e.target.checked)
    }
  }

  return (
    <div>
      <div className='dropdown-item-separator' />
      <div className='dropdown-item-row'>
        <div>
          <input type='checkbox' checked={checked} onChange={clickHandler} />
        </div>
        <div>{label || 'All'}</div>
      </div>
    </div>
  )
}

DropdownItemAll.displayName = 'DropdownItemAll'
export default DropdownItemAll
