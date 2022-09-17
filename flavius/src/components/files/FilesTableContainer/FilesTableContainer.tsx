import React, { useState } from 'react'
import { GENERAL_URLS } from 'api/endpoints'
import { escapeComma, formatSingleFileUrl, printCSVdate, routePathNames, hasSensitiveContent } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import { getCSVData } from 'util/csv'
import SingleFileCell from 'components/elements/SingleFileCell'
import PersonCell from 'components/elements/PersonCell'
import useFileApiClient from 'api/clients/fileApiClient'
import { getFullPlatformIds } from 'util/platforms'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'
import { ActivityRiskTypeIds } from 'models/RiskCatalog'
import { Link } from 'react-router-dom'
import Tooltip from 'components/widgets/Tooltip'
import { FileGridNavType } from 'types/common'

export interface FilesTableContainerProps {
  riskId: string
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
  UI_STRINGS.CSV_HEADERS.CREATED_AT,
  UI_STRINGS.CSV_HEADERS.LAST_MODIFIED
].join()

const headerRowWithDownloadedColumn = [
  UI_STRINGS.CSV_HEADERS.FILE_OWNER,
  UI_STRINGS.CSV_HEADERS.LINK_OWNERS_SPOTLIGHT,
  UI_STRINGS.CSV_HEADERS.FILE_NAME,
  UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
  UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
  UI_STRINGS.CSV_HEADERS.FILE_ID,
  UI_STRINGS.CSV_HEADERS.PLATFORM,
  UI_STRINGS.CSV_HEADERS.CREATED_AT,
  UI_STRINGS.CSV_HEADERS.LAST_MODIFIED,
  UI_STRINGS.CSV_HEADERS.DOWNLOADED_ON
].join()

const rowMapper = (value: IFile) =>
  [
    value.createdBy.primaryEmail?.address,
    `${csvLinkBaseUrl}/spotlight/${value.createdBy.primaryEmail?.address}`,
    escapeComma(value.fileName),
    `${csvLinkBaseUrl}/file/${value.fileId}?platformId=${value.platformId}`,
    escapeComma(value.webLink),
    value.fileId,
    value.platformId,
    printCSVdate(value.createdAt),
    printCSVdate(value.lastModified)
  ].join()

const rowMapperWithDownloadedColumn = (value: IFile) =>
  [
    value.createdBy.primaryEmail?.address,
    `${csvLinkBaseUrl}/spotlight/${value.createdBy.primaryEmail?.address}`,
    value.fileName,
    `${csvLinkBaseUrl}/file/${value.fileId}?platformId=${value.platformId}`,
    value.webLink,
    value.fileId,
    value.platformId,
    printCSVdate(value.createdAt),
    printCSVdate(value.lastModified),
    value.lastDownloaded ? printCSVdate(value.lastDownloaded) : ''
  ].join()

const FilesTableContainer: React.FC<FilesTableContainerProps> = ({ riskId }) => {
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const { useGetFiles } = useFileApiClient({
    defaultPageSize: pageSize
  })
  const [platformIds] = useQueryParam<string[]>('platformIds', getFullPlatformIds(), {}, 'files')
  const [riskTypeId] = useQueryParam<string | undefined>('riskTypeId', undefined)
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [orderBy, setOrderBy] = useState('last modified')
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  // Translating between table and API
  const orderingColumns = {
    'last modified': 'last_modified',
    'last downloaded': 'last_downloaded'
  }
  const [filesRs, err, isLoading] = useGetFiles({
    requestDetails: {
      pageNumber,
      pageSize,
      platformIds,
      riskId,
      queryParams: {
        sort,
        orderBy: orderingColumns[orderBy]
      }
    }
  })

  const shouldDisplayDownloadedColumn = ActivityRiskTypeIds.includes(Number(riskTypeId))
  const fields = shouldDisplayDownloadedColumn
    ? ['file name', 'file owner', 'created on', 'last modified', 'last downloaded']
    : ['file name', 'file owner', 'created on', 'last modified']

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
      items={filesRs?.files || []}
      sort={sort}
      setSort={setSort}
      setOrderBy={setOrderBy}
      orderBy={orderBy}
      sortingHeaders={['last modified', 'last downloaded']}
      scopedSlots={{
        'file name': (val) => {
          return <SingleFileCell file={val} />
        },
        'file owner': (val) => {
          return val.createdBy ? <PersonCell personData={val.createdBy} /> : null
        },
        'created on': (val) => {
          return <DateAndTimeCell value={val.createdAt} />
        },
        'last modified': (val) => {
          return <DateAndTimeCell value={val.lastModified} />
        },
        'last downloaded': (val) => {
          const link = formatSingleFileUrl(
            val.createdBy?.primaryEmail?.address,
            val.fileId,
            val.platformId,
            hasSensitiveContent(val),
            FileGridNavType.TIMELINE
          )
          return val.lastDownloaded ? (
            <div>
              <DateAndTimeCell value={val.lastDownloaded}>
                <Tooltip text={UI_STRINGS.FILES.SEE_OTHER_ACTIVITY}>
                  <Link to={link} className='Files__other-activity-link'>
                    ({UI_STRINGS.FILES.DETAILS})
                  </Link>
                </Tooltip>
              </DateAndTimeCell>
            </div>
          ) : null
        }
      }}>
      <EntityCountPagination
        entityCount={filesRs?.files?.length || 0}
        onPageChange={(next) => setPageNumber(next)}
        pageCount={filesRs?.pageCount || 0}
        pageNumber={Number(pageNumber)}
        onPageSizeChange={setPageSize}
        pageSize={pageSize}
        isLoadingExportCsv={isExportingCsv}
        onExportCsv={() => {
          setIsExportingCsv(true)
          getCSVData(
            {
              baseUrl: `${GENERAL_URLS.FILES}`,
              dataKeyName: 'files',
              endpointName: 'files',
              pageSize: filesRs?.pageSize || 0,
              pageCount: filesRs?.pageCount || 0,
              queryParams: { riskId, platformIds, sort, orderBy: orderingColumns[orderBy] }
            },
            'Files',
            shouldDisplayDownloadedColumn ? headerRowWithDownloadedColumn : headerRow,
            shouldDisplayDownloadedColumn ? rowMapperWithDownloadedColumn : rowMapper
          ).then(() => setIsExportingCsv(false))
        }}
      />
    </ModernTable>
  )
}

export default FilesTableContainer
