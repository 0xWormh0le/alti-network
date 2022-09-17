import { DisplayRiskCategory, DisplayRiskType } from './RiskTypeSetting'

// check if at least one riskType in the riskCategory is checked
export const isRiskCategoryPartiallyEnabled = (riskCategory: DisplayRiskCategory) =>
  riskCategory.riskTypes.some((riskType) => (riskType.configurable ? riskType.enabled : false))

export const isRiskCategoryEnabled = (riskCategoy: DisplayRiskCategory) =>
  riskCategoy.riskTypes.every((riskType) => (riskType.configurable ? riskType.enabled : true))

export const isRiskCategoryConfigurable = (riskCategory: DisplayRiskCategory) =>
  riskCategory.riskTypes.some((riskType: DisplayRiskType) => riskType.configurable)

// check if no risk type in any risk category is enabled
export const noRiskCategoryEnabled = (riskCategories: DisplayRiskCategory[]) =>
  riskCategories.length > 0 &&
  riskCategories.every((riskCategory) => isRiskCategoryPartiallyEnabled(riskCategory) === false)
