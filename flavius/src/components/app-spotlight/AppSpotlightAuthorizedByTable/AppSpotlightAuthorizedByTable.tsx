import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import AvatarCell from 'components/elements/AvatarCell'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { getCSVData } from 'util/csv'
import { GENERAL_URLS } from 'api/endpoints'
import Person from 'models/Person'
import usePersonApiClient from 'api/clients/personApiClient'
import { useQueryParam, useGetCachedPageSize } from 'util/hooks'

export interface AppSpotlightAuthorizedByTableProps {
  applicationId: string
  platformId: string
}

const fields = [UI_STRINGS.FILE.PERSON, UI_STRINGS.FILE.NAME, UI_STRINGS.FILE.PRIMARY_EMAIL]

const rowMapper = (value: IPerson) => [new Person(value).displayName, value.primaryEmail?.address].join()

const csvHeaderRow = [UI_STRINGS.CSV_HEADERS.NAME, UI_STRINGS.CSV_HEADERS.EMAIL].join()

const AppSpotlightAuthorizedByTable: React.FC<AppSpotlightAuthorizedByTableProps> = ({ applicationId, platformId }) => {
  const [pageSize, setPageSize] = useGetCachedPageSize({ modalPage: 1 })
  const { useGetPeople } = usePersonApiClient({
    defaultPageSize: pageSize
  })
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [sort, setSort] = useState<'asc' | 'desc'>('desc')
  const [response, err, isLoading] = useGetPeople({
    requestDetails: {
      applicationId,
      pageNumber,
      pageSize,
      platformId,
      queryParams: {}
    }
  })

  const handleExportCsv = useCallback(() => {
    setIsExportingCsv(true)
    getCSVData(
      {
        baseUrl: `${GENERAL_URLS.PEOPLE}?application-id=${applicationId}&platform-id=${encodeURIComponent(platformId)}`,
        dataKeyName: 'people',
        endpointName: 'people',
        pageSize: response?.pageSize || 0,
        pageCount: response?.pageCount || 0,
        queryParams: { sort }
      },
      'People',
      csvHeaderRow,
      rowMapper
    ).then(() => setIsExportingCsv(false))
    setIsExportingCsv(true)
  }, [response, sort, applicationId, platformId])

  if (err)
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
      isLoading={isLoading}
      loadingComponent={<TableLoading />}
      className='AppSpotlightAuthorizedByTable'
      sortingHeaders={[UI_STRINGS.APPSPOTLIGHT.SEVERITY, UI_STRINGS.FILE.DETECTED_ON]}
      items={response?.people || []}
      fields={fields}
      scopedSlots={{
        [UI_STRINGS.FILE.PERSON]: (value: IPerson) => <AvatarCell person={new Person(value)} />,
        [UI_STRINGS.FILE.NAME]: (value: IPerson) => <span>{new Person(value).displayName}</span>,
        [UI_STRINGS.FILE.PRIMARY_EMAIL]: (value: IPerson) => (
          <Link
            to={`${modalBasePath()}/spotlight/${encodeURIComponent(
              value?.primaryEmail?.address || ''
            )}${searchWithoutModalParams()}`}
            className='People__link'>
            {value?.primaryEmail?.address}
          </Link>
        )
      }}>
      <EntityCountPagination
        onPageChange={setPageNumber}
        onPageSizeChange={setPageSize}
        entityCount={response?.people?.length || 0}
        onExportCsv={handleExportCsv}
        isLoadingExportCsv={isExportingCsv}
        pageNumber={Number(pageNumber)}
        pageSize={response?.pageSize || 10}
        pageCount={response?.pageCount || 0}
      />
    </ModernTable>
  )
}

export default AppSpotlightAuthorizedByTable
