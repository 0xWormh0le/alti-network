// Display interfaces for each kind of event types are represented below

// event type: people
interface DisplayAppSpotlightPeople {
  avatar: string
  name: string
  email: string
}

// event type: downloads
interface DisplayAppSpotlightEventDownloads {
  view: IFile
  file: IFile
  owner: IPerson
  datetime: number
}

interface BaseAppSpotlightEvent {
  targetPeople: IPerson[]
  files: IFile[]
  eventName: string
  eventDescription: string
  severity: SeverityRange
  datetime: number
}

interface AppSpotlightEvent extends BaseAppSpotlightEvent {
  eventId: string
}

// event type: risks
interface DisplayAppSpotlightRisk extends BaseRisk {
  view: FileResponseWithRisk
  file: FileCellWithRisk
  description: DisplayRiskDescription
  creator: IPerson
  owner: FileOwner
  action: RiskAction
}
