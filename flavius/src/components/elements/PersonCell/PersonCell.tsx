import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import Person from 'models/Person'
import { isExternalEmail, modalBasePath, searchWithoutModalParams, truncateText } from 'util/helpers'
import { SharingRiskTypeIds } from 'models/RiskCatalog'
import { Tooltip } from 'components/widgets/Tooltip/Tooltip'
import Marker, { MarkerType } from 'components/elements/Marker'
import { UI_STRINGS } from 'util/ui-strings'
import { UserContext } from 'models/UserContext'
import Typography, { TypographyVariant } from '../Typography'
import './PersonCell.scss'

export interface PersonCellProps {
  personData: IPerson & { fileCount?: number; riskTypeId?: RiskTypeId }
}

export const PersonCell: React.FC<PersonCellProps> = ({ personData }) => {
  const user = useContext(UserContext)
  const person = new Person(personData)
  if (!person) return null
  const fileCount = personData.fileCount || 0
  const riskTypeId = personData.riskTypeId || 0
  const isExternal = isExternalEmail(user.domains, person?.primaryEmail ? person.primaryEmail.address ?? '' : '')
  // const displayUsername: boolean = Boolean(person && person?.displayName !== UI_STRINGS.RISKS.ANONYMOUS_USER)
  const { BODY } = TypographyVariant

  return (
    <div className='PersonCell'>
      {fileCount > 1 && SharingRiskTypeIds.indexOf(riskTypeId) === -1 ? (
        <div className='PersonCell__full-name'>
          <Tooltip text={UI_STRINGS.RISKS.TOOLTIP_MULTIPLE} id={`tooltip-multiple-id`}>
            <span>{UI_STRINGS.RISKS.MULTIPLE}</span>
          </Tooltip>
        </div>
      ) : (
        person &&
        (person.displayName && !person.anonymous ? (
          <Link
            to={`${modalBasePath()}/spotlight/${encodeURIComponent(
              person.primaryEmail?.address ?? ''
            )}${searchWithoutModalParams()}`}
            className='PersonCell__link'>
            {/* {displayUsername && (
              <div className='PersonCell__full-name'>
                <Typography variant={BODY} component='span' className='PersonCell__name'>
                  {person.displayName}
                </Typography>
                {isExternal && externalLabel}
              </div>
            )} */}
            <div className='PersonCell__email'>
              <Tooltip text={person.primaryEmail?.address ?? ''} id='tooltip-primary-email-id'>
                <span>{truncateText(person.primaryEmail?.address ?? '', isExternal ? 17 : 20)}</span>
              </Tooltip>
              {isExternal && (
                <Tooltip text={UI_STRINGS.SPOTLIGHT.EXTERNAL_TOOLTIP} id={`tooltip-ex-label-id`}>
                  <Marker type={MarkerType.Ext} className='PersonCell__email-ext' />
                </Tooltip>
              )}
            </div>
          </Link>
        ) : (
          <div className='PersonCell__full-name'>
            <Tooltip text={UI_STRINGS.RISKS.TOOLTIP_SHARED_DRIVE} id='tooltip-shared-id'>
              <Typography variant={BODY} component='span' className='PersonCell__name'>
                {UI_STRINGS.SPOTLIGHT.SHARED_DRIVE}
              </Typography>
            </Tooltip>
          </div>
        ))
      )}
    </div>
  )
}

export default PersonCell
