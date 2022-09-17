import React, { useState } from 'react'
import EditFilePermissionHeader from '../EditFilePermissionHeader'
import FilePermissions from '../FilePermissions'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import useFileApiClient from 'api/clients/fileApiClient'
import CONSTANTS from 'util/constants'
import './EditFilePermissionContainer.scss'

export interface EditFilePermissionContainerProps {
  fileId: string
  riskId: string
  platformId: string
}

const EditFilePermissionContainer: React.FC<EditFilePermissionContainerProps> = (props) => {
  const { fileId, riskId, platformId } = props
  const [pageNumber, setPageNumber] = useState(1)

  const { useGetFilePermissions, useGetFile } = useFileApiClient()
  const [file] = useGetFile(fileId, platformId)
  const [permissions, , permissionsLoading, getPermissions] = useGetFilePermissions({
    requestDetails: { fileId, platformId, pageNumber, pageSize: CONSTANTS.DEFAULT_PAGE_SIZE }
  })

  return (
    <div className='EditFilePermissionContainer'>
      {file && <EditFilePermissionHeader file={file} />}
      <div className='EditFilePermissionContainer--wrapper'>
        <Typography variant={TypographyVariant.H4} weight='normal' className='EditFilePermissionContainer__heading'>
          {UI_STRINGS.EDIT_PERMISSIONS.FILE_PERMISSIONS}
        </Typography>
        <FilePermissions
          totalEntityCount={permissions?.permissionsCount || 0}
          permissions={permissions ? permissions.permissions : []}
          pageSize={permissions ? permissions.pageSize : 0}
          pageCount={permissions ? permissions.pageCount : 0}
          pageNumber={pageNumber}
          entityCount={permissions?.permissions?.length || 0}
          loading={permissionsLoading}
          fileId={fileId}
          fileName={file ? file.fileName : ''}
          riskId={riskId}
          onPageChange={(next) => setPageNumber(next)}
          ownerEmail={file ? file.createdBy.primaryEmail?.address || '' : ''}
          getPermissions={() =>
            getPermissions.call({ fileId, platformId, pageNumber, pageSize: CONSTANTS.DEFAULT_PAGE_SIZE })
          }
          platformId={platformId}
        />
      </div>
    </div>
  )
}

export default EditFilePermissionContainer
