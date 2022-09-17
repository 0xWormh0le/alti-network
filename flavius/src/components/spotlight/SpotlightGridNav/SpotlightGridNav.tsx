import React from 'react'
import ContentLoader from 'react-content-loader'
import cx from 'classnames'

// import { largeNumberDisplay } from 'util/helpers'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import config from 'config'
import moment from 'moment'
import { UsageKind } from 'types/common'
import './SpotlightGridNav.scss'

export interface SubNavTab {
  label: string
  seriesKey: SubNavType
  value: number
  valueType: 'risk' | 'event' | 'file'
  unit: string
  renderDetailsTable: (personId: string) => JSX.Element
}

export interface SpotlightGridNavProps {
  subNavTabs: SubNavTab[]
  selectedSubNavKey: SubNavType
  subNavLoaded: boolean
  personInfo: Email[]
  selectedEmail: string
  removedAccessCards: string[]
  isLite?: boolean
  onSubNavClick: (key: SubNavType) => void
  onRemoveAccessClick: (emailInfo: any) => void
}

export const checkPendingRemoveAccessStatus = (lastRemovedPermissions: number | null): boolean => {
  const oneDay = 24 * 60 * 60
  if (lastRemovedPermissions === null) {
    return false
  } else {
    return moment().unix() - lastRemovedPermissions > oneDay
  }
}

export const SpotlightGridNav: React.FC<SpotlightGridNavProps> = ({
  subNavTabs,
  selectedSubNavKey,
  onSubNavClick,
  onRemoveAccessClick,
  subNavLoaded,
  personInfo,
  selectedEmail,
  isLite,
  removedAccessCards
}) => {
  const selectedInfo: Email | undefined =
    personInfo &&
    personInfo.find((element: Email) => {
      return element?.address === selectedEmail
    })

  const lastRemovedPermissions = personInfo && selectedInfo ? selectedInfo.lastDeletedPermissions : null
  const isPendingRemove =
    selectedInfo &&
    selectedInfo.kind !== UsageKind.personal &&
    (removedAccessCards.includes(selectedEmail) || checkPendingRemoveAccessStatus(lastRemovedPermissions))

  return (
    <div className='SpotlightGridNav'>
      {!isLite && (
        <div className='SpotlightGridNav__group'>
          <Typography variant='body' weight='bold' className='SpotlightGridNav__group--title'>
            Risks
          </Typography>
          <hr />
          {subNavTabs
            .filter((tab) => tab.valueType === 'risk')
            .map((tab, index) => (
              <SpotlightGridNavTabItem
                key={index}
                tab={tab}
                selectedSubNavKey={selectedSubNavKey}
                subNavLoaded={subNavLoaded}
                onSubNavClick={onSubNavClick}
              />
            ))}
        </div>
      )}
      <div className='SpotlightGridNav__group'>
        <Typography variant='body' weight='bold' className='SpotlightGridNav__group--title'>
          Files
        </Typography>
        <hr />
        {subNavTabs
          .filter((tab) => tab.valueType === 'file')
          .map((tab, index) => (
            <SpotlightGridNavTabItem
              key={index}
              tab={tab}
              selectedSubNavKey={selectedSubNavKey}
              subNavLoaded={subNavLoaded}
              onSubNavClick={onSubNavClick}
            />
          ))}
      </div>
      <div className='SpotlightGridNav__group'>
        <Typography variant='body' weight='bold' className='SpotlightGridNav__group--title'>
          Activity
        </Typography>
        <hr />
        {subNavTabs
          .filter((tab) => tab.valueType === 'event')
          .map((tab, index) => (
            <SpotlightGridNavTabItem
              key={index}
              tab={tab}
              selectedSubNavKey={selectedSubNavKey}
              subNavLoaded={subNavLoaded}
              onSubNavClick={onSubNavClick}
            />
          ))}
      </div>
      {selectedInfo &&
        selectedInfo.kind === UsageKind.personal &&
        !isPendingRemove &&
        config.featureFlags.ENABLE_BULK_PERMISSION_EDIT && (
          <div className='SpotlightGridNav__action'>
            <button className='SpotlightGridNav__action--remove' onClick={() => onRemoveAccessClick(selectedInfo)}>
              Remove All File Access
            </button>
          </div>
        )}
    </div>
  )
}

interface SpotlightGridNavTabProps {
  tab: SubNavTab
  selectedSubNavKey: SubNavType
  subNavLoaded: boolean
  onSubNavClick: (key: SubNavType) => void
}
const SpotlightGridNavTabItem: React.FC<SpotlightGridNavTabProps> = ({
  tab,
  selectedSubNavKey,
  subNavLoaded,
  onSubNavClick
}) => (
  <nav
    key={tab.seriesKey}
    className={cx('SpotlightGridNav__item', {
      'SpotlightGridNav__item--selected': tab.seriesKey === selectedSubNavKey
    })}
    onClick={() => onSubNavClick(tab.seriesKey)}>
    <Typography variant={TypographyVariant.BODY_SMALL} component='span' className='SpotlightGridNav__item-label'>
      {tab.label}
    </Typography>
    <Typography
      variant={TypographyVariant.BODY_SMALL}
      weight='bold'
      component='span'
      className='SpotlightGridNav__item-value'>
      {subNavLoaded ? (
        // largeNumberDisplay(tab.value)
        ''
      ) : (
        <SpotlightGridNavNumberLoading active={tab.seriesKey === selectedSubNavKey} />
      )}
    </Typography>
  </nav>
)

const SpotlightGridNavNumberLoading = ({ active }: { active: boolean }) => (
  <div className='SpotlightGridNavNumberLoading'>
    <ContentLoader
      backgroundColor={active ? '#52a3ff' : '#F0F0F0'}
      foregroundColor={active ? '#d0e6ff' : '#F7F7F7'}
      height={45}
      width={32}
      uniqueKey={`SpotlightGridNavNumberLoading-${active ? 'blue' : 'grey'}`}>
      <rect x={0} y={16} width={32} height={13} rx={4} ry={4} />
    </ContentLoader>
  </div>
)

export default SpotlightGridNav
