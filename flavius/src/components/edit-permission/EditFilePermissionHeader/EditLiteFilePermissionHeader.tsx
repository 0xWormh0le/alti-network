import React from 'react'
import { Link } from 'react-router-dom'
import AppIndicator from 'components/elements/AppIndicator'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import { formatDate } from 'components/files/FileGridHeader/fileGridHeaderUtils'
import { FileAttribute, shouldTruncate, truncatedFileName } from './editFilePermissionHeaderUtils'
import './EditFilePermissionHeader.scss'

export interface EditLiteFilePermissionHeaderProps {
  file: LiteFile
  platformId: string
}

const EditLiteFilePermissionHeader: React.FC<EditLiteFilePermissionHeaderProps> = ({ file, platformId }) => {
  const { fileName, fileId, createdBy, createdAt, lastModified, path } = file
  const linkFileInspectorUrl = `${modalBasePath()}/file/${fileId}${searchWithoutModalParams()}`
  const userSpotlightUrl = `${modalBasePath()}/spotlight/${encodeURIComponent(
    createdBy.primaryEmail?.address ?? ''
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
        <AppIndicator value={''} fileId={fileId} webLink={path} platformId={platformId} />
        <FileAttribute
          label={`${UI_STRINGS.EDIT_PERMISSIONS.OWNED_BY}:`}
          value={
            createdBy.name.fullName ? (
              <span className='EditFilePermissionHeader__file-attribute-value'>
                <Link className='EditFilePermissionHeader__link' to={userSpotlightUrl}>
                  {createdBy.name.fullName}
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

export default EditLiteFilePermissionHeader
