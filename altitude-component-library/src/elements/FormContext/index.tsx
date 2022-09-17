import React from 'react'

interface FormContextType {
  controlId?: string
}

const FormContext = React.createContext({ controlId: undefined } as FormContextType)

export default FormContext
