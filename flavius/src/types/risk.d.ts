type RiskTypeId =
  | 0
  | 10
  | 11
  | 1011
  | 1013
  | 1020
  | 1022
  | 1021
  | 1023
  | 1050
  | 1051
  | 2000
  | 2001
  | 2002
  | 2003
  | 2010
  | 2011
  | 3100
  | 3200
  | 3010
  | 3012

type UserVisibilityState = 'ignored' | 'active'

type FilterUserVisibilityState = UserVisibilityState | 'all'

interface BaseRisk {
  riskId: string
  riskTypeId: RiskTypeId
  app: AppType
  datetime: number
  owner?: IPerson
  creator?: IPerson
  sensitiveContent?: string
  severity: SeverityRange
  fileCount: number
  riskTarget?: [
    {
      id: string
      name: string
    }
  ]
  userVisibilityState: UserVisibilityState
}

interface PersonOrPeople extends IPerson {
  riskId: string
}

interface RiskAction {
  riskId: string
  riskTypeId: RiskTypeId
  description: string
  owner?: IPerson
  // creator: TablePropertyAccessor<IPerson>
  file: TablePropertyAccessor<FileCell> | FileCell
  email: string
  plugin: {
    id: string
    name: string
  }
  userVisibilityState: UserVisibilityState
  platformId: string
  webLink: string
}

interface DisplayAppIndicator {
  name: AppType
  fileId: string
}

interface RiskMetadata {
  fileCount?: number
  riskTypeId?: RiskTypeId
}

// IPerson may not be included in the FileOwner
type FileOwner = RisksMetadata | IPerson

interface DisplayRisk extends BaseRisk {
  file: FileCellWithRisk
  description: DisplayRiskDescription
  owner?: FileOwner
  action: RiskAction
}

interface RiskResponse extends BaseRisk {
  riskId: string
  fileId: string
  fileName: string
  riskCount: number
  riskDescription: string
  mimeType: string
  webLink: string
  platformId: string
  plugin: {
    id: string
    name: string
  }
  sensitivePhrases: SensitivePhraseMultiFile
  incidentDate?: Maybe<number>
}

interface Risk extends DisplayRisk {
  riskId: string
  file: IFile
  risk: RiskResponse
  riskCount?: number
}

type RisksResponse = ServerResponseData<{
  risks: RiskResponse[]
  riskCount: number
}>

interface RiskTypeSummary {
  riskTypeId: RiskTypeId
  count: number
  severity: SeverityRange
}

interface BasicRiskTypeGroup {
  groupType: number
  name: string
}
