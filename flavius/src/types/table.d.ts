type SeverityRange = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

type TableResponses = RiskResponse | FileResponseWithRisk | IPerson | IFileEvent | SpotlightEvent | AppSpotlightEvent

type TableDisplay =
  | DisplayRisk
  | DisplayFile
  | DisplayPerson
  | DisplayFileEvent
  | DisplaySpotlightEventAllActivity
  | DisplaySpotlightEventDownloads
  | DisplaySpotlightEventCollaborators
  | DisplaySpotlightEventFilesSharedWith
  | DisplaySpotlightEventFilesSharedBy
  | DisplaySpotlightAtRiskFilesOwned
  | DisplayAppSpotlightRisk

interface TablePropertyAccessor<T> {
  // TODO, type the return value according to T
  // May not be possible in a clean way now, see https://github.com/Microsoft/TypeScript/issues/6606
  get: (x: keyof T) => any
}

interface FileCell {
  app?: string
  fileId: string
  fileName: string
  fileCount?: number
  riskId: string
  createdBy?: IPerson
  sensitivePhrases?: any
  mimeType: string
  webLink: string
  platformId: string
}

interface FileCellWithRisk extends FileCell {
  riskTypeId: RiskTypeId
  email: string
  riskId: string
  pluginId?: string
  pluginName?: string
  text?: string
  personId?: string
  iconUrl?: string
}

interface FileCellWithoutRisk {
  fileCount?: any
  riskTypeId?: any
  sensitivePhrases?: any
}

interface DisplayPerson extends IPerson {
  person: IPerson
  fullName: string
}
