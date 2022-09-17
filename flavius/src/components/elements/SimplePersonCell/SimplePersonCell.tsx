import React from 'react'
import { Link } from 'react-router-dom'
import Person from 'models/Person'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import './SimplePersonCell.scss'

export interface SimplePersonCellProps {
  personInfo: IPerson
}

export const SimplePersonCell: React.FC<SimplePersonCellProps> = ({ personInfo }) => {
  const person = new Person(personInfo)

  return (
    <div className='SimplePersonCell'>
      {person &&
        (person.displayName ? (
          // altnetId
          <Link
            to={`${modalBasePath()}/spotlight/${encodeURIComponent(
              person.primaryEmail?.address ?? ''
            )}${searchWithoutModalParams()}`}
            className='SimplePersonCell__link'>
            <div className='SimplePersonCell__full-name'>{person.displayName}</div>
            <div className='SimplePersonCell__email'>{person.primaryEmail?.address}</div>
          </Link>
        ) : (
          // altnetId
          <Link
            to={`${modalBasePath()}/spotlight/${encodeURIComponent(
              person.primaryEmail?.address ?? ''
            )}${searchWithoutModalParams()}`}
            className='SimplePersonCell__link'>
            <div className='SimplePersonCell__email'>{person.primaryEmail?.address}</div>
          </Link>
        ))}
    </div>
  )
}

export default SimplePersonCell
