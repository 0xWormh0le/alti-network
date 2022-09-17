import UI_STRINGS from 'util/ui-strings'

export interface RiskCatalogMember {
  index: RiskTypeId
  name: string
  shortName: string
}

export interface RiskCatalogType {
  [x: string]: RiskCatalogMember
}

const RiskCatalog: RiskCatalogType = {
  // Informative: 0XXX
  TopSharedFilesCompanyOwned: {
    index: 0,
    name: UI_STRINGS.RISK_CATALOG.RISK_0_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_0_SHORT
  },
  TopSharedFilesNonCompanyOwned: {
    index: 10,
    name: UI_STRINGS.RISK_CATALOG.RISK_10_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_10_SHORT
  },
  // File setting issues: 1XXX
  SensitiveFileSharedByLinkInternal: {
    index: 1011,
    name: UI_STRINGS.RISK_CATALOG.RISK_1011_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1011_SHORT
  },
  SensitiveFileSharedByLinkInternalNonCustomerOwned: {
    index: 1013,
    name: UI_STRINGS.RISK_CATALOG.RISK_1013_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1013_SHORT
  },
  FileSharedByLinkExternal: {
    index: 1020,
    name: UI_STRINGS.RISK_CATALOG.RISK_1020_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1020_SHORT
  },
  SensitiveFileSharedByLinkExternal: {
    index: 1021,
    name: UI_STRINGS.RISK_CATALOG.RISK_1021_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1021_SHORT
  },
  FileSharedByLinkExternalNonCustomerOwned: {
    index: 1022,
    name: UI_STRINGS.RISK_CATALOG.RISK_1022_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1022_SHORT
  },
  SensitiveFileSharedByLinkExternalNonCustomerOwned: {
    index: 1023,
    name: UI_STRINGS.RISK_CATALOG.RISK_1023_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1023_SHORT
  },
  FileSharedByLinkExternalDate: {
    index: 1050,
    name: UI_STRINGS.RISK_CATALOG.RISK_1050_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1050_SHORT
  },
  SensitiveFileSharedByLinkExternalDate: {
    index: 1051,
    name: UI_STRINGS.RISK_CATALOG.RISK_1051_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_1051_SHORT
  },

  // Relationships: 2XXX
  FileSharedToPersonalEmail: {
    index: 2000,
    name: UI_STRINGS.RISK_CATALOG.RISK_2000_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_2000_SHORT
  },
  SensitiveFileSharedToPersonalEmail: {
    index: 2001,
    name: UI_STRINGS.RISK_CATALOG.RISK_2001_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_2001_SHORT
  },
  FileSharedToPersonalEmailNonCustomerOwned: {
    index: 2002,
    name: UI_STRINGS.RISK_CATALOG.RISK_2002_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_2002_SHORT
  },
  SensitiveFileSharedToPersonalEmailNonCustomerOwned: {
    index: 2003,
    name: UI_STRINGS.RISK_CATALOG.RISK_2003_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_2003_SHORT
  },
  FileSharedToPersonalEmailDate: {
    index: 2010,
    name: UI_STRINGS.RISK_CATALOG.RISK_2010_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_2010_SHORT
  },
  SensitiveFileSharedToPersonalEmailDate: {
    index: 2011,
    name: UI_STRINGS.RISK_CATALOG.RISK_2011_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_2011_SHORT
  },

  // Actions: 3XXX
  ManyDownloadsByPersonInternal: {
    index: 3100,
    name: UI_STRINGS.RISK_CATALOG.RISK_3100_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_3100_SHORT
  },
  ManyDownloadsByPersonExternal: {
    index: 3200,
    name: UI_STRINGS.RISK_CATALOG.RISK_3200_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_3200_SHORT
  },
  ManyDownloadsByApp: {
    index: 3010,
    name: UI_STRINGS.RISK_CATALOG.RISK_3010_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_3010_SHORT
  },
  ManyDownloadsByAppNonCustomerOwned: {
    index: 3012,
    name: UI_STRINGS.RISK_CATALOG.RISK_3012_NAME,
    shortName: UI_STRINGS.RISK_CATALOG.RISK_3012_SHORT
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
