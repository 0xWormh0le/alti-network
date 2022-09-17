import React from 'react'
import cx from 'classnames'
import { getRisk } from 'util/helpers'
import './RiskIndicator.scss'

export declare type RiskIndicatorType = 'bar' | 'circle'

export interface RiskIndicatorProps {
  value: SeverityRange
  type?: RiskIndicatorType
}

export const RiskIndicator: React.FC<RiskIndicatorProps> = ({ value, type = 'bar' }) => {
  const risk = getRisk(value)

  return (
    <div className={`RiskIndicator RiskIndicator--${type}`}>
      <div
        className={cx(
          'RiskIndicator__inner',
          { 'RiskIndicator--veryhigh': risk.veryhigh },
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
