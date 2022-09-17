import React from 'react'
import cx from 'classnames'
import PersonAvatar from 'components/elements/PersonAvatar'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { truncateText } from 'util/helpers'
import CopyEmail from '../CopyEmail'
import '../SpotlightContactTab/SpotlightContactTab.scss'

interface LiteSpotlightContactTabProps {
  emailInfo?: {
    address: string
  }
  person: Maybe<LitePerson>
  isSelected: boolean
}

const LiteSpotlightContactTab: React.FC<LiteSpotlightContactTabProps> = (props) => {
  const { isSelected, person, emailInfo } = props
  return (
    <div
      className={cx('SpotlightContactTabItem', {
        'SpotlightContactTabItem--selected': isSelected
      })}>
      {person && (
        <PersonAvatar
          style={{ fontSize: '0.75em', marginRight: '1em' }}
          person={person}
          className='SpotlightContactTabItem__avatar'
          clickable={false}
        />
      )}
      {isSelected ? (
        <CopyEmail email={emailInfo?.address ?? ''}>
          <Typography variant={TypographyVariant.H4} component='div' className='SpotlightContactTabItem__email-text'>
            {truncateText(emailInfo?.address ?? '', 18)}
          </Typography>
        </CopyEmail>
      ) : (
        <Typography variant={TypographyVariant.H4} component='div' className='SpotlightContactTabItem__email-text'>
          {truncateText(emailInfo?.address ?? '', 18)}
        </Typography>
      )}
    </div>
  )
}

export default LiteSpotlightContactTab
