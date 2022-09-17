import React from 'react'
import { alertError } from 'util/alert'
import LiteFileGrid from '../FileGrid/LiteFileGrid'
import useQueryParam from 'util/hooks/useQueryParam'
import { isEmpty } from 'lodash'
import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import { FileGridNavType } from 'types/common'

export interface LiteFileContainerProps {
  fileId: string
  isFolder: boolean
}

const initialFileData: LiteFile = {
  fileId: '',
  fileName: '',
  createdBy: {
    name: {
      givenName: '',
      familyName: '',
      fullName: ''
    },
    primaryEmail: {
      address: ''
    },
    providerId: '',
    jobTitle: '',
    status: '',
    phone: '',
    avatar: {
      url: '',
      url_etag: ''
    }
  },
  createdAt: 0,
  lastModified: 0,
  mimeType: '',
  parentFolder: {
    folderId: '',
    folderName: ''
  },
  path: '',
  description: '',
  size: 0,
  version: ''
}

const LiteFileContainer: React.FC<LiteFileContainerProps> = (props) => {
  const { fileId, isFolder } = props
  const [selection, setSelection] = useQueryParam<FileGridNavType>('selection', FileGridNavType.DETAILS, {
    modalPage: 1
  })
  const [platformId] = useQueryParam('platformId', '')

  const { useGetLiteFile } = useLitePlatformApiClient({
    handleError: (err: Error) => {
      alertError(err.message)
    }
  })
  const [fileRs, , isLoading] = useGetLiteFile({ requestDetails: { fileId, platformId } })

  const fileData = fileRs && !isEmpty(fileRs) ? fileRs : initialFileData

  return (
    <LiteFileGrid
      loading={isLoading}
      fileId={fileId}
      file={fileData}
      owner={fileData.createdBy.primaryEmail?.address}
      onChangeSelection={(navSelection: FileGridNavType) => setSelection(navSelection)}
      selection={selection}
      isFolder={isFolder}
    />
  )
}

export default LiteFileContainer
