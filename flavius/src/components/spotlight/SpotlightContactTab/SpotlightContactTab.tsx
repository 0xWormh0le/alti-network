import React from 'react'
import cx from 'classnames'
import Person from 'models/Person'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import PersonAvatar from 'components/elements/PersonAvatar'
import CopyEmail from 'components/spotlight/CopyEmail'
import Marker, { MarkerType } from 'components/elements/Marker'
import { truncateText } from 'util/helpers'
import { UsageKind } from 'types/common'
import './SpotlightContactTab.scss'

export interface SpotlightContactTabProps {
  emailInfo: Email
  isInternal: boolean
  isSelected: boolean
  person: Person
}

const SpotlightContactTab: React.FC<SpotlightContactTabProps> = ({ emailInfo, isInternal, isSelected, person }) => {
  const { H4 } = TypographyVariant
  const { address } = emailInfo

  const personInfo =
    person.primaryEmail?.address === address
      ? new Person({ ...person })
      : new Person({
          ...person,
          name: {
            givenName: '',
            familyName: '',
            fullName: ''
          },
          primaryEmail: {
            address,
            kind: UsageKind.personal,
            primary: true,
            riskCount: 0,
            accessCount: 0,
            lastDeletedPermissions: 0
          }
        })

  return (
    <div
      key={address}
      className={cx('SpotlightContactTabItem', {
        'SpotlightContactTabItem--selected': isSelected,
        external: !isInternal
      })}>
      <PersonAvatar
        style={{ fontSize: '0.75em', marginRight: '1em' }}
        person={personInfo}
        className='SpotlightContactTabItem__avatar'
        clickable={false}
      />
      {isSelected ? (
        <CopyEmail email={address ?? ''}>
          <Typography variant={H4} component='div' className='SpotlightContactTabItem__email-text'>
            {truncateText(address ?? '', isInternal ? 22 : 18)}
          </Typography>
        </CopyEmail>
      ) : (
        <Typography variant={H4} component='div' className='SpotlightContactTabItem__email-text'>
          {truncateText(address ?? '', isInternal ? 22 : 18)}
        </Typography>
      )}
      {emailInfo.kind === UsageKind.personal && (
        <Marker type={MarkerType.EmailExteranl} className='SpotlightContactTabItem__external-marker' />
      )}
    </div>
  )
}

export default SpotlightContactTab
