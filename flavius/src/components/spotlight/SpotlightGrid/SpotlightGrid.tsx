import React, { useState, useEffect, useCallback, useContext, useMemo } from 'react'
import cx from 'classnames'
import API from '@aws-amplify/api/lib'
import ContentLoader from 'react-content-loader'
import * as Sentry from '@sentry/browser'
import { Tabs, Tab, TabList } from '@altitudenetworks/component-library'
import SectionTitle from 'components/elements/SectionTitle'
import PreviewChart from 'components/elements/PreviewChart'
import PermissionDeletionStatus from 'components/elements/PermissionDeletionStatus'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import LineChart from 'components/elements/LineChart'
import ModalGroup from 'components/widgets/ModalGroup'
import { GENERAL_URLS } from 'api/endpoints'
import Person from 'models/Person'
import { UserContext } from 'models/UserContext'
import SpotlightHeader from '../SpotlightHeader'
import SpotlightGridNav, { SubNavTab } from '../SpotlightGridNav'
import SpotlightContactTab from '../SpotlightContactTab'
import noop from 'lodash/noop'
import { isExternalEmail, largeNumberWithPluralizedUnit } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { UsageKind, UserKind } from 'types/common'
import ExplorePlatformsHeader from '../ExplorePlatformsHeader'
import './SpotlightGrid.scss'

const TAB_WIDTH = 300

const pluralize = (word: string, count: number) => {
  return count === 1 ? word : `${word}s`
}

const getAllEmailsFromPerson = (person: IPerson): Email[] => {
  const { primaryEmail, recoveryEmail, accessCount, emails, riskCount, userKind } = person

  return [
    {
      address: primaryEmail?.address,
      primary: true,
      riskCount: riskCount || 0,
      accessCount: accessCount || 0,
      lastDeletedPermissions: person.primaryEmail?.lastDeletedPermissions || 0,
      kind: userKind === UserKind.person ? UsageKind.personal : UsageKind.work
    },
    ...(emails || [])
  ].concat(recoveryEmail ? recoveryEmail : [])
}

let personInfo: any[]

export interface SpotlightGridProps {
  subNavTabs: SubNavTab[]
  selectedSubNavKey: SubNavType
  selectedEmail: string
  subNavLoaded: boolean
  personLoading: boolean
  onSubNavClick: (key: SubNavType) => void
  onSelectedContactCardClick: (key: string) => void
  chartData?: { labels: number[]; series: number[] }
  activePerson?: Person
  renderDetailsTable: (personId: string) => React.ReactNode
  getData: () => void
  isLitePlatform: boolean
}

export const SpotlightGrid: React.FC<SpotlightGridProps> = ({
  subNavTabs,
  selectedSubNavKey,
  onSubNavClick,
  chartData,
  activePerson,
  personLoading,
  renderDetailsTable,
  onSelectedContactCardClick,
  getData,
  selectedEmail,
  subNavLoaded,
  isLitePlatform
}) => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [removeAccessInfo, setRemoveAccessInfo] = useState<Email>()
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [failModalVisible, setFailModalVisible] = useState(false)
  const [removingAccess, setRemovingAccess] = useState(false)
  const [removedAccessCards, setRemovedAccessCards] = useState<string[]>([])
  const [permissionsToBeDeletedCount, setPermissionsToBeDeletedCount] = useState(-1)

  const activeTab = subNavTabs.filter((tab) => tab.seriesKey === selectedSubNavKey)[0]
  let activeTitleText = ''
  switch (activeTab.valueType) {
    case 'file':
      activeTitleText = `Files ${activeTab.label}`
      break
    case 'event':
      activeTitleText = activeTab.label
      break
    case 'risk':
      activeTitleText = activeTab.seriesKey === 'risks' ? `${activeTab.label} Risks` : `Risks ${activeTab.label}`
      break
    default:
      const test: never = activeTab.valueType
      throw new Error(`A Spotlight Navigation tab can never have value type ${test}`)
  }

  const [chartVisible, setChartVisible] = useState(false)

  const clickHandler = (disabled: boolean) => {
    setChartVisible(disabled)
  }

  useEffect(() => {
    setChartVisible(false)
  }, [activeTab])

  useEffect(() => {
    if (activePerson) {
      personInfo = getAllEmailsFromPerson(activePerson)
    }
  }, [activePerson])

  const renderPreviewChart = (unit: string) => {
    if (!subNavLoaded) {
      return (
        <div className='PrevChartLoading'>
          <ContentLoader
            backgroundColor='#f0f0f0'
            foregroundColor='#f7f7f7'
            width={200}
            height={35}
            className='PrevChartLoading'
            uniqueKey='PrevChartLoading'>
            <rect x='0' y='5' width='200' height='35' />
          </ContentLoader>
        </div>
      )
    } else if (
      chartData &&
      chartData.labels &&
      chartData.series &&
      chartData.labels.length > 0 &&
      chartData.series.length > 0
    ) {
      return (
        <PreviewChart
          key={selectedSubNavKey}
          data={{ labels: chartData.labels, series: [chartData.series] }}
          unit={unit}
          onClick={clickHandler}
          colorful={activeTab.seriesKey === 'risks'}
        />
      )
    } else {
      return <></>
    }
  }

  const getPermissionsToBeDeletedCount = useCallback(async () => {
    if (removeAccessInfo?.address) {
      try {
        const resolutionStatusResponse: ResolutionStatus = await API.get(
          'permissions',
          `${GENERAL_URLS.PERMISSIONS}/status?email=${removeAccessInfo.address}`,
          {}
        )
        setPermissionsToBeDeletedCount(resolutionStatusResponse.active)
      } catch (err) {
        Sentry.captureException(err)
      }
    }
  }, [removeAccessInfo?.address])
  getPermissionsToBeDeletedCount()

  const openConfirmModalHandler = (emailInfo?: Email) => {
    setRemoveAccessInfo(undefined)
    setConfirmModalVisible(true)
    if (emailInfo) {
      setRemoveAccessInfo(emailInfo)
    } else {
      const email = personInfo.find((element) => {
        return element?.address === selectedEmail
      })
      setRemoveAccessInfo(email)
    }
  }

  const handleConfirmRemove = useCallback(async () => {
    try {
      setRemovingAccess(true)

      await API.del('permissions', `${GENERAL_URLS.PERMISSIONS}?email=${selectedEmail}`, {})
      getData()
      if (!removedAccessCards.includes(selectedEmail)) {
        setRemovedAccessCards([...removedAccessCards, selectedEmail])
      }

      setSuccessModalVisible(true)
    } catch (err) {
      setFailModalVisible(true)
      Sentry.captureException(err)
    } finally {
      setRemovingAccess(false)
    }
  }, [removedAccessCards, selectedEmail, getData])

  const handleCancelRemove = () => {
    setConfirmModalVisible(false)
  }

  const personEmails = useMemo(() => (activePerson ? getAllEmailsFromPerson(activePerson) : []), [activePerson])
  const user = useContext(UserContext)

  const handleTabChange = useCallback(
    (tabIndex: number) => {
      onSelectedContactCardClick(personEmails[tabIndex].address ?? '')
    },
    [onSelectedContactCardClick, personEmails]
  )

  return (
    <div className='SpotlightGrid'>
      <ExplorePlatformsHeader person={selectedEmail} isLite={isLitePlatform} />
      <div className='SpotlightGrid__header'>
        <SpotlightHeader person={activePerson} loading={personLoading || !activePerson} />
        {!personLoading && (
          <Tabs className='SpotlightGrid__tabbox' onSelect={handleTabChange} width={TAB_WIDTH * personEmails.length}>
            <TabList className='SpotlightGrid__tablist'>
              {personEmails.map((emailInfo, key) => (
                <Tab
                  key={`spotlight_tab_${key}`}
                  className='SpotlightGrid__tab'
                  selectedClassName={cx({
                    'SpotlightGrid__tab-external-selected': isExternalEmail(user.domains, emailInfo.address ?? '')
                  })}
                  component={(selected) => (
                    <SpotlightContactTab
                      key={`${emailInfo.address}-contact-card`}
                      emailInfo={emailInfo}
                      isInternal={!isExternalEmail(user.domains, emailInfo.address ?? '')}
                      isSelected={selected}
                      person={activePerson ?? ({} as Person)}
                    />
                  )}
                />
              ))}
            </TabList>
          </Tabs>
        )}
        <PermissionDeletionStatus email={selectedEmail} />
        <ModalGroup
          confirmModalTitle={UI_STRINGS.EDIT_PERMISSIONS.REMOVE_ALL_FILE_ACCESS}
          processingModalTitle={UI_STRINGS.EDIT_PERMISSIONS.REMOVE_ALL_FILE_ACCESS}
          successModalTitle={UI_STRINGS.EDIT_PERMISSIONS.SUCCESS}
          failModalTitle={UI_STRINGS.EDIT_PERMISSIONS.ERROR}
          confirmModalMessage={
            <div className='ConfirmPhraseModalContent'>
              {permissionsToBeDeletedCount === -1 && (
                <ContentLoader
                  backgroundColor='#f0f0f0'
                  foregroundColor='#f7f7f7'
                  width={450}
                  height={50}
                  className='ConfirmPhraseModalContentLoading'
                  uniqueKey='ConfirmPhraseModalContentLoading'>
                  <rect x='0' y='5' width='450' height='50' />
                </ContentLoader>
              )}
              {permissionsToBeDeletedCount === 0 && (
                <Typography variant={TypographyVariant.H4} className='ConfirmPhraseModalContent__title'>
                  {UI_STRINGS.SPOTLIGHT.NONE_PERMISSION_CAN_BE_REMOVED_INSPECT_BY_EMAIL(removeAccessInfo?.address)}
                </Typography>
              )}
              {permissionsToBeDeletedCount > 0 && (
                <Typography variant={TypographyVariant.H4} className='ConfirmPhraseModalContent__title'>
                  {UI_STRINGS.SPOTLIGHT.ARE_YOU_SURE_TO_REMOVE(
                    `${permissionsToBeDeletedCount} ${pluralize('permission', permissionsToBeDeletedCount)}`,
                    removeAccessInfo?.address,
                    largeNumberWithPluralizedUnit(
                      removeAccessInfo && removeAccessInfo.accessCount ? removeAccessInfo.accessCount : 0,
                      'file'
                    )
                  )}
                </Typography>
              )}
              <Typography variant={TypographyVariant.BODY_SMALL} className='ConfirmPhraseModalContent__infobox'>
                {UI_STRINGS.SPOTLIGHT.PERMISSIONS_GRANTING_ACCESS_CAN_ONLY_BE_REMOVED}
              </Typography>
            </div>
          }
          processingModalMessage={UI_STRINGS.RESOLVE_RISK.REQUESTING_FILE_ACCESS_REMOVAL}
          successModalMessage={`Removal of ${removeAccessInfo?.address}'s access to ${largeNumberWithPluralizedUnit(
            removeAccessInfo && removeAccessInfo.accessCount ? removeAccessInfo.accessCount : 0,
            'file'
          )} in progress.`}
          failModalMessage={UI_STRINGS.SPOTLIGHT.FAILED}
          confirmModalVisible={confirmModalVisible}
          processingModalVisible={removingAccess}
          successModalVisible={successModalVisible}
          failModalVisible={failModalVisible}
          confirmButtonDisabled={permissionsToBeDeletedCount === 0 || permissionsToBeDeletedCount === -1}
          onConfirm={handleConfirmRemove}
          onCancel={handleCancelRemove}
          onProcessingConfirm={noop}
          onProcessingCancel={noop}
          onSuccessConfirm={() => setSuccessModalVisible(false)}
          onSuccessCancel={() => setSuccessModalVisible(false)}
          onFailConfirm={() => setFailModalVisible(false)}
          onFailCancel={() => setFailModalVisible(false)}
        />
      </div>
      {!personLoading && !activePerson?.anonymous && (
        <div className={cx('SpotlightGrid__wrapper')}>
          <SpotlightGridNav
            subNavTabs={subNavTabs}
            selectedSubNavKey={selectedSubNavKey}
            subNavLoaded={subNavLoaded}
            onSubNavClick={onSubNavClick}
            onRemoveAccessClick={(emailInfo) => {
              openConfirmModalHandler(emailInfo)
            }}
            removedAccessCards={removedAccessCards}
            selectedEmail={selectedEmail}
            personInfo={personInfo}
          />
          <div className='SpotlightGrid__main'>
            <div className='SpotlightGrid__content'>
              <div className='SpotlightGrid__content--header'>
                <SectionTitle className='title' titleText={activeTitleText} />
                <div className='prev-chart'>{renderPreviewChart(activeTab.unit)}</div>
              </div>
              {chartData && selectedSubNavKey !== 'filesAccessible' && chartVisible && (
                <div className='SpotlightGrid__chart'>
                  <LineChart key={selectedSubNavKey} data={{ labels: chartData.labels, series: [chartData.series] }} />
                </div>
              )}
              {selectedEmail && renderDetailsTable(selectedEmail)}
            </div>
          </div>
        </div>
      )}
      {!personLoading && activePerson?.anonymous && (
        <Typography className='SpotlightGrid__anonymous' variant='h4' weight='normal'>
          {UI_STRINGS.SPOTLIGHT.ANONYMOUS_USER_INFO}
        </Typography>
      )}
    </div>
  )
}

export default SpotlightGrid
