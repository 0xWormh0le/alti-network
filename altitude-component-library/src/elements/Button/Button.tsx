import React from 'react'
import cx from 'classnames'
import Spinner from 'widgets/Spinner'
import './Button.scss'

export interface ButtonProps {
  action: 'primary' | 'secondary' | 'cancel_primary' | 'cancel_secondary' | 'alert' | 'pagination' | 'tertiary'
  isLoading?: boolean
  text: string
  size?: 'small' | 'normal' | 'large'
  loadingText?: string
  className?: string
  disabled?: boolean
  onClick?: any
  type?: 'submit' | 'reset'
  onMouseOver?: () => void
  onMouseOut?: () => void
}

// A wrapper around the html5 button that supports a 'loading' state
export const Button: React.FC<ButtonProps> = ({
  action,
  isLoading,
  text,
  loadingText,
  className = '',
  disabled = false,
  size = 'normal',
  ...props
}) => (
  <button
    onMouseOver={props.onMouseOver}
    onMouseOut={props.onMouseOut}
    className={cx(
      'Button',
      className,
      { 'Button--primary': action === 'primary' },
      { 'Button--secondary': action === 'secondary' },
      { 'Button--cancel-primary': action === 'cancel_primary' },
      { 'Button--cancel-secondary': action === 'cancel_secondary' },
      { 'Button--alert': action === 'alert' },
      { 'Button--pagination': action === 'pagination' },
      { 'Button--disabled': disabled },
      { 'Button--tertiary': action === 'tertiary' },
      { [`Button--size-${size}`]: size === 'small' || size === 'large' }
    )}
    disabled={disabled || isLoading}
    type={props.type ? props.type : 'button'}
    {...props}>
    {isLoading && <Spinner className='Button__spinner' />}
    {!isLoading ? text : loadingText}
  </button>
)

export default Button
