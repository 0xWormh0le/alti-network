declare module 'react-chartist'
declare module 'react-router-modal'
declare module 'react-bookmark'
declare module 'react-google-login'
declare module 'aws-amplify-react'
declare module 'babel-plugin-require-context-hook/register'

type RiskThresholdActorType = 'internal' | 'external'

type Exposure = 'internal' | 'external' | 'unknown' | 'none'

type LinkVisibility = Exposure | 'user' | 'group' | 'internal_discoverable' | 'external_discoverable' | 'sensitive'

type PasswordScore = 0 | 1 | 2 | 3 | 4

type WrapperTypeOptions = 'page' | 'modal'

type GoogleAuthResponse = GoogleLoginResponse | GoogleLoginResponseOffline

type SubNavType =
  | 'allActivity'
  | 'atRiskFilesOwned'
  | 'collaborators'
  | 'appDownloads'
  | 'personDownloads'
  | 'filesAccessible'
  | 'filesSharedBy'
  | 'filesSharedWith'
  | 'risks'
  | 'risksCreated'

type AppSpotlightSubNavType = 'authorizedBy' | 'fileDownloads' | 'associatedRisks'

interface PersonStatistics {
  labels: number[]
  series: {
    [key in SubNavType]: number[]
  }
  stats: {
    [key in SubNavType]: number
  }
}

interface SvgProps {
  className: string
  alt?: string
  text?: string
  onClick?: (...args: any[]) => void
}

interface UserAttributes {
  email: string
  email_verified: boolean
  name: string
  phoneNumber: string
  phoneNumber_verified: boolean
  sub: string
  'custom:is_trial'?: boolean
}

interface AuthenticatedUser {
  attributes: UserAttributes
  id: string
  username: string
}

interface GoogleAuthenticatedUser {
  email: string
  id: string
  name: string
}

interface SettingsUser {
  attributes: UserAttributes
  username: string
  preferredMFA: string
}

interface Name {
  givenName: string
  familyName: string
  fullName: string
}
interface Avatar {
  url: string
  url_etag: string
}

interface Phone {
  number: string
  kind: UsageKind
  primary: boolean
}

interface Notes {
  content: string
  content_type: string
}

interface Email {
  address?: string
  kind: UsageKind
  primary: boolean
  accessCount: number
  riskCount: number
  lastDeletedPermissions: number
}

interface UserId {
  platform: string
  value: string
}
interface IPerson {
  accessLevel: AccessLevel
  name?: Name
  primaryEmail: Email
  projectId: string
  userKind: UserKind
  altnetId?: string
  externalCount?: number
  recoveryEmail?: Email
  phones?: Phone[]
  externalIds?: UserId[]
  avatar?: Avatar
  accessCount?: number
  riskCount?: number
  internal?: boolean // deprecated thanks to userKind
  anonymous?: boolean
  internalCount?: number
  emails?: Email[]
  orgUnitPath?: string
  isEnrolledInMFA?: boolean
  etag?: string
  creationTime?: number
  lastLoginTime?: number
  lastModifiedTime?: number
  notes?: Notes
  lastRemovedPermissions?: number | null
  title?: string
  department?: string
  phoneNumber?: string
}

interface DisplayRiskDescription {
  text: string
  email?: string
  riskId: string
  riskTypeId: RiskTypeId
  pluginId: string
  pluginName: string
  personId?: string
  platformId: string
  incidentDate?: Maybe<number>
}

interface ISensitive {
  fileCount: number
  riskId: string
  riskTypeId: number
}

interface SensitiveMultiFile extends ISensitive {
  sensitivePhrases?: SensitivePhraseMultiFile
}

interface SensitiveSingleFile extends ISensitive {
  sensitivePhrases?: SensitivePhraseSingleFile
}

interface SensitivePhraseMultiFile {
  ccNumFileCount: number
  sensitiveKeywordsFileCount: number
  ssnFileCount: number
  sensitiveKeywords: undefined
}

interface SensitivePhraseSingleFile {
  ccNum: number
  sensitiveKeywordsFileCount: undefined
  sensitiveKeywords: SensitiveObjectKeywordDetail[] | IValue<{ [k: number]: SensitiveObjectKeywordDetail }>
  ssn: number
}

interface IPhrase {
  count: number
  keyword: string
}

interface SensitiveObjectKeywordDetail {
  keyword: string
  count: number
}

interface SensitivePhrase {
  id?: string
  phrase: string
  exact: boolean
}

type SensitivePhrasesResponse = ServerResponseData<{
  sensitivePhrases: SensitivePhrase[]
}>

interface RiskInsight {
  file?: IFile
  person?: IPerson
  count: number
}

interface Application {
  name: string
  id: string
  marketplaceURI: string
  imageURI: string
  grants: string[]
  appId?: string
}

interface ResolutionStatus {
  active: number
  completed: number
  failed: number
  pending: number
  totalCount: number
}

type IMap<T> = {
  get: (x: keyof T) => any
}

interface IValue<T> {
  get: (x: keyof T) => any
}

interface BasicPlatformData {
  platformId: string
  platformName: string
  canConnect: boolean
  resourcesLink?: string
}

interface CompanyInfo {
  domains: string[]
  name: string
}

type Maybe<T> = T | null

type PaginationMeta = {
  pageCount: number
  pageCountCacheTTL: number
  pageCountLastUpdated: number
  pageNumber: number
  pageSize: number
}

type ServerResponseData<T> = {
  orderBy: SortingOption
  sort: SortOrder
} & PaginationMeta &
  T

type Dictionary<T> = { [k: string]: T }

type Primitive = string | number | boolean | bigint

type ValidateFn = (value: string) => string | null
