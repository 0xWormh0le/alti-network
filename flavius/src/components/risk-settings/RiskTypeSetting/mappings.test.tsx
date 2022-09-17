import { HELP_STRINGS } from 'util/help-strings'
import UI_STRINGS from 'util/ui-strings'
import {
  mapRiskCategoryLabel,
  mapRiskCategoryOrder,
  mapRiskTypeSeverity,
  mapRiskTypeLabel,
  mapRiskCategories,
  mergeRiskCategories
} from './mappings'
import { RiskCategoryType } from 'types/common'
import { DisplayRiskCategory } from './RiskTypeSetting'

const notificationsMock: RiskCategory[] = [
  {
    category: 'Sharings',
    riskTypes: [
      { configurable: true, enabled: true, riskTypeId: '1011' },
      { configurable: true, enabled: false, riskTypeId: '1013' },
      { configurable: true, enabled: true, riskTypeId: '1020' },
      { configurable: true, enabled: true, riskTypeId: '1021' },
      { configurable: true, enabled: false, riskTypeId: '1022' },
      { configurable: true, enabled: false, riskTypeId: '1023' }
    ]
  },
  {
    category: 'Relationships',
    riskTypes: [
      { configurable: true, enabled: true, riskTypeId: '2000' },
      { configurable: true, enabled: true, riskTypeId: '2001' },
      { configurable: true, enabled: false, riskTypeId: '2002' },
      { configurable: true, enabled: false, riskTypeId: '2003' }
    ]
  },
  {
    category: 'Actions',
    riskTypes: [
      { configurable: false, enabled: false, riskTypeId: '3010' },
      { configurable: false, enabled: false, riskTypeId: '3012' },
      { configurable: false, enabled: false, riskTypeId: '3100' },
      { configurable: false, enabled: false, riskTypeId: '3200' }
    ]
  },
  {
    category: 'Informatives',
    riskTypes: [
      { configurable: false, enabled: false, riskTypeId: '0000' },
      { configurable: false, enabled: false, riskTypeId: '0010' },
      { configurable: false, enabled: false, riskTypeId: '0011' }
    ]
  }
]

const responseCategory: RiskCategory[] = [
  {
    category: 'Sharings',
    riskTypes: [
      { configurable: true, enabled: true, riskTypeId: '1011' },
      { configurable: true, enabled: false, riskTypeId: '1013' },
      { configurable: true, enabled: false, riskTypeId: '1020' },
      { configurable: true, enabled: true, riskTypeId: '1021' },
      { configurable: true, enabled: false, riskTypeId: '1022' },
      { configurable: true, enabled: false, riskTypeId: '1023' }
    ]
  },
  {
    category: 'Relationships',
    riskTypes: [
      { configurable: true, enabled: true, riskTypeId: '2000' },
      { configurable: true, enabled: false, riskTypeId: '2001' },
      { configurable: true, enabled: false, riskTypeId: '2002' },
      { configurable: true, enabled: false, riskTypeId: '2003' }
    ]
  },
  {
    category: 'Actions',
    riskTypes: [
      { configurable: false, enabled: false, riskTypeId: '3010' },
      { configurable: false, enabled: false, riskTypeId: '3012' },
      { configurable: false, enabled: false, riskTypeId: '3100' },
      { configurable: false, enabled: false, riskTypeId: '3200' }
    ]
  },
  {
    category: 'Informatives',
    riskTypes: [
      { configurable: false, enabled: false, riskTypeId: '0000' },
      { configurable: false, enabled: false, riskTypeId: '0010' },
      { configurable: false, enabled: false, riskTypeId: '0011' }
    ]
  }
]

const displayRiskCategory: DisplayRiskCategory[] = [
  {
    label: 'Sharing Risks',
    order: 1,
    category: RiskCategoryType.SHARING_RISKS,
    riskTypes: [
      {
        riskTypeId: '1020',
        enabled: true,
        configurable: true,
        description: 'File Shared by Link Externally - Company Owned',
        severity: 8
      },
      {
        riskTypeId: '1021',
        enabled: true,
        configurable: true,
        description: 'Potentially Sensitive File Shared by Link Externally - Company Owned',
        severity: 8
      },
      {
        riskTypeId: '1023',
        enabled: false,
        configurable: false,
        description: 'Potentially Sensitive File Shared by Link Externally - Externally Owned',
        severity: 6
      },
      {
        riskTypeId: '1011',
        enabled: true,
        configurable: true,
        description: 'Potentially Sensitive File Shared by Link Internally - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '1013',
        enabled: false,
        configurable: false,
        description: 'Potentially Sensitive File Shared by Link Internally - Externally Owned',
        severity: 5
      },
      {
        riskTypeId: '1022',
        enabled: false,
        configurable: false,
        description: 'File Shared by Link Externally - Externally Owned',
        severity: 4
      }
    ]
  },
  {
    label: 'Relationship Risks',
    order: 2,
    category: RiskCategoryType.RELATIONSHIP_RISKS,
    riskTypes: [
      {
        riskTypeId: '2001',
        enabled: true,
        configurable: true,
        description: 'Potentially Sensitive File Shared to Personal Email Account - Company Owned',
        severity: 8
      },
      {
        riskTypeId: '2003',
        enabled: false,
        configurable: false,
        description: 'Potentially Sensitive File Shared to Personal Email Account - Externally Owned',
        severity: 8
      },
      {
        riskTypeId: '2000',
        enabled: true,
        configurable: true,
        description: 'File Shared to Personal Email Account - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '2002',
        enabled: false,
        configurable: false,
        description: 'File Shared to Personal Email Account - Externally Owned',
        severity: 5
      }
    ]
  },
  {
    label: 'Activity Risks',
    order: 3,
    category: RiskCategoryType.ACTIVITY_RISKS,
    riskTypes: [
      {
        riskTypeId: '3200',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by External Account',
        severity: 7
      },
      {
        riskTypeId: '3100',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by Internal Account',
        severity: 6
      },
      {
        riskTypeId: '3010',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by Authorized App - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '3012',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by Authorized App - Externally Owned',
        severity: 5
      }
    ]
  },
  {
    label: 'Informational Risks',
    order: 4,
    category: RiskCategoryType.INFORMATIONAL_RISKS,
    riskTypes: [
      {
        riskTypeId: '0000',
        enabled: false,
        configurable: false,
        description: 'Most Shared Files - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '0010',
        enabled: false,
        configurable: false,
        description: 'Most Shared Files - Externally Owned',
        severity: 5
      },
      {
        riskTypeId: '0011',
        enabled: false,
        configurable: false,
        description: 'Most Accessed Files by Non-Employee',
        severity: 5
      }
    ]
  }
]

const newDisplayRiskCategory: DisplayRiskCategory[] = [
  {
    label: 'Sharing Risks',
    order: 1,
    category: RiskCategoryType.SHARING_RISKS,
    riskTypes: [
      {
        riskTypeId: '1020',
        enabled: false,
        configurable: true,
        description: 'File Shared by Link Externally - Company Owned',
        severity: 8
      },
      {
        riskTypeId: '1021',
        enabled: true,
        configurable: true,
        description: 'Potentially Sensitive File Shared by Link Externally - Company Owned',
        severity: 8
      },
      {
        riskTypeId: '1023',
        enabled: false,
        configurable: false,
        description: 'Potentially Sensitive File Shared by Link Externally - Externally Owned',
        severity: 6
      },
      {
        riskTypeId: '1011',
        enabled: true,
        configurable: true,
        description: 'Potentially Sensitive File Shared by Link Internally - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '1013',
        enabled: false,
        configurable: false,
        description: 'Potentially Sensitive File Shared by Link Internally - Externally Owned',
        severity: 5
      },
      {
        riskTypeId: '1022',
        enabled: false,
        configurable: false,
        description: 'File Shared by Link Externally - Externally Owned',
        severity: 4
      }
    ]
  },
  {
    label: 'Relationship Risks',
    order: 2,
    category: RiskCategoryType.RELATIONSHIP_RISKS,
    riskTypes: [
      {
        riskTypeId: '2001',
        enabled: false,
        configurable: true,
        description: 'Potentially Sensitive File Shared to Personal Email Account - Company Owned',
        severity: 8
      },
      {
        riskTypeId: '2003',
        enabled: false,
        configurable: false,
        description: 'Potentially Sensitive File Shared to Personal Email Account - Externally Owned',
        severity: 8
      },
      {
        riskTypeId: '2000',
        enabled: true,
        configurable: true,
        description: 'File Shared to Personal Email Account - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '2002',
        enabled: false,
        configurable: false,
        description: 'File Shared to Personal Email Account - Externally Owned',
        severity: 5
      }
    ]
  },
  {
    label: 'Activity Risks',
    order: 3,
    category: RiskCategoryType.ACTIVITY_RISKS,
    riskTypes: [
      {
        riskTypeId: '3200',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by External Account',
        severity: 7
      },
      {
        riskTypeId: '3100',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by Internal Account',
        severity: 6
      },
      {
        riskTypeId: '3010',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by Authorized App - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '3012',
        enabled: false,
        configurable: false,
        description: 'Many Files Downloaded in 24 hours by Authorized App - Externally Owned',
        severity: 5
      }
    ]
  },
  {
    label: 'Informational Risks',
    order: 4,
    category: RiskCategoryType.INFORMATIONAL_RISKS,
    riskTypes: [
      {
        riskTypeId: '0000',
        enabled: false,
        configurable: false,
        description: 'Most Shared Files - Company Owned',
        severity: 5
      },
      {
        riskTypeId: '0010',
        enabled: false,
        configurable: false,
        description: 'Most Shared Files - Externally Owned',
        severity: 5
      },
      {
        riskTypeId: '0011',
        enabled: false,
        configurable: false,
        description: 'Most Accessed Files by Non-Employee',
        severity: 5
      }
    ]
  }
]

describe('SlackNotifications Mappings', () => {
  it('should map label to risk category', () => {
    expect(mapRiskCategoryLabel(RiskCategoryType.SHARING_RISKS)).toBe(UI_STRINGS.DASHBOARD.SHARING_RISKS)
    expect(mapRiskCategoryLabel(RiskCategoryType.RELATIONSHIP_RISKS)).toBe(UI_STRINGS.DASHBOARD.RELATIONSHIP_RISKS)
    expect(mapRiskCategoryLabel(RiskCategoryType.ACTIVITY_RISKS)).toBe(UI_STRINGS.DASHBOARD.ACTIVITY_RISKS)
    expect(mapRiskCategoryLabel(RiskCategoryType.INFORMATIONAL_RISKS)).toBe(UI_STRINGS.DASHBOARD.INFORMATIONAL_RISKS)
  })

  it('should map order to risk category', () => {
    expect(mapRiskCategoryOrder(RiskCategoryType.SHARING_RISKS)).toBe(1)
    expect(mapRiskCategoryOrder(RiskCategoryType.RELATIONSHIP_RISKS)).toBe(2)
    expect(mapRiskCategoryOrder(RiskCategoryType.ACTIVITY_RISKS)).toBe(3)
    expect(mapRiskCategoryOrder(RiskCategoryType.INFORMATIONAL_RISKS)).toBe(4)
  })

  it('should map severity to risk type', () => {
    expect(mapRiskTypeSeverity('1020')).toBe(8)
    expect(mapRiskTypeSeverity('3200')).toBe(7)
  })

  it('should map label to risk type', () => {
    expect(mapRiskTypeLabel('1020')).toBe(HELP_STRINGS.RISK_CATALOG.RISK_1020_NAME)
    expect(mapRiskTypeLabel('3200')).toBe(HELP_STRINGS.RISK_CATALOG.RISK_3200_NAME)
  })

  it('should map risk categories data', () => {
    expect(mapRiskCategories(notificationsMock, true)).toMatchObject(displayRiskCategory)
  })

  it('should merged map risk categories data', () => {
    expect(mergeRiskCategories(displayRiskCategory, mapRiskCategories(responseCategory, true))).toMatchObject(
      newDisplayRiskCategory
    )
  })
})
