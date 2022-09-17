import React from 'react'
import cx from 'classnames'
import Spinner from 'components/widgets/Spinner'
import './Button.scss'

export interface ButtonProps {
  action:
    | 'primary'
    | 'secondary'
    | 'cancel_primary'
    | 'cancel_secondary'
    | 'alert'
    | 'pagination'
    | 'submit'
    | 'tertiary'
    | 'simple'
  isLoading?: boolean
  text: string | React.ReactNode
  size?: 'small' | 'normal' | 'large'
  loadingText?: string
  className?: string
  disabled?: boolean
  onClick?: any
  style?: React.CSSProperties
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
  style,
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
      { 'Button--pagination': action === 'submit' || action === 'pagination' },
      { 'Button--disabled': disabled },
      { 'Button--tertiary': action === 'tertiary' },
      { 'Button--simple': action === 'simple' },
      { [`Button--size-${size}`]: size === 'small' || size === 'large' }
    )}
    disabled={disabled || isLoading}
    type={props.type ? props.type : 'button'}
    {...props}
    style={style}>
    {isLoading && <Spinner className='Button__spinner' />}
    {!isLoading ? text : loadingText}
  </button>
)

export default Button
