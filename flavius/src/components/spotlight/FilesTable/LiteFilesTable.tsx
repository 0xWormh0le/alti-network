import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import DateAndTimeCell from 'components/elements/DateAndTimeCell'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import LiteFileCell from 'components/elements/FileCell/LiteFileCell'
import LitePersonCell from 'components/elements/PersonCell/LitePersonCell'
import TableLoading from 'components/elements/TableLoading'
import React from 'react'
import useQueryParam from 'util/hooks/useQueryParam'
import UI_STRINGS from 'util/ui-strings'

interface LiteFilesTableProps {
  fields: string[]
  personId?: string
  ownerId?: string
}

const LiteFilesTable: React.FC<LiteFilesTableProps> = ({ fields, personId, ownerId }) => {
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [platformId] = useQueryParam<string>('platformId', '')

  const { useGetLiteFiles } = useLitePlatformApiClient()
  const [files, err, isLoading] = useGetLiteFiles(platformId, pageNumber, personId || null, ownerId || null)

  const scopedSlots = {
    [UI_STRINGS.FILE.FILE_NAME]: (val: LiteFile) => {
      return <LiteFileCell file={val} platformId={platformId} />
    },
    [UI_STRINGS.EDIT_PERMISSIONS.CREATED_ON]: (val: LiteFile) => {
      return <DateAndTimeCell value={val.createdAt} />
    },
    [UI_STRINGS.EDIT_PERMISSIONS.LAST_MODIFIED]: (val: LiteFile) => {
      return <DateAndTimeCell value={val.lastModified || 0} />
    },
    [UI_STRINGS.FILE.FILE_OWNER]: (val: LiteFile) => {
      return val.createdBy ? <LitePersonCell person={val.createdBy} platformId={platformId} /> : null
    }
  }

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
      loadingComponent={<TableLoading />}
      isLoading={isLoading}
      fields={fields}
      items={files?.files || []}
      scopedSlots={scopedSlots}>
      <EntityCountPagination
        entityCount={files?.files.length || 0}
        onPageChange={setPageNumber}
        pageCount={files?.pageCount || 0}
        pageNumber={pageNumber}
        pageSize={files?.pageSize || 0}
      />
    </ModernTable>
  )
}

export default LiteFilesTable
