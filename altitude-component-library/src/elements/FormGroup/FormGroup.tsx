import React, { useMemo } from 'react'
import cx from 'classnames'

import FormContext from '../FormContext'
import './FormGroup.scss'

export interface FormGroupProps {
  controlId?: string
  children: React.ReactNode
  className?: string
}

export const FormGroup: React.FC<FormGroupProps> = ({ className, children, controlId, ...props }) => {
  const context = useMemo(() => ({ controlId }), [controlId])

  return (
    <FormContext.Provider value={context}>
      <div {...props} className={cx('FormGroup', className)}>
        {children}
      </div>
    </FormContext.Provider>
  )
}

export default FormGroup
