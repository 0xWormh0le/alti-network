interface RiskTypeBase {
  riskTypeId: RiskTypeId | string
}

interface SlackNotificationsPost {
  'platform-id': string
  categories: RiskCategoryPost[]
}

interface RiskCategoryPost extends RiskCategoryBase {
  enable?: boolean
  riskTypes: RiskTypePost[]
}

interface RiskType extends RiskTypeBase {
  enabled: boolean
  configurable: boolean
}

interface RiskCategoryBase {
  category: RiskCategoryType
}

interface RiskTypeSettingTitle {
  editMode: string
  nothingEnabled: string
  normal: string
}

interface RiskCategory extends RiskCategoryBase {
  riskTypes: RiskType[]
}

interface RiskTypePost extends RiskTypeBase {
  enabled: boolean
}

interface RiskCategoryPost extends RiskCategoryBase {
  enable?: boolean
  riskTypes: RiskTypePost[]
}

interface RiskTypeStatus {
  riskTypeStatus: RiskCategory[]
}

interface RiskTypeStatusResponse {
  settings: RiskTypeStatus
}

interface RiskTypeStatusPost {
  settingValue: {
    categories: RiskCategoryPost[]
  }
}
