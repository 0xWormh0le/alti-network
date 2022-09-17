import React, { useContext, useEffect, useState } from 'react'
import Button from 'components/elements/Button'
import { DropdownContext } from './DropdownContext'

interface DropdownSelectSubmitProps {
  text: string
  onSubmit?: (checkedItems: any) => void
  canApplyFilter?: boolean
}

const DropdownSelectSubmit: React.FC<DropdownSelectSubmitProps> = ({ text, onSubmit, canApplyFilter = true }) => {
  const style: React.CSSProperties = {
    width: '100%'
  }
  const [buttonEnabled, setButtonEnabled] = useState<boolean>(canApplyFilter)

  const { setShowDropdown } = useContext(DropdownContext) as any

  useEffect(() => {
    setButtonEnabled(canApplyFilter)
  }, [canApplyFilter])

  return (
    <div
      onClick={(checkedItems: any) => {
        if (buttonEnabled && onSubmit) onSubmit(checkedItems)
        setShowDropdown(false)
      }}>
      <Button className='Dropdown__submit' action='primary' disabled={!canApplyFilter} text={text} style={style} />
    </div>
  )
}

DropdownSelectSubmit.displayName = 'DropdownSelectSubmit'
export default DropdownSelectSubmit
