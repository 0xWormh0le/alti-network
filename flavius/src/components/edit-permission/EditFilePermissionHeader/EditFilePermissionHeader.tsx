import React from 'react'
import { Link } from 'react-router-dom'
import AppIndicator from 'components/elements/AppIndicator'
import Person from 'models/Person'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import { formatDate } from 'components/files/FileGridHeader/fileGridHeaderUtils'
import { FileAttribute, shouldTruncate, truncatedFileName } from './editFilePermissionHeaderUtils'
import './EditFilePermissionHeader.scss'

export interface EditFilePermissionHeaderProps {
  file: IFile
}

const EditFilePermissionHeader: React.FC<EditFilePermissionHeaderProps> = ({ file }) => {
  const { fileName, app, fileId, createdBy, createdAt, lastModified, webLink, platformId } = file
  const creator = new Person(createdBy)
  const linkFileInspectorUrl = `${modalBasePath()}/file/${fileId}${searchWithoutModalParams()}`
  const userSpotlightUrl = `${modalBasePath()}/spotlight/${encodeURIComponent(
    creator.primaryEmail?.address ?? '' // altnetId
  )}${searchWithoutModalParams()}`

  return (
    <div className='EditFilePermissionHeader'>
      <div className='EditFilePermissionHeader__title EditFilePermissionHeader__title--permissions'>
        <Link to={linkFileInspectorUrl}>
          <Typography variant={TypographyVariant.H3} weight='normal' className='EditFilePermissionHeader__filename'>
            {shouldTruncate(fileName) ? truncatedFileName(fileName) : fileName}
          </Typography>
        </Link>
      </div>
      <div className='EditFilePermissionHeader__subheader EditFilePermissionHeader__subheader--permissions'>
        <AppIndicator
          value={app}
          fileId={fileId}
          webLink={webLink}
          platformId={platformId}
          className='EditFilePermissionHeader__subheader--icon'
        />
        <FileAttribute
          label={`${UI_STRINGS.EDIT_PERMISSIONS.OWNED_BY}:`}
          value={
            creator.displayName ? (
              <span className='EditFilePermissionHeader__file-attribute-value'>
                <Link className='EditFilePermissionHeader__link' to={userSpotlightUrl}>
                  {creator.displayName}
                </Link>
              </span>
            ) : (
              <span className='EditFilePermissionHeader__file-attribute-value'>
                {UI_STRINGS.EDIT_PERMISSIONS.SHARED_DRIVE}
              </span>
            )
          }
        />
        <FileAttribute
          label={`${UI_STRINGS.FILE.CREATED}:`}
          value={formatDate(createdAt, 'EditFilePermissionHeader__file-attribute-value')}
        />
        <FileAttribute
          label={`${UI_STRINGS.FILE.LAST_MODIFIED}:`}
          value={formatDate(lastModified, 'EditFilePermissionHeader__file-attribute-value')}
        />
      </div>
    </div>
  )
}

export default EditFilePermissionHeader
