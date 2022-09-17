import React from 'react'
import { Link } from 'react-router-dom'

import Person from 'models/Person'
import PersonAvatar from 'components/elements/PersonAvatar'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { modalBasePath } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import './DashboardPersonInfo.scss'

export interface DashboardPersonInfoProps {
  person: Person
}

export const DashboardPersonInfo: React.FC<DashboardPersonInfoProps> = ({ person }) => {
  const { displayName, primaryEmail } = person
  const displayUsername: boolean = Boolean(person && person.displayName !== UI_STRINGS.RISKS.ANONYMOUS_USER)

  return (
    <div className='DashboardPersonInfo'>
      <PersonAvatar
        style={{ fontSize: '1.25em', display: 'inline-block' }}
        person={person}
        className='DashboardPersonInfo__avatar'
        clickable={true}
      />
      <div className='DashboardPersonInfo__text'>
        {displayUsername && (
          <Typography variant={TypographyVariant.LABEL} component='div' className='DashboardPersonInfo__personname'>
            {displayName}
          </Typography>
        )}
        <Typography variant={TypographyVariant.BODY} component='div' className='DashboardPersonInfo__email'>
          <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(primaryEmail?.address || '')}`}>
            {primaryEmail?.address}
          </Link>
        </Typography>
      </div>
    </div>
  )
}

export default DashboardPersonInfo
