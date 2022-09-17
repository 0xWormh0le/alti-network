import React, { useContext } from 'react'
import cx from 'classnames'

import FormContext from '../FormContext'
import './FormLabel.scss'

export interface FormLabelProps {
  /**
   * Uses `controlId` from `<FormGroup>` if not explicitly specified.
   */
  htmlFor?: string
  children: React.ReactNode
  className?: string
}

export const FormLabel: React.FC<FormLabelProps> = ({ className, htmlFor, ...props }) => {
  const { controlId } = useContext(FormContext)
  htmlFor = htmlFor || controlId

  return (
    // eslint-disable-next-line jsx-a11y/label-has-for, jsx-a11y/label-has-associated-control
    <label className={cx('FormLabel', className)} htmlFor={htmlFor} {...props} />
  )
}

export default FormLabel
