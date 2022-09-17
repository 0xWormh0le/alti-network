import React, { Fragment } from 'react'
import ContentLoader from 'react-content-loader'
import { BaseAvatar } from '@altitudenetworks/component-library/'

import Person from 'models/Person'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import CopyEmail from 'components/spotlight/CopyEmail'
import Marker, { MarkerType } from 'components/elements/Marker'
import withContentLoader from 'hocs/withContentLoader'
import { largeNumberDisplay, pluralize, truncateText } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { UserKind } from 'types/common'
import CONSTANTS from 'util/constants'
import './SpotlightHeader.scss'

export interface SpotlightHeaderProps {
  person?: Maybe<Person | LitePerson>
}

export const SpotlightHeader: React.FC<SpotlightHeaderProps> = ({ person }) => {
  const displayUsername: boolean = Boolean(person && person.displayName !== UI_STRINGS.RISKS.ANONYMOUS_USER)
  const showAvatar = (person?.emails === undefined || person.emails.length === 0) && person?.recoveryEmail === undefined

  return person ? (
    <div className='SpotlightHeader'>
      <div className='SpotlightHeader__title'>
        {showAvatar && (
          <BaseAvatar
            style={{ fontSize: '1rem' }}
            colorList={CONSTANTS.COLOR_LIST}
            src={person.avatar}
            name={person.displayName || person.name.fullName}
          />
        )}
        {displayUsername && (
          <Typography variant={TypographyVariant.H3} weight='normal' className='SpotlightHeader__title-name'>
            {person.displayName}
          </Typography>
        )}
        {!person.emails?.length && !person.anonymous && (
          <>
            <CopyEmail email={person.primaryEmail?.address ?? ''}>
              <Typography variant={TypographyVariant.BODY} component='span' className='SpotlightHeader__title--email'>
                {truncateText(person.primaryEmail?.address ?? '')}
              </Typography>
            </CopyEmail>
            {person.userKind === UserKind.person && (
              <Marker type={MarkerType.EmailExteranl} className='SpotlightHeader__external' />
            )}
          </>
        )}
        {/* Using a property that only exists in person, pending a refactor */}
        {!person.anonymous && person.userKind && (
          <Fragment>
            <span className='SpotlightHeader__title-separator'>|</span>
            <Typography variant={TypographyVariant.BODY} component='span' className='SpotlightHeader__title-count'>
              {getEmailCountString(person)}
            </Typography>
            <span className='SpotlightHeader__title-separator'>|</span>
            <Typography variant={TypographyVariant.BODY} component='span' className='SpotlightHeader__title-count'>
              {getFileCountString(person)}
            </Typography>
            <span className='SpotlightHeader__title-separator'>|</span>
            <Typography variant={TypographyVariant.BODY} component='span' className='SpotlightHeader__title-count'>
              {getRiskCountString(person)}
            </Typography>
          </Fragment>
        )}
        {person.anonymous && (
          // altnetId:
          <Typography variant={TypographyVariant.H3} component='span' className='SpotlightHeader__title--email'>
            ID: {person.primaryEmail?.address}
          </Typography>
        )}
      </div>
    </div>
  ) : null
}

const getEmailCountString = (person: Person) => {
  const emailCount = person.emails.length + 1

  return `${emailCount} ${pluralize('email', emailCount)}`
}

const getRiskCountString = (person: Person) => {
  const riskCount = (person.riskCount || 0) + person.emails.reduce((acc, email) => acc + email.riskCount || 0, 0)

  return `${largeNumberDisplay(riskCount)} risk${riskCount === 1 ? '' : 's'} total`
}

const getFileCountString = (person: Person) => {
  const fileCount = (person.accessCount || 0) + person.emails.reduce((acc, email) => acc + email.accessCount || 0, 0)

  return `${largeNumberDisplay(fileCount)} file${fileCount === 1 ? '' : 's'} total`
}

const SpotlightHeaderLoading = () => (
  <div className='SpotlightHeaderLoading'>
    <ContentLoader
      backgroundColor='#f0f0f0'
      foregroundColor='#f7f7f7'
      width={500}
      height={40}
      className='SpotlightHeaderLoading__content'
      uniqueKey='SpotlightHeaderLoading__content'>
      <circle cx={20} cy={20} r={20} />
      <rect x={50} y={10} width={450} height={20} rx={4} ry={4} />
    </ContentLoader>
  </div>
)

export default withContentLoader(SpotlightHeaderLoading)(SpotlightHeader)
