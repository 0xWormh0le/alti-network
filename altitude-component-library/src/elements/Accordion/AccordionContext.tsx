import React from 'react'

export interface AccordionContextValue {
  isOpen?: boolean
  onToggle?: React.MouseEventHandler<HTMLButtonElement>
}

export const AccordionContext = React.createContext<AccordionContextValue>({})
