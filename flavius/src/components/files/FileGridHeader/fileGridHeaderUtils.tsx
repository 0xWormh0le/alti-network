import React from 'react'
import Moment from 'react-moment'
import { upperFirst } from 'lodash'
import UI_STRINGS from 'util/ui-strings'
import CONSTANTS from 'util/constants'
import folderIcon from 'icons/icon-small-folder-black.svg'
import VisibilityPill from 'components/elements/VisibilityPill'

export const getViewFileText = (mimeType: string, platformId: string) => {
  switch (platformId) {
    case UI_STRINGS.PLATFORMS.GSUITE_ID:
      if (mimeType === '') {
        return UI_STRINGS.FILE.GSUITE_VIEW_UKNOWN
      }
      return mimeType === 'folder'
        ? UI_STRINGS.FILE.GSUITE_VIEW_ORIGINAL_FOLDER_IN_DRIVE
        : UI_STRINGS.FILE.GSUITE_VIEW_ORIGINAL_FILE_IN_DRIVE
    case UI_STRINGS.PLATFORMS.O365_ID:
      if (mimeType === '') {
        return UI_STRINGS.FILE.O365_VIEW_UNKNOWN
      }
      return mimeType === 'folder'
        ? UI_STRINGS.FILE.O365_VIEW_ORIGINAL_FOLDER_IN_DRIVE
        : UI_STRINGS.FILE.O365_VIEW_ORIGINAL_FILE_IN_DRIVE
    case UI_STRINGS.PLATFORMS.BOX_ID:
      if (mimeType === '') {
        return UI_STRINGS.FILE.BOX_VIEW_UNKNOWN
      }
      return mimeType === 'folder'
        ? UI_STRINGS.FILE.BOX_VIEW_ORIGINAL_FOLDER_IN_DRIVE
        : UI_STRINGS.FILE.BOX_VIEW_ORIGINAL_FILE_IN_DRIVE
    default:
      return ''
  }
}

const { TIME_DISPLAY_FORMAT } = CONSTANTS

export const formatDate = (timestamp?: Maybe<number>, className?: string) =>
  timestamp ? (
    <Moment unix={true} format={TIME_DISPLAY_FORMAT.DATE_FORMAT} className={className}>
      {timestamp}
    </Moment>
  ) : (
    <span className={className}>{upperFirst(UI_STRINGS.FILE.UNKNOWN)}</span>
  )

export const parentFolderIcon = (
  <>
    <span className='FileGridHeader__descriptor FileGridHeader__descriptor--align'>
      {UI_STRINGS.FILE.PARENT_FOLDER}
    </span>
    <img src={folderIcon} alt='Parent folder' className='FileGridHeader__file-info-icon' />
  </>
)

interface FileAttributeProps {
  label: string
  value: JSX.Element
}

export const FileAttribute: React.FC<FileAttributeProps> = ({ label, value }) => (
  <div className='FileAttribute'>
    <span className='FileGridHeader__file-attribute'>{label}</span>
    <span>{value}</span>
  </div>
)

interface FileContentProps {
  linkVisibility: LinkVisibility
  sensitiveContent?: LinkVisibility | undefined | null
}

export const FileContent: React.FC<FileContentProps> = ({ linkVisibility, sensitiveContent }) => {
  return (
    <div className='FileGridHeader__row'>
      <div>
        <VisibilityPill visibility={linkVisibility} />
      </div>
      {sensitiveContent && (
        <div>
          <VisibilityPill visibility={sensitiveContent} />
        </div>
      )}
    </div>
  )
}
