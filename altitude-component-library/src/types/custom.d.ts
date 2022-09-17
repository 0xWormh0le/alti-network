declare module 'react-chartist'
declare module 'react-router-modal'
declare module 'react-bookmark'
declare module 'react-google-login'
declare module 'react-resize-aware'
declare module 'aws-amplify-react'
declare module 'babel-plugin-require-context-hook/register'
declare module 'react-url-query'

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

interface OtherEmail {
  email: string
  accessCount: number
  riskCount: number
  internal: boolean
  permissionsLastDeleted?: string | null
}

interface IPerson {
  personId: string
  firstName: string
  lastName: string
  email: string
  avatar: string
  accessCount: number
  riskCount: number
  internal: boolean
  anonymous?: boolean
  internalEmailCount: number
  externalEmailCount: number
  otherEmails: OtherEmail[]
  title?: string
  department?: string
  phoneNumber?: string
  permissionsLastDeleted?: string | null
}

interface DisplayRiskDescription {
  text: string
  email?: string
  riskId: string
  riskTypeId: number
  pluginId: string
  pluginName: string
  personId?: string
}

interface ISensitive {
  riskId: string
  riskTypeId: number
  fileCount: number
  sensitivePhrases: Object<ISensitivePhrase>
}

interface ISensitiveObject extends ISensitivePhrase {
  ccNum: number
  sensitiveKeywords: List<sensitiveObjectKeywordDetail>
  ssn: number
}

interface IPhrase {
  count: number
  keyword: string
}

interface sensitiveObjectKeywordDetail {
  keyword: string
  count: number
}

interface SensitivePhrase {
  id?: number
  phrase: string
  exact: boolean
}

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
