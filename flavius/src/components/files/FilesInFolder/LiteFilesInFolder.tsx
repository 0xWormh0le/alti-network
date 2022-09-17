import React, { useState } from 'react'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import LiteFileCell from 'components/elements/FileCell/LiteFileCell'
import LitePersonCell from 'components/elements/PersonCell/LitePersonCell'
import TableLoading from 'components/elements/TableLoading'
import { renderAttributeIfDev } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import { useQueryParam } from 'util/hooks'
import CONSTANTS from 'util/constants'

export interface LiteFileInFolderProps {
  fileId: string
  folderId: string
}

const LiteFilesInFolder: React.FC<LiteFileInFolderProps> = (props) => {
  const { fileId } = props
  const [platformId] = useQueryParam('platformId', '')
  const pageSize = CONSTANTS.DEFAULT_PAGE_SIZE
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const { useGetLiteFilesInFolder } = useLitePlatformApiClient({
    defaultPageSize: pageSize
  })
  const [filesRs, err, isLoading] = useGetLiteFilesInFolder({
    requestDetails: { fileId, platformId, pageNumber: Number(pageNumber), pageSize, queryParams: { sort } }
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
            return <LiteFileCell file={val} platformId={platformId} />
          },
          'file owner': (val) => {
            return val.createdBy ? <LitePersonCell person={val.createdBy} platformId={platformId} /> : null
          },
          'created on': (val) => {
            return val.createdAt ? <DateAndTimeCell value={val.createdAt} /> : null
          },
          'last modified': (val) => {
            return val.lastModified ? <DateAndTimeCell value={val.lastModified} /> : null
          }
        }}>
        <EntityCountPagination
          entityCount={filesRs?.files?.length || 0}
          onPageChange={(next) => setPageNumber(next)}
          pageCount={filesRs?.pageCount || 0}
          pageNumber={Number(pageNumber)}
          pageSize={filesRs?.pageSize || 0}
        />
      </ModernTable>
    </div>
  )
}

export default LiteFilesInFolder
