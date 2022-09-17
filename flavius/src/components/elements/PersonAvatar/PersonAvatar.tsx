import React, { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import Person from 'models/Person'
import { BaseAvatar } from '@altitudenetworks/component-library/'
import Tooltip from 'components/widgets/Tooltip'
import CONSTANTS from 'util/constants'
import UI_STRINGS from 'util/ui-strings'
import './PersonAvatar.scss'

export interface PersonAvatarProps {
  person: Person | LitePerson
  className?: string
  clickable?: boolean
  style?: CSSProperties
}

const PersonAvatar: React.FC<PersonAvatarProps> = ({ person, className, clickable = false, style = {} }) => {
  const primaryTooltipText =
    person.displayName !== UI_STRINGS.RISKS.ANONYMOUS_USER
      ? person.displayName
        ? person.displayName
        : person.name.fullName
      : ''

  const secondaryTooltipText = person.displayName === person.primaryEmail?.address ? '' : person.primaryEmail?.address
  // altnetId: person.primaryEmail?.address
  const baseAvatarWrapper = (
    <Tooltip
      text={primaryTooltipText}
      secondaryText={secondaryTooltipText}
      id={`tooltip-avatar-${person.primaryEmail?.address}-id`}>
      <span className={cx('PersonAvatar', className, { PersonAvatar__clickable: clickable })}>
        <BaseAvatar
          style={{ ...style }}
          src={person.avatar}
          name={person.displayName || person.name.fullName}
          colorList={CONSTANTS.COLOR_LIST}
        />
      </span>
    </Tooltip>
  )
  // altnetId: person.primaryEmail?.address
  return clickable ? (
    <Link
      to={`${modalBasePath()}/spotlight/${encodeURIComponent(
        person.primaryEmail?.address ?? ''
      )}${searchWithoutModalParams()}`}>
      {baseAvatarWrapper}
    </Link>
  ) : (
    baseAvatarWrapper
  )
}

export default PersonAvatar
