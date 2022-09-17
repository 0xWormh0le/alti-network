import React, { useState, useEffect } from 'react'
import { AccordionContext } from './AccordionContext'
import './Accordion.scss'

export interface AccordionProps {
  expanded?: boolean // initial state, should the accordion be expanded or not when loaded
  onChange?: (event: React.MouseEvent<HTMLButtonElement>, expanded: boolean) => void // callback after performing expand/collapse
}

const Accordion: React.FC<AccordionProps> = ({ expanded, onChange, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    if (expanded) {
      setIsOpen(true)
    }
  }, [expanded])

  const onToggle = (e: React.MouseEvent<HTMLButtonElement>): void => {
    setIsOpen(!isOpen)

    if (onChange) {
      onChange(e, !isOpen)
    }
  }

  return (
    <AccordionContext.Provider value={{ isOpen, onToggle }}>
      <div className='Accordion'>{children}</div>
    </AccordionContext.Provider>
  )
}

export default Accordion
