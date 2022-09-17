interface LiteFile {
  createdAt: timestamp
  createdBy: LitePerson
  description: string
  fileId: string
  fileName: string
  lastModified: Maybe<number>
  mimeType: string
  parentFolder: {
    folderId: string
    folderName: string
  }
  path: string
  size: number
  version: string
}

interface LiteFileEvent {
  actor: LitePerson
  datetime: number
  eventName: string
  eventId: string
  files: LiteFile[]
  createdAt: number
}

interface LiteFilePermission {
  permissionId: string
  permissionEmailAddress?: Maybe<string>
}

interface LitePerson {
  name: {
    // the following is split by space
    familyName: string
    fullName: string
    givenName: string
  }
  primaryEmail: {
    address: string
  }
  providerId: string
  jobTitle: string
  status: string
  phone: string
  avatar: Avatar
  emails?: never
  displayName?: never
  recoveryEmail?: never
  anonymous?: never
  userKind?: never
}

interface LitePersonEvents {
  events: LiteFileEvent[]
  pageSize: number
  pageCount: number
  pageNumber: number
}

interface LiteFiles {
  files: LiteFile[]
  pageSize: number
  pageCount: number
  pageNumber: number
}

interface FileActivitiesResponse extends LitePersonEvents {
  eventType: FileActivityType
}
