import React from 'react'
import { ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import UI_STRINGS from 'util/ui-strings'
import { formatBytes, DateUtils } from 'util/helpers'
import CONSTANTS from 'util/constants'
import './FileDetails.scss'

export interface FileDetailsProps {
  fileData: LiteFile
  loading: boolean
}

interface FileDetail {
  name: string
  value: string
}

const { TIME_DISPLAY_FORMAT } = CONSTANTS

const mapFileDetails = (file: LiteFile): FileDetail[] =>
  file
    ? [
        {
          name: UI_STRINGS.FILE.NAME,
          value: file.fileName
        },
        {
          name: UI_STRINGS.FILE.FILE_ID,
          value: file.fileId
        },
        {
          name: UI_STRINGS.FILE.DESCRIPTION,
          value: file.description
        },
        {
          name: UI_STRINGS.FILE.SIZE,
          value: formatBytes(file.size)
        },
        {
          name: UI_STRINGS.FILE.CREATED,
          value: DateUtils.dateFormat(file.createdAt, TIME_DISPLAY_FORMAT.DATE_FORMAT)
        },
        {
          name: UI_STRINGS.FILE.LAST_MODIFIED,
          value: file.lastModified ? DateUtils.dateFormat(file.lastModified, TIME_DISPLAY_FORMAT.DATE_FORMAT) : ''
        },
        {
          name: UI_STRINGS.FILE.FILE_OWNER,
          value: file.createdBy.name.fullName
        },
        {
          name: UI_STRINGS.FILE.VERSION,
          value: file.version
        },
        {
          name: UI_STRINGS.FILE.PARENT_FOLDER,
          value: file.parentFolder.folderName
        },
        {
          name: UI_STRINGS.FILE.PATH_COLLECTION,
          value: file.path
        }
      ].filter((detail) => detail.value) // only display non empty value cell
    : []

const FileDetails: React.FC<FileDetailsProps> = ({ fileData, loading }) => (
  <ModernTable
    isLoading={loading}
    loadingComponent={<TableLoading />}
    className='FileDetails'
    items={mapFileDetails(fileData)}
    fields={['name', 'value']}
    scopedSlots={{
      name: (val) => {
        return val.name
      },
      value: (val) => {
        return val.value
      }
    }}
  />
)

export default FileDetails
