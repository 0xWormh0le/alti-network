import React from 'react'
import PlatformIcon from './PlatformIcon'
import Tooltip from 'components/widgets/Tooltip'
import { Link } from 'react-router-dom'
import { getAllPlatformsBasicData } from 'util/platforms'
import './Platform.scss'

interface PlatformCellProps {
  platformId: string
  size?: number
  className?: string
  showPlatformName?: boolean
  url?: string
}

const getPlatformName = (platformId: string): string => {
  const allPlatforms = getAllPlatformsBasicData()
  return allPlatforms.find((item) => item.platformId === platformId)?.platformName || ''
}

const PlatformCell: React.FC<PlatformCellProps> = ({
  platformId,
  size,
  className = '',
  showPlatformName = false,
  url
}) => {
  const platformName = getPlatformName(platformId)

  return (
    <div className='platform-container'>
      <Tooltip text={platformName} id={platformId}>
        {url ? (
          <Link to={{ pathname: url }} target='_blank' rel='noopener noreferrer'>
            <div>
              <div>
                <PlatformIcon platformId={platformId} size={size} platformName={platformName} />
              </div>
              {showPlatformName && <div className={className}>{platformId}</div>}
            </div>
          </Link>
        ) : (
          <div>
            <div>
              <PlatformIcon platformId={platformId} size={size} platformName={platformName} />
            </div>
            {showPlatformName && <div className={className}>{platformId}</div>}
          </div>
        )}
      </Tooltip>
    </div>
  )
}

export default PlatformCell
