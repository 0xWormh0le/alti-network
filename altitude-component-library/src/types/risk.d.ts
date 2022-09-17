type RiskTypeId =
  | 0
  | 10
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

interface BaseRisk {
  riskId: string
  riskTypeId: RiskTypeId
  app: AppType
  datetime: number
  owner: IPerson
  creator?: IPerson
  severity: SeverityRange
  fileCount: number
  riskTarget?: [
    {
      id: string
      name: string
    }
  ]
}

interface PersonOrPeople extends IPerson {
  riskId: string
}

interface RiskAction {
  riskId: string
  riskTypeId: RiskTypeId
  description: string
  owner: TablePropertyAccessor<IPerson>
  // creator: TablePropertyAccessor<IPerson>
  file: TablePropertyAccessor<FileCell>
  email: string
  plugin: {
    id: string
    name: string
  }
}

interface DisplayAppIndicator {
  name: AppType
  fileId: string
}

interface FileOwner extends IPerson {
  fileCount?: number
  riskTypeId?: RiskTypeId
}

interface DisplayRisk extends BaseRisk {
  file: FileCellWithRisk
  description: DisplayRiskDescription
  owner: FileOwner
  action: RiskAction
}

interface ISensitivePhrase {
  ccFileNumCount: number
  sensitiveKeywordsFileCount: number
  ssnFileCount: number
  sensitiveKeywords?: List
}

interface RiskResponse extends BaseRisk {
  riskId: string
  fileId: string
  fileName: string
  riskCount: number
  riskDescription: string
  mimeType: string
  plugin: {
    id: string
    name: string
  }
  sensitivePhrases: Array<ISensitivePhrase>
}

interface Risk extends DisplayRisk {
  riskId: string
  file: IFile
  risk: RiskResponse
}

interface RiskTypeSummary {
  riskTypeId: RiskTypeId
  count: number
  severity: SeverityRange
}
