import React, { useState, useCallback } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import RiskIndicator from 'components/elements/RiskIndicator'
import RiskDescriptionCell from 'components/risks/RiskDescriptionCell'
import FileCell from 'components/elements/FileCell'
import PersonCell from 'components/elements/PersonCell'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import { mapper, getCSVRiskDescription } from 'pages/Risks/riskUtils'
import UI_STRINGS from 'util/ui-strings'
import { printCSVdate, routePathNames, getRiskLabel, escapeComma } from 'util/helpers'
import { getCSVData } from 'util/csv'
import { GENERAL_URLS } from 'api/endpoints'
import useRiskApiClient from 'api/clients/riskApiClient'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface AppSpotlightAssociatedRisksTableProps {
  applicationId: string
  platformId: string
}

const fields = [
  UI_STRINGS.APPSPOTLIGHT.SEVERITY,
  UI_STRINGS.FILE.FILES_AT_RISK,
  UI_STRINGS.DASHBOARD.RISK_TYPE,
  UI_STRINGS.FILE.FILE_CREATOR,
  UI_STRINGS.FILE.FILE_OWNER,
  UI_STRINGS.FILE.DETECTED_ON
]

const csvHeaderRow = [
  UI_STRINGS.CSV_HEADERS.SEVERITY,
  UI_STRINGS.CSV_HEADERS.RISK_TYPE,
  UI_STRINGS.CSV_HEADERS.FILES_AT_RISK,
  UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
  UI_STRINGS.CSV_HEADERS.LINK_TO_FILE,
  UI_STRINGS.CSV_HEADERS.FILE_ID,
  UI_STRINGS.CSV_HEADERS.PLATFORM,
  UI_STRINGS.CSV_HEADERS.RISK_CREATOR,
  UI_STRINGS.CSV_HEADERS.FILE_OWNER,
  UI_STRINGS.CSV_HEADERS.LINK_OWNERS_SPOTLIGHT,
  UI_STRINGS.CSV_HEADERS.DETECTED_ON
].join()

const csvLinkBaseUrl: string = window.location ? `${window.location.origin}${routePathNames.RISKS}` : ''
const rowMapper = (risk: RiskResponse) => {
  const value = mapper(risk)

  if (value.fileCount === 1) {
    return [
      getRiskLabel(value.severity),
      value.description ? getCSVRiskDescription(value.description) : '',
      escapeComma(value.file?.fileName),
      `${csvLinkBaseUrl}/file/${value.file?.fileId}?platformId=${value.file?.platformId}`,
      escapeComma(value.file?.webLink || ''),
      value.file?.fileId,
      value.file?.platformId,
      value.creator?.primaryEmail?.address,
      `${csvLinkBaseUrl}/spotlight/${encodeURIComponent(value.creator?.primaryEmail?.address ?? '')}`,
      value.owner?.primaryEmail?.address,
      `${csvLinkBaseUrl}/spotlight/${encodeURIComponent(value.owner?.primaryEmail?.address ?? '')}`,
      printCSVdate(value.datetime)
    ].join()
  } else {
    return [
      getRiskLabel(value.severity),
      value.description ? getCSVRiskDescription(value.description) : '',
      `${value.fileCount} Files`,
      `${csvLinkBaseUrl}/files/${value.riskId}`,
      '',
      '',
      value.file?.platformId,
      'Multiple',
      'Multiple',
      'Multiple',
      'Multiple',
      printCSVdate(value.datetime)
    ].join()
  }
}

const AppSpotlightAssociatedRisksTable: React.FC<AppSpotlightAssociatedRisksTableProps> = ({
  applicationId,
  platformId
}) => {
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })

  const { useGetRisks } = useRiskApiClient({
    defaultPageSize: pageSize
  })
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [orderBy, setOrderBy] = useState('Detected On')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  // Translating between table and API
  const orderingColumns = {
    'Detected On': 'datetime',
    Severity: 'severity'
  }

  const [response, risksErr, isLoading] = useGetRisks({
    requestDetails: {
      pageNumber,
      pageSize,
      platformIds: [platformId],
      userVisibilityState: 'active',
      queryParams: {
        applicationId,
        sort,
        orderBy: orderingColumns[orderBy]
      },
      riskTypeIds: []
    }
  })

  const displayRisks: DisplayRisk[] = response?.risks.map(mapper) || []

  const handleExportCsv = useCallback(() => {
    setIsExportingCsv(true)
    getCSVData(
      {
        baseUrl: GENERAL_URLS.RISKS,
        dataKeyName: 'risks',
        endpointName: 'risks',
        pageSize: response?.pageSize || 0,
        pageCount: response?.pageCount || 0,
        queryParams: { applicationId, platformIds: [platformId], sort }
      },
      'Risks',
      csvHeaderRow,
      rowMapper
    ).then(() => setIsExportingCsv(false))
    setIsExportingCsv(true)
  }, [response, sort, applicationId, platformId])

  if (risksErr)
    return (
      <ErrorBox
        mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
        secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
      />
    )

  return (
    <ModernTable
      setSort={setSort}
      sort={sort}
      setOrderBy={setOrderBy}
      orderBy={orderBy}
      isLoading={isLoading}
      loadingComponent={<TableLoading />}
      className='AppSpotlightAssociatedRisksTable'
      sortingHeaders={[UI_STRINGS.APPSPOTLIGHT.SEVERITY, UI_STRINGS.FILE.DETECTED_ON]}
      items={displayRisks}
      fields={fields}
      scopedSlots={{
        [UI_STRINGS.APPSPOTLIGHT.SEVERITY]: (risk) => {
          return <RiskIndicator value={risk.severity} />
        },
        [UI_STRINGS.FILE.FILES_AT_RISK]: (risk) => {
          return <FileCell fileResponse={risk.file} />
        },
        [UI_STRINGS.DASHBOARD.RISK_TYPE]: (risk) => {
          return <RiskDescriptionCell displayRiskDescription={risk.description} />
        },
        [UI_STRINGS.FILE.FILE_CREATOR]: (risk) => {
          return <PersonCell personData={risk.creator as FileOwner} />
        },
        [UI_STRINGS.FILE.FILE_OWNER]: (risk) => {
          return <PersonCell personData={risk.owner} />
        },
        [UI_STRINGS.FILE.DETECTED_ON]: (risk) => {
          return <DateAndTimeCell value={risk.datetime} />
        }
      }}>
      <EntityCountPagination
        onPageChange={setPageNumber}
        totalEntityCount={response?.riskCount || 0}
        entityCount={response?.risks?.length || 0}
        onPageSizeChange={setPageSize}
        onExportCsv={handleExportCsv}
        isLoadingExportCsv={isExportingCsv}
        pageNumber={pageNumber}
        pageSize={response?.pageSize || 10}
        pageCount={response?.pageCount || 0}
      />
    </ModernTable>
  )
}

export default AppSpotlightAssociatedRisksTable
