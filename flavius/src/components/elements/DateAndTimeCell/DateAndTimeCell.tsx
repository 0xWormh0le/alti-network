import React from 'react'
import Moment from 'react-moment'
import CONSTANTS from 'util/constants'
import './DateAndTimeCell.scss'

const { TIME_DISPLAY_FORMAT } = CONSTANTS

export interface DateAndTimeCellProps {
  value: number
}

export const DateAndTimeCell: React.FC<DateAndTimeCellProps> = ({ value, children }) => (
  <div className='DateAndTimeCell'>
    {!value ? (
      <span className='DateAndTimeCell__date--unknown'>unknown</span>
    ) : (
      <React.Fragment>
        <Moment unix={true} format={TIME_DISPLAY_FORMAT.DATE_FORMAT} className='DateAndTimeCell__date'>
          {value}
        </Moment>
        <div className='DateAndTimeCell__time-container'>
          <Moment className='DateAndTimeCell__time' unix={true} format={TIME_DISPLAY_FORMAT.TIME_FORMAT}>
            {value}
          </Moment>
          {children}
        </div>
      </React.Fragment>
    )}
  </div>
)

export default DateAndTimeCell
