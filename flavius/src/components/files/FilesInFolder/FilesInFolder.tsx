import React, { useState } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import FileCell from 'components/elements/FileCell'
import SimplePersonCell from 'components/elements/SimplePersonCell'
import TableLoading from 'components/elements/TableLoading'
import { escapeComma, printCSVdate, renderAttributeIfDev, routePathNames } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { getCSVData } from 'util/csv'
import { GENERAL_URLS } from 'api/endpoints'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import useFileApiClient from 'api/clients/fileApiClient'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface FileInFolderProps {
  fileId: string
  folderId: string
}

const csvLinkBaseUrl: string = window.location ? `${window.location.origin}${routePathNames.RISKS}` : ''

const headerRow = [
  UI_STRINGS.CSV_HEADERS.FILE_NAME,
  UI_STRINGS.CSV_HEADERS.LINK_INSPECTOR,
  UI_STRINGS.CSV_HEADERS.LINK_STORAGE,
  UI_STRINGS.CSV_HEADERS.FILE_ID,
  UI_STRINGS.CSV_HEADERS.PLATFORM,
  UI_STRINGS.CSV_HEADERS.FILE_OWNER,
  UI_STRINGS.CSV_HEADERS.LINK_OWNERS_SPOTLIGHT,
  UI_STRINGS.CSV_HEADERS.LAST_MODIFIED,
  UI_STRINGS.CSV_HEADERS.CREATED_AT
].join()

const rowMapper = (value: IFile) =>
  [
    escapeComma(value.fileName),
    escapeComma(`${csvLinkBaseUrl}/file/${value.fileId}?platformId=${value.platformId}`),
    escapeComma(value.webLink),
    value.fileId,
    value.platformId,
    value.createdBy?.primaryEmail.address,
    `${csvLinkBaseUrl}/spotlight/${value.createdBy?.primaryEmail.address}`,
    printCSVdate(value.lastModified),
    printCSVdate(value.createdAt)
  ].join()

const FilesInFolder: React.FC<FileInFolderProps> = (props) => {
  const { folderId } = props
  const [platformId] = useQueryParam('platformId', '')

  const { useGetFilesInFolder } = useFileApiClient({
    defaultPageSize: 10
  })

  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')

  const [filesRs, err, isLoading] = useGetFilesInFolder({
    requestDetails: {
      folderId,
      platformId,
      pageSize,
      pageNumber,
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
    <div className='FileEvents' {...renderAttributeIfDev({ 'data-testid': 'folderList' })}>
      <ModernTable
        isLoading={isLoading}
        loadingComponent={<TableLoading />}
        fields={['file name', 'file owner', 'created on', 'last modified']}
        items={filesRs?.files || []}
        sortingHeaders={['last modified']}
        setSort={setSort}
        sort={sort}
        scopedSlots={{
          'file name': (val) => {
            return <FileCell fileResponse={val} />
          },
          'file owner': (val) => {
            return val.createdBy ? <SimplePersonCell personInfo={val.createdBy} /> : null
          },
          'created on': (val) => {
            return <DateAndTimeCell value={val.createdAt} />
          },
          'last modified': (val) => {
            return <DateAndTimeCell value={val.lastModified} />
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
                baseUrl: `${GENERAL_URLS.FILES}/parentFolder/${folderId}`,
                dataKeyName: 'files',
                endpointName: 'files',
                pageSize: filesRs?.pageSize || 0,
                pageCount: filesRs?.pageCount || 0,
                queryParams: { platformId }
              },
              'FilesInFolder',
              headerRow,
              rowMapper
            ).then(() => setIsExportingCsv(false))
          }}
        />
      </ModernTable>
    </div>
  )
}

export default FilesInFolder
