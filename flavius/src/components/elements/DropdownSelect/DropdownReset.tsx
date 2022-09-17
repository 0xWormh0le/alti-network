import React, { useContext } from 'react'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { DropdownContext } from './DropdownContext'
import './DropdownSelect.scss'

interface DropdownResetProps {
  text?: string
  onReset?: (checkedItems: any) => void
}

const DropdownReset: React.FC<DropdownResetProps> = ({ text, onReset }) => {
  const _text = text || 'Reset'
  const { defaultCheckboxes, setShowDropdown } = useContext(DropdownContext) as any
  const resetCheckboxes = () => {
    if (onReset && typeof onReset === 'function') {
      onReset(defaultCheckboxes)
    }
    setShowDropdown(false)
  }

  return (
    <div className='dropdown-reset-container'>
      <Typography
        variant={TypographyVariant.LABEL}
        weight='normal'
        className='dropdown-reset-container-link'
        onClick={resetCheckboxes}>
        {_text}
      </Typography>
    </div>
  )
}

DropdownReset.displayName = 'DropdownReset'
export default DropdownReset
