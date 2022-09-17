import React from 'react'
import AppSpotlightAuthorizedByTable from '../AppSpotlightAuthorizedByTable'
import AppSpotlightFileDownloadsTable from '../AppSpotlightFileDownloadsTable'
import AppSpotlightAssociatedRisksTable from '../AppSpotlightAssociatedRisksTable'
import UI_STRINGS from 'util/ui-strings'
import AppSpotlightGrid from '../AppSpotlightGrid'
import { SubNavTab } from '../AppSpotlightGridNav'
import useApplicationApiClient from 'api/clients/applicationApiClient'
import { useQueryParam } from 'util/hooks'

export interface AppSpotlightContainerProps {
  wrapperType: WrapperTypeOptions
  applicationId: string
  platformId: string
}

export const navTabs: SubNavTab[] = [
  {
    label: UI_STRINGS.APPSPOTLIGHT.AUTHORIZED_BY,
    value: {
      value: 32,
      subTitleText: UI_STRINGS.APPSPOTLIGHT.OF_USERS,
      series: [13],
      serieLabels: [UI_STRINGS.APPSPOTLIGHT.INDIVIDUAL_EMPLOYEES],
      padding: 100 - 13,
      valueType: 'auth'
    },
    seriesKey: 'authorizedBy',
    title: UI_STRINGS.APPSPOTLIGHT.INDIVIDUALS_AUTHORIZED,
    unit: UI_STRINGS.APPSPOTLIGHT.USER_UNIT,
    renderDetailsTable: (appId: string, platformId: string, wrapperType: WrapperTypeOptions) => (
      <AppSpotlightAuthorizedByTable applicationId={appId} platformId={platformId} />
    )
  },
  {
    label: UI_STRINGS.APPSPOTLIGHT.FILE_DOWNLOADS,
    value: {
      value: 18,
      subTitleText: UI_STRINGS.APPSPOTLIGHT.DOWNLOADS,
      series: [18],
      serieLabels: [UI_STRINGS.APPSPOTLIGHT.ARE_SENSITIVE_FILES],
      padding: 100 - 18,
      valueType: 'download'
    },
    seriesKey: 'fileDownloads',
    title: UI_STRINGS.APPSPOTLIGHT.FILE_DOWNLOADS_BY_APP,
    unit: UI_STRINGS.APPSPOTLIGHT.DOWNLOAD_UNIT,
    renderDetailsTable: (appId: string, platformId: string, wrapperType: WrapperTypeOptions) => (
      <AppSpotlightFileDownloadsTable applicationId={appId} platformId={platformId} eventType='download' />
    )
  },
  {
    label: UI_STRINGS.APPSPOTLIGHT.ASSOCIATED_RISKS,
    value: {
      value: 15,
      subTitleText: UI_STRINGS.APPSPOTLIGHT.RISKS,
      series: [1, 2, 2, 10, 0],
      serieLabels: [5, 4, 3, 2, 1].map((magnitude) => `${UI_STRINGS.APPSPOTLIGHT.SEVERITY} ${magnitude}`),
      valueType: 'risk'
    },
    seriesKey: 'associatedRisks',
    title: UI_STRINGS.APPSPOTLIGHT.RISKS_ASSOCIATED_BY_APP,
    unit: UI_STRINGS.APPSPOTLIGHT.RISK_UNIT,
    renderDetailsTable: (appId: string, platformId: string, wrapperType: WrapperTypeOptions) => {
      return <AppSpotlightAssociatedRisksTable applicationId={appId} platformId={platformId} />
    }
  }
]

const AppSpotlightContainer: React.FC<AppSpotlightContainerProps> = (props) => {
  const { wrapperType, applicationId, platformId } = props
  const [selectedSubNavKey, setSelectedSubNavKey] = useQueryParam<AppSpotlightSubNavType>(
    'selectedSubNavKey',
    navTabs[0].seriesKey,
    { [wrapperType === 'page' ? 'page' : 'modalPage']: 1 }
  )
  const { useGetApplication, useGetApplicationStats } = useApplicationApiClient()
  const [applicationData, , applicationLoading] = useGetApplication(applicationId)
  const [applicationStatsData, , applicationStatsLoading] = useGetApplicationStats(applicationId)

  return (
    <AppSpotlightGrid
      appId={applicationId}
      platformId={platformId}
      app={applicationData}
      stats={applicationStatsData}
      loading={applicationLoading}
      statsLoading={applicationStatsLoading}
      wrapperType={wrapperType}
      navTabs={navTabs}
      selectedTab={selectedSubNavKey}
      onSubNavClick={setSelectedSubNavKey}
    />
  )
}

export default AppSpotlightContainer
