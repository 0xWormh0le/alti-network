import cx from 'classnames'
import React, { useContext } from 'react'
import FormContext from '../FormContext'
import './FormControl.scss'

export interface FormControlProps {
  component?: 'input' | 'textarea' | 'select' | React.ElementType
  readOnly?: boolean
  disabled?: boolean
  value?: string | number | string[]
  onChange?: React.FormEventHandler<this>
  onBlur?: React.FormEventHandler<this>
  onKeyDown?: React.FormEventHandler<this>
  onKeyUp?: React.FormEventHandler<this>
  onFocus?: React.FormEventHandler<this>
  placeholder?: string
  autoComplete?: string
  autoFocus?: boolean
  type?: string
  id?: string
  name?: string
  isValid?: boolean
  isInvalid?: boolean
  errorMessage?: string
  className?: string
  children?: React.ReactNode
  variant?: 'flat' | 'shadowed'
}

export type Ref = HTMLElement

export const FormControl = React.forwardRef<Ref, FormControlProps>(
  (
    { type, name, id, className, isValid, isInvalid, errorMessage, readOnly, component, variant = 'flat', ...props },
    ref
  ) => {
    const { controlId } = useContext(FormContext)
    const Component = component || ('input' as React.ElementType)

    return (
      <>
        <Component
          {...props}
          type={type}
          readOnly={readOnly}
          name={name}
          id={id || controlId}
          ref={ref}
          className={cx('FormControl', `FormControl--${variant}`, { 'FormControl--invalid': isInvalid }, className)}
        />
        {isInvalid && errorMessage && <div className='FormControl--invalid-message'>{errorMessage}</div>}
      </>
    )
  }
)

export default FormControl
