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
  fileCount: number
  riskId: string
  createdBy?: IPerson
  sensitivePhrases?: Array<ISensitivePhrase>
  mimeType: string
}

interface FileCellWithRisk extends FileCell {
  riskTypeId: RiskTypeId
  sensitivePhrases: Array<ISensitivePhrase>
  email: string
  riskId: string
  riskTypeId: number
  pluginId?: string
  pluginName?: string
  personId?: string
  text?: string
  email?: string
  riskId?: string
  riskTypeId?: number
  personId?: string
}

interface DisplayPerson extends IPerson {
  person: IPerson
  fullName: string
}
