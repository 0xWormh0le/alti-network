import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ellipsify, modalBasePath, getExtraParamsByRiskTypeId } from 'util/helpers'
import RiskCatalog, { RelationshipRiskTypeIds, ActivityRiskTypeIds } from 'models/RiskCatalog'
import Tooltip from 'components/widgets/Tooltip'
import UI_STRINGS from 'util/ui-strings'
import Moment from 'react-moment'
import CONSTANTS from 'util/constants'
import './RiskDescriptionCell.scss'

export interface RiskDescriptionCellProps {
  displayRiskDescription: DisplayRiskDescription
}

interface UserEmailProps {
  isAnonymous: boolean
  displayRiskDescription: DisplayRiskDescription
}

const UserEmail: React.FC<UserEmailProps> = ({ isAnonymous, displayRiskDescription }) => {
  const { riskId, email = '', riskTypeId } = displayRiskDescription
  const extraParams = getExtraParamsByRiskTypeId(riskTypeId)

  return isAnonymous ? (
    <Tooltip text={UI_STRINGS.RISKS.CLICK_TO_LEARN_MORE_ANONYMOUS} id={`tooltip-anonymous-${riskId}-id`}>
      <a
        href='https://blog.altitudenetworks.com/about-the-google-drive-anonymous-user/'
        target='_blank'
        rel='noopener noreferrer'>
        {UI_STRINGS.RISKS.ANONYMOUS_USER}
      </a>
    </Tooltip>
  ) : (
    <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(email)}${extraParams}`}>{email}</Link>
  )
}

export const RiskDescriptionCell: React.FC<RiskDescriptionCellProps> = ({ displayRiskDescription }) => {
  const riskDescription = displayRiskDescription

  const { platformId, pluginId, pluginName, riskTypeId, text: rawText, personId, incidentDate } = riskDescription
  const isAnonymous = personId === undefined

  const extraParams = useMemo(() => {
    const params = new URLSearchParams(getExtraParamsByRiskTypeId(riskTypeId))
    params.set('platformId', platformId)
    return `?${params}`
  }, [platformId, riskTypeId])

  const text = ellipsify(rawText, 120)

  let content: React.ReactElement = useMemo(() => {
    return <>{text}</>
  }, [text])

  if (
    RiskCatalog.ManyDownloadsByApp.index === riskTypeId ||
    RiskCatalog.ManyDownloadsByAppNonCustomerOwned.index === riskTypeId
  ) {
    const actorText = (
      <>
        on behalf of <UserEmail isAnonymous={isAnonymous} displayRiskDescription={riskDescription} />
      </>
    )
    content = (
      <>
        {text}
        {pluginId ? (
          <>
            {' '}
            (
            <Link to={`${modalBasePath()}/app-spotlight/${pluginId}${extraParams}`}>
              {pluginName === 'GDrive'
                ? 'GDrive-' + pluginId
                : `${pluginName || UI_STRINGS.RISKS.UNKNOWN_APP} - ID:${pluginId}`}
            </Link>{' '}
            {actorText})
          </>
        ) : (
          <> {actorText}</>
        )}
      </>
    )
  } else if (
    RiskCatalog.ManyDownloadsByPersonInternal.index === riskTypeId ||
    RiskCatalog.ManyDownloadsByPersonExternal.index === riskTypeId ||
    RelationshipRiskTypeIds.includes(riskTypeId)
  ) {
    content = (
      <>
        {text} (<UserEmail isAnonymous={isAnonymous} displayRiskDescription={riskDescription} />)
      </>
    )
  }

  return (
    <div className='RiskDescriptionCell'>
      <span>{content}</span>
      {ActivityRiskTypeIds.includes(riskTypeId) && incidentDate && (
        <div className='RiskDescriptionCell__metadata'>
          {UI_STRINGS.RISKS.ACTIVITY_DATE_LABEL}:{' '}
          <Moment unix={true} utc={true} format={CONSTANTS.TIME_DISPLAY_FORMAT.DATE_FORMAT}>
            {incidentDate * 1000}
          </Moment>
        </div>
      )}
    </div>
  )
}

export default RiskDescriptionCell
