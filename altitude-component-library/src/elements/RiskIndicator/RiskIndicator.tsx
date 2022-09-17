import React from 'react'
import cx from 'classnames'
import { getRisk } from 'util/helpers'
import './RiskIndicator.scss'

export interface RiskIndicatorProps {
  value: SeverityRange
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ value }) => {
  const risk = getRisk(value)
  return (
    <div className='RiskIndicator'>
      <div
        className={cx(
          'RiskIndicator__inner',
          { 'RiskIndicator--high': risk.high },
          { 'RiskIndicator--medium': risk.medium },
          { 'RiskIndicator--low': risk.low },
          { 'RiskIndicator--safe': risk.safe }
        )}
      />
    </div>
  )
}

export default RiskIndicator
