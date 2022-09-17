import React from 'react'
import cx from 'classnames'
import './Checkbox.scss'

export interface CheckboxProps {
  labelText?: string
  name?: string
  checked?: boolean
  onChange?: (...args: any[]) => any
  onBlur?: (...args: any[]) => any
  className?: string
  labelOnRight?: boolean
}

export const Checkbox: React.FC<CheckboxProps> = ({
  labelText,
  name,
  checked,
  onChange,
  onBlur,
  className,
  labelOnRight
}) => (
  <div className={cx('Checkbox', className)}>
    <label
      className={cx(
        'Checkbox__label',
        { 'Checkbox__label--left': !labelOnRight },
        { 'Checkbox__label--right': labelOnRight }
      )}>
      <input name={name} type='checkbox' checked={checked} onChange={onChange} onBlur={onBlur} />
      <i className='Checkbox__helper' />
      <span className='Checkbox__label-text'>{labelText}</span>
    </label>
  </div>
)

Checkbox.defaultProps = {
  labelOnRight: false
}

export default Checkbox
