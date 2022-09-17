import React, { useContext } from 'react'
import { AccordionContext } from './AccordionContext'
import './Accordion.scss'
import { default as ChevronDown } from '../../icons/chevron-down.svg'

const AccordionSummary: React.FC = ({ children }) => {
  const { isOpen, onToggle } = useContext(AccordionContext)

  return (
    <div className='Accordion__summary'>
      {children}
      <button className={`Accordion__expand Accordion__expand--${isOpen ? 'open' : 'close'}`} onClick={onToggle}>
        <ChevronDown />
      </button>
    </div>
  )
}

export default AccordionSummary
