type SpotlightEventType = 'downloads' | 'added' | 'sharedWith' | 'sharedBy'

interface BaseSpotlightEvent {
  targetPeople: IPerson[]
  files: IFile[]
  eventName: string
  eventDescription: string
  severity: SeverityRange
  datetime: number
}

interface SpotlightEvent extends BaseSpotlightEvent {
  eventId: string
  eventDescription: string
  eventName: string
  ipAddress: string
  membershipChangeType: string
  newValue: string
  newVisibility: string
  oldValue: string
  oldVisibility: string
  sourceFolderTitle: string
  destinationFolderTitle: string
  visibilityChange: string
  targetPeople: Array<IPerson>
}

// Display interfaces for each kind of event types are represented below

// event type: undefined (all events)
interface DisplaySpotlightEventAllActivity {
  file: IFile
  datetime: number
  eventDescription: SpotlightEvent
  target?: IPerson
  ip: string
}

// event type: downloads
interface DisplaySpotlightEventDownloads {
  file: IFile
  ip?: string
  owner: IPerson
  datetime: number
}

// event type: downloads
interface DisplaySpotlightAtRiskFilesOwned {
  file: IFile
  createdAt: number
  lastModified: number
}

// event type: added
interface DisplaySpotlightEventCollaborators {
  collaborator: IPerson
  ip: string
  file: IFile
  owner: IPerson
  datetime: number
}

// event type: sharedWith
interface DisplaySpotlightEventFilesSharedWith {
  file: IFile
  owner: IPerson
  sharedWith: IPerson
  datetime: number
  ipAddress: string
}

// event type: sharedBy
interface DisplaySpotlightEventFilesSharedBy {
  file: IFile
  owner: IPerson
  sharedBy: IPerson
  datetime: number
  ipAddress: string
}
