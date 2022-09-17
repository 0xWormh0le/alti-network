import Tooltip from 'components/widgets/Tooltip'
import React from 'react'
import { Link } from 'react-router-dom'
import { modalBasePath, truncateText } from 'util/helpers'
import './PersonCell.scss'

export interface LitePersonCellProps {
  person: LitePerson
  platformId: string
}

const LitePersonCell: React.FC<LitePersonCellProps> = ({ person, platformId }) => {
  return (
    <div className='PersonCell'>
      <Link
        className='PersonCell__email'
        to={`${modalBasePath()}/spotlight/${encodeURIComponent(
          person.primaryEmail?.address ?? ''
        )}?platformId=${platformId}`}>
        <div className='PersonCell__email'>
          <Tooltip text={person.primaryEmail?.address ?? ''} id='tooltip-primary-email-id'>
            <span>{truncateText(person.primaryEmail?.address ?? '', 20)}</span>
          </Tooltip>
        </div>
      </Link>
    </div>
  )
}

export default LitePersonCell
