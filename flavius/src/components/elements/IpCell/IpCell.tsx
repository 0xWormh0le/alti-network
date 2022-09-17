import React from 'react'
import TooltipIp from 'components/elements/TooltipIp'
import './IpCell.scss'

export interface IpCellProps {
  value: string
}

const IpCell: React.FC<IpCellProps> = ({ value }) => {
  return (
    <div className='IpCell'>
      <TooltipIp ipAddress={value} />
    </div>
  )
}

export default IpCell
