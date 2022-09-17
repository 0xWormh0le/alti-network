import React, { useEffect } from 'react'
import { alertError } from 'util/alert'
import FileGrid from '../FileGrid'
import Person from 'models/Person'
import { UI_STRINGS } from 'util/ui-strings'
import useQueryParam from 'util/hooks/useQueryParam'
import { UsageKind, UserKind, AccessLevel, FileGridNavType } from 'types/common'
import useFileApiClient from 'api/clients/fileApiClient'
import { isEmpty } from 'lodash'

export interface FileContainerProps {
  fileId: string
  isFolder: boolean
  onFileLoaded?: (hasError: boolean) => void
}

const initialFileData: IFile = {
  fileId: '',
  fileName: '',
  app: 'GDrive',
  internalAccessList: [],
  internalAccessCount: 0,
  externalAccessList: [],
  externalAccessCount: 0,
  platformId: '',
  createdBy: new Person({
    name: {
      givenName: '',
      familyName: '',
      fullName: ''
    },
    primaryEmail: {
      address: '',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    recoveryEmail: {
      address: 'test@email.com',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    internal: true,
    riskCount: 0,
    accessCount: 0,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    altnetId: '',
    projectId: '',
    accessLevel: AccessLevel.member,
    userKind: UserKind.user,
    phones: [],
    externalIds: [],
    orgUnitPath: '',
    etag: '',
    isEnrolledInMFA: false,
    creationTime: 0,
    lastLoginTime: 0,
    lastModifiedTime: 0,
    notes: {
      content: '',
      content_type: ''
    }
  }),
  createdAt: 0,
  lastModified: 0,
  linkVisibility: UI_STRINGS.FILE.UNKNOWN as LinkVisibility,
  mimeType: '',
  webLink: '',
  parentFolder: null
}

const getDefaultNavSelection = (isFolder: boolean, hasSensitive: boolean): FileGridNavType => {
  if (hasSensitive) {
    return FileGridNavType.SENSITIVE
  } else if (isFolder) {
    return FileGridNavType.FILES_IN_FOLDER
  } else {
    return FileGridNavType.TIMELINE
  }
}

const FileContainer: React.FC<FileContainerProps> = (props) => {
  const { fileId, isFolder, onFileLoaded } = props
  const [sensitive] = useQueryParam('sensitive', false)
  const [selection, setSelection] = useQueryParam<FileGridNavType>(
    'selection',
    getDefaultNavSelection(isFolder, sensitive),
    {
      modalPage: 1
    }
  )
  const [platformId] = useQueryParam('platformId', '')

  const { useGetFile } = useFileApiClient({
    handleError: (err: Error) => {
      alertError(err.message)
      if (onFileLoaded) {
        onFileLoaded(true)
      }
    }
  })
  const [fileRs, , isLoading] = useGetFile(fileId, platformId)

  useEffect(() => {
    if (onFileLoaded && fileRs) {
      if (isEmpty(fileRs)) {
        onFileLoaded(true)
      } else {
        onFileLoaded(false)
      }
    }
  }, [fileRs, onFileLoaded])

  const fileData = fileRs && !isEmpty(fileRs) ? fileRs : initialFileData

  return (
    <FileGrid
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

export default FileContainer
