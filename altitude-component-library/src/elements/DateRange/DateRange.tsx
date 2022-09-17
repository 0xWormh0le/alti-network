import React from 'react'
import Moment from 'react-moment'
import './DateRange.scss'

export interface DateRangeProps {
  from?: number
  to?: number
  className?: string
  displayFormat: string
}

export const DateRange: React.FC<DateRangeProps> = ({ from, to, className, displayFormat }) => {
  const formattedFrom = (
    <Moment unix={true} format={displayFormat} className='DateRange__date'>
      {from}
    </Moment>
  )
  const formattedTo = (
    <Moment unix={true} format={displayFormat} className='DateRange__date'>
      {to}
    </Moment>
  )

  return (
    <div className={`DateRange ${className}`}>
      {formattedFrom} - {formattedTo}
    </div>
  )
}

export default DateRange
