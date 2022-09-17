import React, { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { PlatformsContext } from 'util/platforms'
import UI_STRINGS from 'util/ui-strings'
import './ExplorePlatformsHeader.scss'

interface ExplorePlatformsHeaderProps {
  isLite: boolean
  person: string
}

const ExplorePlatformsHeader: React.FC<ExplorePlatformsHeaderProps> = ({ isLite, person }) => {
  const { platforms } = useContext(PlatformsContext)

  const loc = useLocation()

  if (!Object.values(platforms || {}).length) return null

  return (
    <div className='ExplorePlatformsHeader__container'>
      <div className='ExplorePlatformsHeader'>
        <div className='ExplorePlatformsHeader__buttons'>
          {isLite ? (
            <Link className='Button' to={loc.pathname}>
              {UI_STRINGS.EXPLORE_PLATFORMS_HEADER.VIEW_MAIN_SPOTLIGHT}
            </Link>
          ) : (
            Object.values(platforms || {}).map((p) => (
              <Link className='Button' key={p.platformId} to={`${loc.pathname}?platformId=${p.platformId}`}>
                {UI_STRINGS.EXPLORE_PLATFORMS_HEADER.VIEW_PLATFORM(p.platformName)}
              </Link>
            ))
          )}
        </div>
        <div className='ExplorePlatformsHeader__text'>
          {isLite ? (
            <span>{UI_STRINGS.EXPLORE_PLATFORMS_HEADER.THIS_CONTAINS_ONE_PLATFORM} </span>
          ) : (
            <span>{UI_STRINGS.EXPLORE_PLATFORMS_HEADER.THIS_IS_MAIN_SPOTLIGHT} </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ExplorePlatformsHeader
