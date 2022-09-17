import React from 'react'
import Button from 'components/elements/Button'

export interface ButtonCellProps {
  value: any
  onClick: (param: any) => void
  className?: string
  disabled?: boolean
}

const ButtonCell: React.FC<ButtonCellProps> = (props) => {
  const { value, onClick, className, disabled } = props
  const clickHandler = (event: any) => {
    onClick(value)
  }

  return (
    <Button
      className={className}
      action='secondary'
      onClick={clickHandler}
      text={value.text}
      size='small'
      disabled={disabled}
    />
  )
}

export default ButtonCell
