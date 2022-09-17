import React, { useContext } from 'react'
import cx from 'classnames'
import { ErrorBox } from '@altitudenetworks/component-library'
import LiteFilesInFolder from 'components/files/FilesInFolder/LiteFilesInFolder'
import FileGridBanner from 'components/files/FileGridBanner'
import LiteFileGridHeader from 'components/files/FileGridHeader/LiteFileGridHeader'
import SectionTitle from 'components/elements/SectionTitle'
import FileDetails from 'components/files/FileDetails'
import FileGridNav from 'components/files/FileGridNav'
import TableLoading from 'components/elements/TableLoading'
import { UserContext } from 'models/UserContext'
import UI_STRINGS from 'util/ui-strings'
import { isExternalEmail } from 'util/helpers'
import CONSTANTS from 'util/constants'
import { FileGridNavType } from 'types/common'
import './FileGrid.scss'

export interface LiteFileGridProps {
  fileId: string
  file: LiteFile
  loading: boolean
  owner?: string
  selection: FileGridNavType
  onChangeSelection: (selection: FileGridNavType) => void
  isFolder: boolean
}

const LiteFileGrid: React.FC<LiteFileGridProps> = ({
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
  const renderBody = () => {
    switch (selection) {
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
            {folderId && fileId && <LiteFilesInFolder folderId={folderId} fileId={fileId} />}
          </div>
        )
      case FileGridNavType.DETAILS:
        return (
          <div className='FileGrid__section--body'>
            <SectionTitle titleText={UI_STRINGS.FILE.FILE_DETAILS} />
            <FileDetails fileData={file} loading={loading} />
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
      <LiteFileGridHeader file={file} loading={loading} />
      <div className='FileGrid__wrapper'>
        <FileGridNav
          loading={loading}
          selectedNavKey={selection}
          onChangeSelection={onChangeSelection}
          isFolder={isFolder}
        />
        <div className='FileGrid__section FileGrid__events'>{loading ? <TableLoading /> : renderBody()}</div>
      </div>
    </div>
  )
}

export default LiteFileGrid
