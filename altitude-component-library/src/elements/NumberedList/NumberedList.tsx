import React from 'react'

import './NumberedList.scss'

export interface NumberedListProps {
  children: React.ReactNode
}

export const NumberedList: React.FC<NumberedListProps> = ({ children }) => {
  const childrenArray: React.ReactNodeArray = Array.isArray(children) ? (children as React.ReactNodeArray) : [children]
  return (
    <div className='NumberedList'>
      {childrenArray.map((child, index) => (
        <div className='NumberedList__item' key={index}>
          <div className='NumberedList__col-number'>
            <div className='NumberedList__item-number'>{index + 1}</div>
          </div>
          {child}
        </div>
      ))}
    </div>
  )
}

export default NumberedList
