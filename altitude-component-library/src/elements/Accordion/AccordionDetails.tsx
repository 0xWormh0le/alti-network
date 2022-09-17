import React, { useContext, useRef, useState, useEffect } from 'react'
import { AccordionContext } from './AccordionContext'
import './Accordion.scss'

const AccordionDetails: React.FC = ({ children }) => {
  const { isOpen } = useContext(AccordionContext)
  const content = useRef<HTMLDivElement | null>(null)
  const [maxHeight, setMaxHeight] = useState<string>('0px')

  useEffect(() => {
    if (content.current) {
      setMaxHeight(isOpen ? `${content.current.scrollHeight}px` : '0px')
    }
  }, [isOpen, children])

  return (
    <div
      ref={content}
      style={{ maxHeight: `${maxHeight}` }}
      className={`Accordion__details Accordion__details--${isOpen ? 'open' : 'close'}`}>
      {children}
    </div>
  )
}

export default AccordionDetails
