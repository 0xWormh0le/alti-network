import React, { useState, useCallback } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import RiskIndicator from 'components/elements/RiskIndicator'
import RiskDescriptionCell from 'components/risks/RiskDescriptionCell'
import FileCell from 'components/elements/FileCell'
import PersonCell from 'components/elements/PersonCell'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import UI_STRINGS from 'util/ui-strings'
import { getCSVData } from 'util/csv'
import { mapper, rowMapper, useCacheIncidentDates } from 'pages/Risks/riskUtils'
import useRiskApiClient from 'api/clients/riskApiClient'
import { getFullPlatformIds } from 'util/platforms'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface RisksTableProps {
  queryParams: QueryParams
  exportUrl: string
}

const headerRow = [
  UI_STRINGS.CSV_HEADERS.SEVERITY,
  UI_STRINGS.CSV_HEADERS.RISK_TYPE,
  UI_STRINGS.CSV_HEADERS.FILES_AT_RISK,
  UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
  UI_STRINGS.CSV_HEADERS.LINK_TO_FILE,
  UI_STRINGS.CSV_HEADERS.FILE_ID,
  UI_STRINGS.CSV_HEADERS.PLATFORM,
  UI_STRINGS.CSV_HEADERS.FILE_OWNER,
  UI_STRINGS.CSV_HEADERS.LINK_OWNERS_SPOTLIGHT,
  UI_STRINGS.CSV_HEADERS.DETECTED_ON
].join()

const orderingColumns = {
  'Detected On': 'datetime',
  Severity: 'severity'
}

const fields = [
  UI_STRINGS.APPSPOTLIGHT.SEVERITY,
  UI_STRINGS.DASHBOARD.RISK_TYPE,
  UI_STRINGS.FILE.FILES_AT_RISK,
  UI_STRINGS.FILE.FILE_OWNER,
  UI_STRINGS.FILE.DETECTED_ON
]

const RisksTable: React.FC<RisksTableProps> = ({ queryParams, exportUrl }) => {
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const { useGetRisks } = useRiskApiClient({
    defaultPageSize: pageSize
  })
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [platformIds] = useQueryParam<string[]>('platformIds', getFullPlatformIds())
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [orderBy, setOrderBy] = useState('Detected On')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  const [response, risksErr, isLoading] = useGetRisks({
    requestDetails: {
      pageNumber,
      pageSize,
      platformIds,
      userVisibilityState: 'active',
      queryParams: {
        ...queryParams,
        sort,
        orderBy: orderingColumns[orderBy]
      },
      riskTypeIds: []
    }
  })

  useCacheIncidentDates(response)

  const displayRisks: DisplayRisk[] = response?.risks.map(mapper) || []

  const handleExportCsv = useCallback(() => {
    setIsExportingCsv(true)
    getCSVData(
      {
        baseUrl: exportUrl,
        dataKeyName: 'risks',
        endpointName: 'risks',
        pageSize: response?.pageSize || 0,
        pageCount: response?.pageCount || 0,
        queryParams: { sort, orderBy: orderingColumns[orderBy] }
      },
      'Risks',
      headerRow,
      rowMapper
    ).then(() => setIsExportingCsv(false))
    setIsExportingCsv(true)
  }, [response, sort, orderBy, exportUrl])

  if (risksErr)
    return (
      <ErrorBox
        mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
        secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
      />
    )

  return (
    <>
      <ModernTable
        setSort={setSort}
        sort={sort}
        setOrderBy={setOrderBy}
        orderBy={orderBy}
        isLoading={isLoading}
        loadingComponent={<TableLoading />}
        className='RisksTable'
        sortingHeaders={[UI_STRINGS.APPSPOTLIGHT.SEVERITY, UI_STRINGS.FILE.DETECTED_ON]}
        items={displayRisks}
        fields={fields}
        scopedSlots={{
          [UI_STRINGS.APPSPOTLIGHT.SEVERITY]: (risk) => {
            return <RiskIndicator value={risk.severity} />
          },
          [UI_STRINGS.DASHBOARD.RISK_TYPE]: (risk) => {
            return <RiskDescriptionCell displayRiskDescription={risk.description} />
          },
          [UI_STRINGS.FILE.FILES_AT_RISK]: (risk) => {
            return <FileCell fileResponse={risk.file} />
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
          entityCount={response?.risks.length || 0}
          totalEntityCount={response?.riskCount || 0}
          onExportCsv={handleExportCsv}
          onPageSizeChange={setPageSize}
          isLoadingExportCsv={isExportingCsv}
          pageNumber={pageNumber}
          pageSize={response?.pageSize || 10}
          pageCount={response?.pageCount || 0}
        />
      </ModernTable>
    </>
  )
}

export default RisksTable
