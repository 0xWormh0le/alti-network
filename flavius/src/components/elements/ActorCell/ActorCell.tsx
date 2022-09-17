import React from 'react'
import { Link } from 'react-router-dom'
import Person from 'models/Person'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import AnonymousPerson from 'models/AnonymousPerson'
import { renderAttributeIfDev } from 'util/helpers'
import './ActorCell.scss'

export interface ActorCellProps {
  value: {
    get: (x: keyof Actor) => any
  }
}

export const ActorCell: React.FC<ActorCellProps> = ({ value }) => {
  const person = value ? Person.fromMap(value) : new AnonymousPerson()

  return (
    <div className='ActorCell' {...renderAttributeIfDev({ 'data-testid': 'actorCellContainer' })}>
      <Link
        to={`${modalBasePath()}/spotlight/${
          person.anonymous
            ? encodeURIComponent(person.primaryEmail?.address ?? '') // altnetId
            : encodeURIComponent(person.primaryEmail?.address ?? '')
        }${searchWithoutModalParams()}`}
        className='ActorCell__link'>
        <div className='ActorCell__full-name' {...renderAttributeIfDev({ 'data-testid': 'actorFullName' })}>
          {person.displayName}
        </div>
        {person.primaryEmail?.address && <div className='ActorCell__email'>{person.primaryEmail?.address}</div>}
      </Link>
    </div>
  )
}

export default ActorCell
