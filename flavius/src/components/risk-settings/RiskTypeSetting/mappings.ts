import RiskCatalog from 'models/RiskCatalog'
import UI_STRINGS from 'util/ui-strings'
import { RiskCategoryType } from 'types/common'
import { DisplayRiskCategory, DisplayRiskType } from './RiskTypeSetting'

export const mapRiskCategoryLabel = (riskCategory: string): string => {
  switch (riskCategory) {
    case RiskCategoryType.SHARING_RISKS:
      return UI_STRINGS.DASHBOARD.SHARING_RISKS
    case RiskCategoryType.RELATIONSHIP_RISKS:
      return UI_STRINGS.DASHBOARD.RELATIONSHIP_RISKS
    case RiskCategoryType.ACTIVITY_RISKS:
      return UI_STRINGS.DASHBOARD.ACTIVITY_RISKS
    case RiskCategoryType.INFORMATIONAL_RISKS:
      return UI_STRINGS.DASHBOARD.INFORMATIONAL_RISKS
    default:
      return ''
  }
}

export const mapRiskCategoryOrder = (riskCategory: string): number => {
  switch (riskCategory) {
    case RiskCategoryType.SHARING_RISKS:
      return 1 // risks with riskTypeId in the range 1XXX
    case RiskCategoryType.RELATIONSHIP_RISKS:
      return 2 // risks with riskTypeId in the range 2XXX
    case RiskCategoryType.ACTIVITY_RISKS:
      return 3 // risks with riskTypeId in the range 3XXX
    case RiskCategoryType.INFORMATIONAL_RISKS:
      return 4 // risks with riskTypeId in the range 0XXX
    default:
      return -1
  }
}

export const mapRiskTypeSeverity = (riskTypeId: string): SeverityRange => {
  const riskType = Object.values(RiskCatalog).find((risk) => risk.index === Number(riskTypeId))

  return riskType && riskType.severity ? riskType.severity : 0
}

export const mapRiskTypeLabel = (riskTypeId: string): string => {
  const riskType = Object.values(RiskCatalog).find((risk) => risk.index === Number(riskTypeId))

  return riskType ? riskType.name : ''
}

const mapRiskTypeEnabled = (riskType: RiskType, useNonConfigurableRiskTypes: boolean) => {
  if (useNonConfigurableRiskTypes && tempNonConfigurableRiskTypes.includes(riskType.riskTypeId.toString())) {
    return false
  } else {
    return riskType.enabled
  }
}

const mapRiskTypeConfigurable = (riskType: RiskType, useNonConfigurableRiskTypes: boolean) => {
  if (useNonConfigurableRiskTypes && tempNonConfigurableRiskTypes.includes(riskType.riskTypeId.toString())) {
    return false
  } else {
    return riskType.configurable
  }
}

// currently, the backend is yet to support all externally owned risk types to be configurable
// this is a temp solution to hide/disable these risk types on the UI to prevent user from configuring them
const tempNonConfigurableRiskTypes: string[] = ['1023', '1013', '1022', '2003', '2002']

export const mapRiskCategories = (data: RiskCategory[], useNonConfigurableRiskTypes: boolean): DisplayRiskCategory[] =>
  data
    .map((riskCategory: RiskCategory) => ({
      label: mapRiskCategoryLabel(riskCategory.category),
      order: mapRiskCategoryOrder(riskCategory.category),
      category: riskCategory.category,
      riskTypes: riskCategory.riskTypes
        .map((riskType: RiskType) => ({
          riskTypeId: riskType.riskTypeId,
          enabled: mapRiskTypeEnabled(riskType, useNonConfigurableRiskTypes),
          configurable: mapRiskTypeConfigurable(riskType, useNonConfigurableRiskTypes),
          description: mapRiskTypeLabel(riskType.riskTypeId.toString()),
          severity: mapRiskTypeSeverity(riskType.riskTypeId.toString())
        }))
        .filter((riskType: DisplayRiskType) => (useNonConfigurableRiskTypes ? true : riskType.configurable === true))
        .sort((a, b) => b.severity - a.severity)
    }))
    .sort((a, b) => a.order - b.order)

export const mergeRiskCategories = (
  prev: DisplayRiskCategory[],
  updated: DisplayRiskCategory[]
): DisplayRiskCategory[] =>
  prev.map((item) => {
    const matchingCategory = updated.find(({ category }) => category === item.category)
    if (matchingCategory) {
      const { riskTypes } = matchingCategory

      return {
        ...matchingCategory,
        riskTypes: item.riskTypes.map((riskType) => {
          const matchingRiskType = riskTypes.find(({ riskTypeId }) => riskTypeId === riskType.riskTypeId)
          return matchingRiskType ?? riskType
        })
      }
    } else {
      return item
    }
  })
