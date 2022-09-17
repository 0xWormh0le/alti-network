import React, { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { ErrorBox, ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import SectionTitle from 'components/elements/SectionTitle'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import AvatarCell from 'components/elements/AvatarCell'
import UI_STRINGS from 'util/ui-strings'
import useQueryParam from 'util/hooks/useQueryParam'
import { getCSVData } from 'util/csv'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import { GENERAL_URLS } from 'api/endpoints'
import Person from 'models/Person'
import useFileApiClient from 'api/clients/fileApiClient'

export interface CollaboratorProps {
  datakeyName: string
  fileId: string
  platformId: string
  titleText: string
}

const PAGE_SIZE = 5

const CollaboratorsTable: React.FC<CollaboratorProps> = ({ datakeyName, fileId, platformId, titleText }) => {
  const { useGetFile } = useFileApiClient()
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [isExportingCsv, setIsExportingCsv] = useState(false)
  const [collaborators, err, isLoading] = useGetFile(fileId, platformId)

  const handleExportCsv = useCallback(() => {
    setIsExportingCsv(true)
    getCSVData(
      {
        baseUrl: `${GENERAL_URLS.FILE}/${fileId}?platform-id=${platformId}`,
        dataKeyName: datakeyName,
        endpointName: 'file',
        pageSize: 1,
        pageCount: 1,
        queryParams: { fileId, platformId }
      },
      'Internal Collaborator',
      'Email',
      (value: Person) => value.primaryEmail.address || ''
    ).then(() => setIsExportingCsv(false))
  }, [datakeyName, fileId, platformId])

  const accessList = useMemo(() => (collaborators ? collaborators[datakeyName] : []), [collaborators, datakeyName])

  const pageCount = Math.ceil(accessList.length / PAGE_SIZE)

  const itemsInPage = useMemo(
    () =>
      (accessList as []).filter(
        (item, index) => index >= (pageNumber - 1) * PAGE_SIZE && index < pageNumber * PAGE_SIZE
      ),
    [accessList, pageNumber]
  )

  if (err) {
    return (
      <ErrorBox
        mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
        secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
      />
    )
  }

  return (
    <>
      <SectionTitle titleText={titleText} />
      <ModernTable
        isLoading={isLoading}
        loadingComponent={<TableLoading />}
        className='CollaboratorsTable'
        items={itemsInPage}
        fields={[UI_STRINGS.FILE.NAME, UI_STRINGS.FILE.PRIMARY_EMAIL]}
        scopedSlots={{
          [UI_STRINGS.FILE.NAME]: (person: IPerson) => {
            return (
              <span className='PersonCell'>
                <AvatarCell person={new Person(person)} />
                {person?.name?.givenName} {person?.name?.familyName}
              </span>
            )
          },
          [UI_STRINGS.FILE.PRIMARY_EMAIL]: (person: IPerson) => {
            return (
              <Link
                to={`${modalBasePath()}/spotlight/${encodeURIComponent(
                  person.primaryEmail.address || ''
                )}${searchWithoutModalParams()}`}
                className='People__link'>
                {person.primaryEmail.address}
              </Link>
            )
          }
        }}>
        <EntityCountPagination
          entityCount={accessList.length}
          onPageChange={setPageNumber}
          pageCount={pageCount}
          pageNumber={Number(pageNumber)}
          pageSize={PAGE_SIZE}
          isLoadingExportCsv={isExportingCsv}
          onExportCsv={handleExportCsv}
        />
      </ModernTable>
    </>
  )
}

export default CollaboratorsTable
