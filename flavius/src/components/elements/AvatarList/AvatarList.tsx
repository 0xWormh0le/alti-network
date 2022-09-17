import React from 'react'
import Person from 'models/Person'
import PersonAvatar from '../PersonAvatar'
import EllipsisIcon from 'icons/ellipsis'
import TooltipWrappedGlobeIcon from 'icons/TooltipWrappedGlobeIcon'
import { sharingIndicatorTooltipMapping } from '../VisibilityPill'
import { renderAttributeIfDev } from 'util/helpers'
import './AvatarList.scss'

export const UNEXPANDED_MAX_AVATARS = 12

export interface AvatarListProps {
  people: Person[]
}

interface AvatarListState {
  expanded: boolean
}

class AvatarList extends React.Component<AvatarListProps, AvatarListState> {
  constructor(props: AvatarListProps) {
    super(props)

    this.state = {
      expanded: false
    }
  }

  private setExpanded = (expanded: boolean) => {
    this.setState({ expanded })
  }

  public render() {
    const { people } = this.props
    const { expanded } = this.state

    const peopleToShow = expanded ? people : people.slice(0, UNEXPANDED_MAX_AVATARS)

    return (
      <div className='AvatarList'>
        {peopleToShow.map((person, index) => {
          if (person.primaryEmail?.address === 'global') {
            return (
              <TooltipWrappedGlobeIcon
                key='global'
                className='AvatarList__item-globe'
                text={sharingIndicatorTooltipMapping('external')}
              />
            )
          }
          return (
            <PersonAvatar
              key={`${person.primaryEmail?.address}-${index}`} // altnetId
              person={person}
              className='AvatarList__item'
              clickable={true}
            />
          )
        })}
        {!expanded && people.length > UNEXPANDED_MAX_AVATARS && (
          <button
            className='AvatarList__expand'
            onClick={() => this.setExpanded(true)}
            {...renderAttributeIfDev({ 'data-testid': 'expand-avatar-list' })}>
            <EllipsisIcon className='AvatarList__expand-icon' alt='Expand list button' />
          </button>
        )}
      </div>
    )
  }
}

export default AvatarList
