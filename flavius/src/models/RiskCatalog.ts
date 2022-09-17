import { HELP_STRINGS } from 'util/help-strings'

export interface RiskCatalogMember {
  index: RiskTypeId
  name: string
  shortName: string
  severity?: SeverityRange
}

export interface RiskCatalogType {
  [x: string]: RiskCatalogMember
}

const RiskCatalog: RiskCatalogType = {
  // Informative: 0XXX
  TopSharedFilesCompanyOwned: {
    index: 0,
    name: HELP_STRINGS.RISK_CATALOG.RISK_0_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_0_SHORT,
    severity: 5
  },
  TopSharedFilesNonCompanyOwned: {
    index: 10,
    name: HELP_STRINGS.RISK_CATALOG.RISK_10_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_10_SHORT,
    severity: 5
  },
  MostAccessFilesNonEmployee: {
    index: 11,
    name: HELP_STRINGS.RISK_CATALOG.RISK_11_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_11_SHORT,
    severity: 5
  },
  // File setting issues: 1XXX
  SensitiveFileSharedByLinkInternal: {
    index: 1011,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1011_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1011_SHORT,
    severity: 5
  },
  SensitiveFileSharedByLinkInternalNonCustomerOwned: {
    index: 1013,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1013_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1013_SHORT,
    severity: 5
  },
  FileSharedByLinkExternal: {
    index: 1020,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1020_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1020_SHORT,
    severity: 8
  },
  SensitiveFileSharedByLinkExternal: {
    index: 1021,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1021_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1021_SHORT,
    severity: 8
  },
  FileSharedByLinkExternalNonCustomerOwned: {
    index: 1022,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1022_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1022_SHORT,
    severity: 4
  },
  SensitiveFileSharedByLinkExternalNonCustomerOwned: {
    index: 1023,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1023_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1023_SHORT,
    severity: 6
  },
  FileSharedByLinkExternalDate: {
    index: 1050,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1050_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1050_SHORT,
    severity: 8
  },
  SensitiveFileSharedByLinkExternalDate: {
    index: 1051,
    name: HELP_STRINGS.RISK_CATALOG.RISK_1051_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_1051_SHORT,
    severity: 9
  },

  // Relationships: 2XXX
  FileSharedToPersonalEmail: {
    index: 2000,
    name: HELP_STRINGS.RISK_CATALOG.RISK_2000_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_2000_SHORT,
    severity: 5
  },
  SensitiveFileSharedToPersonalEmail: {
    index: 2001,
    name: HELP_STRINGS.RISK_CATALOG.RISK_2001_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_2001_SHORT,
    severity: 8
  },
  FileSharedToPersonalEmailNonCustomerOwned: {
    index: 2002,
    name: HELP_STRINGS.RISK_CATALOG.RISK_2002_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_2002_SHORT,
    severity: 5
  },
  SensitiveFileSharedToPersonalEmailNonCustomerOwned: {
    index: 2003,
    name: HELP_STRINGS.RISK_CATALOG.RISK_2003_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_2003_SHORT,
    severity: 8
  },
  FileSharedToPersonalEmailDate: {
    index: 2010,
    name: HELP_STRINGS.RISK_CATALOG.RISK_2010_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_2010_SHORT,
    severity: 6
  },
  SensitiveFileSharedToPersonalEmailDate: {
    index: 2011,
    name: HELP_STRINGS.RISK_CATALOG.RISK_2011_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_2011_SHORT,
    severity: 9
  },

  // Actions: 3XXX
  ManyDownloadsByApp: {
    index: 3010,
    name: HELP_STRINGS.RISK_CATALOG.RISK_3010_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_3010_SHORT,
    severity: 5
  },
  ManyDownloadsByAppNonCustomerOwned: {
    index: 3012,
    name: HELP_STRINGS.RISK_CATALOG.RISK_3012_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_3012_SHORT,
    severity: 5
  },
  ManyDownloadsByPersonInternal: {
    index: 3100,
    name: HELP_STRINGS.RISK_CATALOG.RISK_3100_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_3100_SHORT,
    severity: 6
  },
  ManyDownloadsByPersonExternal: {
    index: 3200,
    name: HELP_STRINGS.RISK_CATALOG.RISK_3200_NAME,
    shortName: HELP_STRINGS.RISK_CATALOG.RISK_3200_SHORT,
    severity: 7
  }
}

const filterRiskTypeIds = (lowerBound: number): number[] =>
  Object.keys(RiskCatalog)
    .filter((key) => RiskCatalog[key].index >= lowerBound && RiskCatalog[key].index < lowerBound + 1000)
    .map((key) => RiskCatalog[key].index)

export const InformationalRiskTypeIds = filterRiskTypeIds(0)

export const SharingRiskTypeIds = filterRiskTypeIds(1000)

export const RelationshipRiskTypeIds = filterRiskTypeIds(2000)

export const ActivityRiskTypeIds = filterRiskTypeIds(3000)

export default RiskCatalog
