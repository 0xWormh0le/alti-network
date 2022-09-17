type AppType = 'GDrive'

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
  iconUrl: string
  parentFolder: ParentFolder | null
  sharedToDomains?: {
    name: string
    permissionId: string
  }[]
  trashed?: boolean
  riskId?: string
}

interface FileResponse extends IFile {
  fileCount: number
  riskId: string | null
}

interface FileResponseWithRisk extends FileResponse {
  riskTypeId: number
  sensitivePhrases: Array<ISensitivePhrase>
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

interface BasePermission {
  discoverable: boolean
  permissionEmailAddress: string
  permissionId: string
  role: 'read' | 'write'
  shared: 'external' | 'internal' | 'none'
  type: 'anyone' | 'domain' | 'user'
}
