import React, { useEffect, useState, useRef } from 'react'
import cx from 'classnames'
import './InformationCard.scss'

interface InformationCardProps {
  icon?: React.ReactNode
  iconLocation?: 'top' | 'left'
  summary?: React.ReactNode | string
  initiallyOpen?: boolean
  className?: string
}

const InformationCard: React.FC<InformationCardProps> = ({
  icon,
  summary,
  iconLocation,
  children,
  className,
  initiallyOpen
}) => {
  const content = useRef<HTMLDivElement | null>(null)
  const [detailsVisible, setInformationCardVisible] = useState(initiallyOpen || !summary || false)

  const [maxHeight, setMaxHeight] = useState<string>('0px')

  useEffect(() => {
    if (content.current) {
      setMaxHeight(detailsVisible ? `${content.current.scrollHeight}px` : '0px')
    }
  }, [detailsVisible])

  return (
    <div className={cx('InformationCard', className)}>
      {icon && iconLocation === 'top' && (
        <div className={cx('InformationCard__icon', `InformationCard__icon--${iconLocation}`)}>{icon}</div>
      )}
      <div className='InformationCard__summary'>
        {icon && iconLocation === 'left' && (
          <div className={cx('InformationCard__icon', `InformationCard__icon--${iconLocation}`)}>{icon}</div>
        )}
        <span>{summary}</span>
      </div>
      <div
        ref={content}
        style={{ maxHeight }}
        className={cx('InformationCard__details', {
          'InformationCard__details--visible': detailsVisible,
          'InformationCard__details--invisible': !detailsVisible
        })}>
        {children}
      </div>
      {/* If no summary is given, assume all details should be shown at once. */}
      {summary && (
        <div className='InformationCard__read-more'>
          <button onClick={() => setInformationCardVisible(!detailsVisible)}>
            Read {detailsVisible ? 'Less' : 'More'}
          </button>
        </div>
      )}
    </div>
  )
}

InformationCard.defaultProps = {
  iconLocation: 'top'
}

export default InformationCard
