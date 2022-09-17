import React from 'react'
import Moment from 'react-moment'
import CONSTANTS from 'util/constants'
import './DateRange.scss'

const { TIME_DISPLAY_FORMAT } = CONSTANTS

export interface DateRangeProps {
  from?: number
  to?: number
  className?: string
}

export const DateRange: React.FC<DateRangeProps> = ({ from, to, className }) => {
  const formattedFrom = (
    <Moment unix={true} format={TIME_DISPLAY_FORMAT.DATE_FORMAT} className='DateRange__date'>
      {from}
    </Moment>
  )
  const formattedTo = (
    <Moment unix={true} format={TIME_DISPLAY_FORMAT.DATE_FORMAT} className='DateRange__date'>
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
