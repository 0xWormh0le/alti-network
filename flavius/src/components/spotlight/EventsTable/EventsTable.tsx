import React, { useState } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import IpCell from 'components/elements/IpCell'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import SingleFileCell from 'components/elements/SingleFileCell'
import PersonCell from 'components/elements/PersonCell'
import EventDescriptionCell from 'components/elements/EventDescriptionCell'
import SimplePersonCell from 'components/elements/SimplePersonCell'
import { escapeComma, printCSVdate, routePathNames } from 'util/helpers'
import { valToFileData } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { getCSVData } from 'util/csv'
import Person from 'models/Person'
import usePersonApiClient from 'api/clients/personApiClient'
import { getFullPlatformIds } from 'util/platforms'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface EventsTableProps {
  personId: string
  eventType: string | null
  fields: string[]
  exportUrl: string
  sortingHeader?: string[]
  csvHeaderRow: string[]
}

const rowToMap: {
  [k: string]: (value: SpotlightEvent) => React.ReactNode
} = {
  'File Name': (value: SpotlightEvent) => escapeComma(value.files[0].fileName),
  'File Inspector Link': (value: SpotlightEvent) =>
    `${window.location ? `${window.location.origin}${routePathNames.RISKS}` : ''}/file/${value.files[0].fileId}`,
  'Storage Link': (value: SpotlightEvent) => escapeComma(value.files[0].webLink),
  'File ID': (value: SpotlightEvent) => value.files[0].fileId,
  Platform: (value: SpotlightEvent) => value.files[0].platformId,
  Owner: (value: SpotlightEvent) => new Person(value.files[0].createdBy as IPerson).displayName,
  Event: (value: SpotlightEvent) => value.eventName,
  'IP Address': (value: SpotlightEvent) => value.ipAddress,
  'Date Downloaded': (value: SpotlightEvent) => printCSVdate(value.datetime)
}

const scopedSlots = {
  [UI_STRINGS.FILE.FILE_NAME]: (val: SpotlightEvent) => <SingleFileCell file={valToFileData(val.files[0])} />,
  [UI_STRINGS.DASHBOARD.OWNER]: (val: SpotlightEvent) => (
    <PersonCell personData={new Person(val.files[0].createdBy as IPerson)} />
  ),
  [UI_STRINGS.SPOTLIGHT.SHARED_WITH]: (val: SpotlightEvent) =>
    val.targetPeople.length !== 0 && <PersonCell personData={new Person(val.targetPeople[0] as IPerson)} />,
  [UI_STRINGS.SPOTLIGHT.SHARED_TO]: (val: SpotlightEvent) =>
    val.targetPeople.length !== 0 && <PersonCell personData={new Person(val.targetPeople[0] as IPerson)} />,
  [UI_STRINGS.TOOLTIP_IP.IP]: (val: SpotlightEvent) => <IpCell value={val.ipAddress} />,
  [UI_STRINGS.SPOTLIGHT.COLLABORATOR]: (val: SpotlightEvent) =>
    val.targetPeople.length !== 0 && <PersonCell personData={new Person(val.targetPeople[0] as IPerson)} />,
  [UI_STRINGS.SPOTLIGHT.DATE_TIME]: (val: SpotlightEvent) => <DateAndTimeCell value={val.datetime} />,
  [UI_STRINGS.SPOTLIGHT.EVENT]: (val: any) => <EventDescriptionCell fileEvent={val as IFileEvent} />,
  [UI_STRINGS.SPOTLIGHT.TARGET]: (val: SpotlightEvent) =>
    val.targetPeople?.length && <SimplePersonCell personInfo={val.targetPeople[0]} />,
  [UI_STRINGS.SPOTLIGHT.DATE_DOWNLOADED]: (val: SpotlightEvent) => <DateAndTimeCell value={val.datetime} />
}

export const EventsTable: React.FC<EventsTableProps> = ({
  personId,
  eventType,
  fields,
  exportUrl,
  sortingHeader,
  csvHeaderRow
}) => {
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const { useGetPersonEvents } = usePersonApiClient({
    defaultPageSize: pageSize
  })
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [platformIds] = useQueryParam<string[]>('platformIds', getFullPlatformIds())
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')

  const [response, err, isLoading] = useGetPersonEvents({
    requestDetails: {
      personId,
      platformIds,
      eventType,
      pageSize,
      pageNumber,
      queryParams: {
        sort
      }
    }
  })

  const headerRow = csvHeaderRow.join()
  const rowMapper = (value: any) => csvHeaderRow.map((item) => rowToMap[item](value)).join()

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
      items={response?.events || []}
      sortingHeaders={sortingHeader}
      className='EventsTable'
      setSort={setSort}
      sort={sort}
      scopedSlots={scopedSlots}>
      <EntityCountPagination
        entityCount={response?.events?.length || 0}
        onPageChange={(next) => setPageNumber(next)}
        onPageSizeChange={setPageSize}
        pageCount={response?.pageCount || 0}
        pageNumber={Number(pageNumber)}
        pageSize={pageSize}
        isLoadingExportCsv={isExportingCsv}
        onExportCsv={() => {
          setIsExportingCsv(true)
          getCSVData(
            {
              baseUrl: exportUrl,
              dataKeyName: 'events',
              endpointName: 'files',
              pageSize: response?.pageSize || 0,
              pageCount: response?.pageCount || 0,
              queryParams: { platformIds, sort }
            },
            'EventsTable',
            headerRow,
            rowMapper
          ).then(() => setIsExportingCsv(false))
        }}
      />
    </ModernTable>
  )
}

export default EventsTable
