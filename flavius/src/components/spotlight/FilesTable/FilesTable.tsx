import React, { useState } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import PersonCell from 'components/elements/PersonCell'
import SingleFileCell from 'components/elements/SingleFileCell'
import { getCSVData } from 'util/csv'
import { escapeComma, printCSVdate, routePathNames } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import useFileApiClient from 'api/clients/fileApiClient'
import { getFullPlatformIds } from 'util/platforms'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface FilesTableProps {
  queryParams: QueryParams
  fields: string[]
  exportUrl: string
}

const csvLinkBaseUrl: string = window.location ? `${window.location.origin}${routePathNames.RISKS}` : ''

const headerRow = [
  UI_STRINGS.CSV_HEADERS.FILE_OWNER,
  UI_STRINGS.CSV_HEADERS.LINK_OWNERS_SPOTLIGHT,
  UI_STRINGS.CSV_HEADERS.FILE_NAME,
  UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
  UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
  UI_STRINGS.CSV_HEADERS.FILE_ID,
  UI_STRINGS.CSV_HEADERS.PLATFORM,
  UI_STRINGS.CSV_HEADERS.LAST_MODIFIED,
  UI_STRINGS.CSV_HEADERS.CREATED_AT
].join()

const rowMapper = (value: IFile) =>
  [
    value.createdBy.primaryEmail?.address,
    escapeComma(`${csvLinkBaseUrl}/spotlight/${value.createdBy.primaryEmail?.address}`),
    escapeComma(value.fileName),
    escapeComma(`${csvLinkBaseUrl}/file/${value.fileId}?platformId=${value.platformId}`),
    escapeComma(value.webLink),
    value.fileId,
    value.platformId,
    printCSVdate(value.lastModified),
    printCSVdate(value.createdAt)
  ].join()

const scopedSlots = {
  [UI_STRINGS.FILE.FILE_NAME]: (val: IFile) => {
    return <SingleFileCell file={val} />
  },
  [UI_STRINGS.EDIT_PERMISSIONS.CREATED_ON]: (val: IFile) => {
    return <DateAndTimeCell value={val.createdAt} />
  },
  [UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED]: (val: IFile) => {
    return <DateAndTimeCell value={val.lastModified} />
  },
  [UI_STRINGS.FILE.FILE_OWNER]: (val: IFile) => {
    return val.createdBy ? <PersonCell personData={val.createdBy} /> : null
  }
}

const FilesTable: React.FC<FilesTableProps> = ({ queryParams, fields, exportUrl }) => {
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const [platformIds] = useQueryParam<string[]>('platformIds', getFullPlatformIds())
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const { useGetFiles } = useFileApiClient({
    defaultPageSize: pageSize
  })
  const [response, err, isLoading] = useGetFiles({
    requestDetails: {
      pageNumber,
      pageSize,
      platformIds,
      riskId: '',
      queryParams: { ...queryParams, sort }
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
      className='FilesTable'
      fields={fields}
      items={response?.files || []}
      sort={sort}
      setSort={setSort}
      sortingHeaders={[UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED]}
      scopedSlots={scopedSlots}>
      <EntityCountPagination
        entityCount={response?.files?.length || 0}
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
              baseUrl: exportUrl,
              dataKeyName: 'files',
              endpointName: 'files',
              pageSize: response?.pageSize || 0,
              pageCount: response?.pageCount || 0,
              queryParams: { platformIds, sort }
            },
            'Files',
            headerRow,
            rowMapper
          ).then(() => setIsExportingCsv(false))
        }}
      />
    </ModernTable>
  )
}

export default FilesTable
