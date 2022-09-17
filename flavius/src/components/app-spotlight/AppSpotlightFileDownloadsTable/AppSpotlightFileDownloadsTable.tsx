import React, { useState } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import SingleFileCell from 'components/elements/SingleFileCell'
import PersonCell from 'components/elements/PersonCell'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import UI_STRINGS from 'util/ui-strings'
import { printCSVdate, routePathNames, valToFileData, escapeComma } from 'util/helpers'
import { getCSVData } from 'util/csv'
import { GENERAL_URLS } from 'api/endpoints'
import Person from 'models/Person'
import useApplicationApiClient from 'api/clients/applicationApiClient'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface AppSpotlightFileDownloadsTableProps {
  applicationId: string
  platformId: string
  eventType: string
}

const fields = [UI_STRINGS.FILE.FILE_NAME, UI_STRINGS.DASHBOARD.OWNER, UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]

const csvHeaderRow = [
  UI_STRINGS.CSV_HEADERS.FILE_NAME,
  UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
  UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
  UI_STRINGS.CSV_HEADERS.FILE_ID,
  UI_STRINGS.CSV_HEADERS.PLATFORM,
  UI_STRINGS.CSV_HEADERS.FILE_OWNER,
  UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
].join()

const rowMapper = (value: SpotlightEvent) =>
  [
    escapeComma(value.files[0].fileName),
    `${window.location ? `${window.location.origin}${routePathNames.RISKS}` : ''}/file/${value.files[0].fileId}`,
    escapeComma(value.files[0].webLink),
    value.files[0].fileId,
    value.files[0].platformId,
    new Person(value.files[0].createdBy as IPerson).displayName,
    printCSVdate(value.datetime)
  ].join()

const AppSpotlightFileDownloadsTable: React.FC<AppSpotlightFileDownloadsTableProps> = ({
  applicationId,
  platformId,
  eventType
}) => {
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const { useGetApplicationEvents } = useApplicationApiClient({
    defaultPageSize: pageSize
  })

  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')

  const [response, err, isLoading] = useGetApplicationEvents({
    requestDetails: {
      applicationId,
      eventType,
      pageNumber,
      pageSize,
      queryParams: {
        platformIds: [platformId],
        sort
      }
    }
  })

  if (err) {
    return (
      <ErrorBox
        mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
        secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
      />
    )
  }

  return (
    <ModernTable
      isLoading={isLoading}
      loadingComponent={<TableLoading />}
      fields={fields}
      className='AppSpotlightFileDownloadsTable'
      items={response?.events || []}
      sortingHeaders={[UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]}
      setSort={setSort}
      sort={sort}
      scopedSlots={{
        [UI_STRINGS.FILE.FILE_NAME]: (val: SpotlightEvent) => <SingleFileCell file={valToFileData(val.files[0])} />,
        [UI_STRINGS.DASHBOARD.OWNER]: (val: SpotlightEvent) => (
          <PersonCell personData={new Person(val.files[0].createdBy as IPerson)} />
        ),
        [UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]: (val: SpotlightEvent) => <DateAndTimeCell value={val.datetime} />
      }}>
      <EntityCountPagination
        entityCount={response?.events?.length || 0}
        onPageChange={(next) => setPageNumber(next)}
        pageCount={response?.pageCount || 0}
        pageNumber={Number(pageNumber)}
        pageSize={response?.pageSize || 0}
        onPageSizeChange={setPageSize}
        isLoadingExportCsv={isExportingCsv}
        onExportCsv={() => {
          setIsExportingCsv(true)
          getCSVData(
            {
              baseUrl: `${GENERAL_URLS.APPLICATION}/${applicationId}/events`,
              dataKeyName: 'events',
              endpointName: 'files',
              pageSize: response?.pageSize || 0,
              pageCount: response?.pageCount || 0,
              queryParams: {
                eventType,
                platformId,
                sort
              }
            },
            'EventsTable',
            csvHeaderRow,
            rowMapper
          ).then(() => setIsExportingCsv(false))
        }}
      />
    </ModernTable>
  )
}

export default AppSpotlightFileDownloadsTable
