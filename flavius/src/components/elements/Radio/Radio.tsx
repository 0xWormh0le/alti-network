import React from 'react'
import cx from 'classnames'
import './Radio.scss'

export interface RadioProps {
  labelText?: string
  name?: string
  checked?: boolean
  onChange?: (...args: any[]) => any
  onBlur?: (...args: any[]) => any
  className?: string
  labelOnRight?: boolean
  value?: any
  inline?: boolean
}

export const Radio: React.FC<RadioProps> = ({
  labelText,
  name,
  checked,
  onChange,
  onBlur,
  className,
  value,
  labelOnRight,
  inline
}) => (
  <div className={cx('Radio', { 'Radio--inline': inline }, className)}>
    <label
      className={cx('Radio__label', { 'Radio__label--left': !labelOnRight }, { 'Radio__label--right': labelOnRight })}>
      <input name={name} type='radio' checked={checked} onChange={onChange} onBlur={onBlur} value={value} />
      <i className='Radio__helper' />
      <span className='Radio__label-text'>{labelText}</span>
    </label>
  </div>
)

Radio.defaultProps = {
  labelOnRight: false
}

export default Radio
