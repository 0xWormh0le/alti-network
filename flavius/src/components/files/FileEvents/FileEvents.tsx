import React, { useState } from 'react'

import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import EventDescriptionCell from 'components/elements/EventDescriptionCell'
import SimplePersonCell from 'components/elements/SimplePersonCell'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import { printCSVdate, routePathNames } from 'util/helpers'
import { GENERAL_URLS } from 'api/endpoints'
import { descriptionText } from 'components/elements/EventDescriptionCell/EventDescriptionCell'
import UI_STRINGS from 'util/ui-strings'
import { getCSVData } from 'util/csv'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import useFileApiClient from 'api/clients/fileApiClient'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface FileEventsProps {
  fileId: string
}

const csvLinkBaseUrl = window.location ? `${window.location.origin}${routePathNames.RISKS}` : ''

const headerRow = [
  UI_STRINGS.CSV_HEADERS.DATE,
  UI_STRINGS.CSV_HEADERS.ACTOR,
  UI_STRINGS.CSV_HEADERS.ACTOR_LINK,
  UI_STRINGS.CSV_HEADERS.EVENT,
  UI_STRINGS.CSV_HEADERS.TARGET
].join()

const rowMapper = (value: IFileEvent) =>
  [
    printCSVdate(value.datetime),
    value.actor.primaryEmail?.address,
    `${csvLinkBaseUrl}/spotlight/${value.actor.primaryEmail?.address}`,
    descriptionText(value),
    value.targetPeople.length > 0 ? value.targetPeople[0].primaryEmail?.address : ''
  ].join()

const FileEvents: React.FC<FileEventsProps> = (props) => {
  const { fileId } = props
  const fields = ['date', 'actor', 'event', 'target']
  const [platformId] = useQueryParam('platformId', '')
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const { useGetFileEvents } = useFileApiClient({
    defaultPageSize: pageSize
  })
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [sort, setSort] = useState<'desc' | 'asc'>('desc')

  const [eventsRs, err, isLoading] = useGetFileEvents({
    requestDetails: {
      fileId,
      platformId,
      pageNumber,
      pageSize,
      queryParams: {
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
    <div className='FileEvents'>
      <ModernTable
        isLoading={isLoading}
        loadingComponent={<TableLoading />}
        fields={fields}
        items={eventsRs?.events || []}
        sortingHeaders={['date']}
        setSort={setSort}
        sort={sort}
        scopedSlots={{
          date: (val) => {
            return <DateAndTimeCell value={val.datetime} />
          },
          event: (val) => {
            return <EventDescriptionCell fileEvent={val} />
          },
          actor: (val) => {
            return (val.actor && <SimplePersonCell personInfo={val.actor} />) || null
          },
          target: (val) => {
            return val.targetPeople?.length ? <SimplePersonCell personInfo={val.targetPeople[0]} /> : null
          }
        }}>
        <EntityCountPagination
          entityCount={eventsRs?.events?.length || 0}
          onPageChange={(next) => setPageNumber(next)}
          pageCount={eventsRs?.pageCount || 0}
          pageNumber={Number(pageNumber)}
          onPageSizeChange={setPageSize}
          pageSize={pageSize}
          isLoadingExportCsv={isExportingCsv}
          onExportCsv={() => {
            setIsExportingCsv(true)
            getCSVData(
              {
                baseUrl: `${GENERAL_URLS.FILE}/${fileId}/events`,
                dataKeyName: 'events',
                endpointName: 'file',
                pageSize: eventsRs?.pageSize || 0,
                pageCount: eventsRs?.pageCount || 0,
                queryParams: { platformId }
              },
              'FileEvents',
              headerRow,
              rowMapper
            ).then(() => setIsExportingCsv(false))
          }}
        />
      </ModernTable>
    </div>
  )
}

export default FileEvents
