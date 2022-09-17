type AppType = string

interface BaseFile {
  createdBy: IPerson
  createdAt: number
  lastModified: number
  linkVisibility: LinkVisibility
}

interface ParentFolder {
  folderId: string
  folderName: string
}

interface IFile extends BaseFile {
  fileId: string
  fileName: string
  app: AppType
  internalAccessList: IPerson[]
  internalAccessCount: number
  externalAccessList: IPerson[]
  externalAccessCount: number
  iconUrl?: string
  lastIngested?: number
  md5Checksum?: string
  mimeType: string
  webLink: string
  parentFolder: ParentFolder | null
  platformId: string
  sharedToDomains?: {
    name: string
    permissionId: string
  }[]
  trashed?: boolean
  riskId?: string
  lastDownloaded?: number | null
}

interface FileResponse extends IFile {
  fileCount: number
  riskId: string | null
}

interface FileResponseWithRisk extends FileResponse {
  riskTypeId: number
  sensitivePhrases?: SensitivePhraseMultiFile
  sensitiveContent?: string
  pluginId?: string
  pluginName?: string
  personId?: string
  text?: string
  email?: string
  riskId?: string
  riskTypeId?: number
  personId?: string
}

interface FileWithRisk extends IFile {
  sensitivePhrases: ISensitiveObject
}

interface DisplayFile extends BaseFile {
  file: FileCell
}

interface Permission {
  discoverable: boolean
  permissionEmailAddress?: string | null
  permissionId: string
  platformId: string
  role: PermissionRole
  shared: PermissionShared
  type: PermissionType
  status: PermissionItemStatus
}
