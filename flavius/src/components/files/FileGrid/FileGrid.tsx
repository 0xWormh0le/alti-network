import React, { useContext } from 'react'
import cx from 'classnames'
import { ErrorBox } from '@altitudenetworks/component-library'
import FileEvents from 'components/files/FileEvents'
import FilesInFolder from 'components/files/FilesInFolder'
import FileGridBanner from 'components/files/FileGridBanner'
import FileGridHeader from 'components/files/FileGridHeader'
import SectionTitle from 'components/elements/SectionTitle'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import FileContentInspection from 'components/files/FileContentInspection'
import CollaboratorsTable from 'components/files/CollaboratorsTable'
import FileGridNav from 'components/files/FileGridNav'
import { UserContext } from 'models/UserContext'
import UI_STRINGS from 'util/ui-strings'
import { isExternalEmail } from 'util/helpers'
import useQueryParam from 'util/hooks/useQueryParam'
import CONSTANTS from 'util/constants'
import { FileGridNavType } from 'types/common'
import './FileGrid.scss'

export interface FileGridProps {
  fileId: string
  file: IFile
  loading: boolean
  owner?: string
  selection: FileGridNavType
  onChangeSelection: (selection: FileGridNavType) => void
  isFolder: boolean
}

const FileGrid: React.FC<FileGridProps> = ({
  file,
  fileId,
  loading,
  owner,
  selection,
  onChangeSelection,
  isFolder
}) => {
  const user = useContext(UserContext)
  const externallyOwned = owner ? isExternalEmail(user.domains, owner) : false
  const [platformId] = useQueryParam('platformId', '')
  const renderBody = () => {
    switch (selection) {
      case FileGridNavType.SENSITIVE:
        return (
          <div className='FileGrid__section--body'>
            <SectionTitle titleText={UI_STRINGS.FILE.FILE_SENSITIVE_CONTENTS} />
            <FileContentInspection
              sensitiveKeywords={(file as FileWithRisk)?.sensitivePhrases?.sensitiveKeywords}
              ccn={(file as FileWithRisk)?.sensitivePhrases?.ccNum}
              ssn={(file as FileWithRisk)?.sensitivePhrases?.ssn}
              loading={loading}
            />
          </div>
        )
      case FileGridNavType.TIMELINE:
        return externallyOwned ? (
          <div className='FileGrid__section--body'>
            <SectionTitle titleText={UI_STRINGS.FILE.FILE_ACTION_TIMELINE} />
            <div className='FileGrid__external'>
              <Typography variant={TypographyVariant.H4} weight='light'>
                {UI_STRINGS.FILES.ACTION_TIMELINE_NOTAVAILABLE_OUTSIDE}
              </Typography>
            </div>
          </div>
        ) : (
          <div className='FileGrid__section--body'>
            <SectionTitle titleText={UI_STRINGS.FILE.FILE_ACTION_TIMELINE} />
            <FileEvents fileId={fileId} />
          </div>
        )
      case FileGridNavType.INTERNAL:
        return (
          <div className='FileGrid__section--body'>
            <CollaboratorsTable
              fileId={fileId}
              platformId={platformId}
              datakeyName='internalAccessList'
              titleText={UI_STRINGS.FILE.INTERNAL_COLLABORATORS}
            />
          </div>
        )
      case FileGridNavType.EXTERNAL:
        return (
          <div className='FileGrid__section--body'>
            <CollaboratorsTable
              fileId={fileId}
              platformId={platformId}
              datakeyName='externalAccessList'
              titleText={UI_STRINGS.FILE.EXTERNAL_COLLABORATORS}
            />
          </div>
        )
      case FileGridNavType.FILES_IN_FOLDER:
        const folderName = file?.parentFolder?.folderName || ''
        const folderId = isFolder ? fileId : file?.parentFolder?.folderId || ''

        return (
          <div className='FileGrid__section--body'>
            <SectionTitle titleText={UI_STRINGS.FILE.FILES_IN_FOLDER}>
              {folderName === CONSTANTS.EXTERNAL_OR_UNKNOWN ? (
                <span className='FileGrid__section__title-folder disabled'>
                  ( {UI_STRINGS.FILE.EXTERNAL_OR_UNKNOWN} )
                </span>
              ) : (
                <span className='FileGrid__section__title-folder'>
                  {isFolder ? (file.fileName ? `( ${file.fileName} )` : '') : folderName ? `( ${folderName} )` : ''}
                </span>
              )}
            </SectionTitle>
            {!folderId && <ErrorBox mainMessage='No results found' secondaryMessage='' />}
            {folderId && fileId && <FilesInFolder folderId={folderId} fileId={fileId} />}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div
      className={cx('FileGrid', {
        'FileGrid--externally-owned': externallyOwned
      })}>
      {externallyOwned && (
        <FileGridBanner message={UI_STRINGS.FILES.THIS_FILE_IS_OWNED_BY_EXTERNAL_ACC(owner ? owner : '')} />
      )}
      <FileGridHeader file={file} loading={loading} />
      <div className='FileGrid__wrapper'>
        <FileGridNav
          loading={loading}
          selectedNavKey={selection}
          onChangeSelection={onChangeSelection}
          internalCount={file.internalAccessCount}
          externalCount={file.externalAccessCount}
          isFolder={isFolder}
        />
        <div className='FileGrid__section FileGrid__events'>{renderBody()}</div>
      </div>
    </div>
  )
}

export default FileGrid
