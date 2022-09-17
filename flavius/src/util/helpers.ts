import config from 'config'
import zxcvbn from 'zxcvbn'
import { Location } from 'history'
import fp from 'lodash/fp'
import validate from 'validate.js'
import moment from 'moment'
import RiskCatalog from 'models/RiskCatalog'
import { FileGridNavType, SensitiveContentStatus } from 'types/common'
import CONSTANTS from './constants'

const { TIME_DISPLAY_FORMAT } = CONSTANTS

const { navigationItemsNames } = config

const trimName = (name: string) => name.toLowerCase().replace(' ', '-')

const generateRoutePath = (label: string, params?: string[]) => {
  // convert to small caps, replace spaces with dashes, and add forward slash at the beginning
  const lowerCaseLabel = trimName(label)

  if (params && params.length > 0) {
    return `/${lowerCaseLabel}/:${params.join().replace(', ', '/:')}`
  }

  return `/${lowerCaseLabel}`
}

const navigationNamesCopy = { ...navigationItemsNames }

Object.keys(navigationNamesCopy).forEach((item) => {
  navigationNamesCopy[item] = generateRoutePath(navigationNamesCopy[item])
})
const routePathNames = navigationNamesCopy

// TODO: re-think about this method, right now it heavily depends on how we define the routes individually, it creates codes that hard to understand when we have params in the route
const modalBasePath = () => {
  const pathParts = window.location.pathname.split('/')
  const pathStart = pathParts.length > 0 ? `/${pathParts[1]}` : ''

  switch (pathStart) {
    case routePathNames.SEARCH:
      return routePathNames.SEARCH
    case routePathNames.RISKS:
      return routePathNames.RISKS
    case routePathNames.ACTIVITY:
      // the activity route has a param :platformId, we have to append it when switching to modal routes
      return `${routePathNames.ACTIVITY}/${pathParts[2]}`
    default:
      return routePathNames.DASHBOARD
  }
}

export const getRiskText = (_riskId: string) => {
  const riskId = _riskId ? parseInt(_riskId, 10) : 0
  const risk = Object.keys(RiskCatalog).find(
    (item: string) => RiskCatalog[item].hasOwnProperty('index') && RiskCatalog[item].index === riskId
  )
  if (risk) {
    let riskText
    riskText = RiskCatalog[risk].name.replace(/Many Files/, 'Files')
    riskText = riskText.replace(/24 hours/, 'the past 24 hours')
    return riskText
  }
  return 'Files associated with this risk'
}

const capitalize = (input: string) => {
  if (input.length > 0) {
    const output = input.toLowerCase().split('')
    output[0] = output[0].toUpperCase()
    return output.join('')
  }
  return input
}

export const camelCaseToDashCase = (str: string) => {
  if (!str) return ''
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

const camelCaseToTitleCase = (text: string): string => {
  const result = text.replace(/([A-Z])/g, ' $1')
  const finalResult = result.charAt(0) === ' ' ? result.slice(1) : result // in case the first letter is already an uppercase
  return finalResult.charAt(0).toUpperCase() + finalResult.slice(1)
}

const snakeCaseToTitleCase = (text: string): string =>
  text
    .split('_')
    .map((word) => {
      return word.slice(0, 1).toUpperCase() + word.slice(1)
    })
    .join(' ')

const ellipsify = (input: string, numberOfChars: number) => {
  if (!input) {
    return ''
  } else if (input.length > numberOfChars) {
    return input.substring(0, numberOfChars) + '…'
  } else {
    return input
  }
}

// converts query params for API
// e.g. { pageSize: 2000, pageCountCacheTTL: 3600 } to { 'page-size': 2000, 'page-count-cache-ttl': 3600,}
const createQueryStringParameters = (queryParams: QueryParams) => {
  return Object.keys(queryParams).reduce((queryAcc, nextParam) => {
    const val = queryParams[nextParam]
    if (val !== null) {
      queryAcc[camelCaseToDashCase(nextParam)] = Array.isArray(val) ? `${arrayToParam(val)}` : val
    }
    return queryAcc
  }, {})
}

export const getParamValue = (val: QueryParamValue) => {
  if (typeof val === 'string' || typeof val === 'number') return val.toString()
  return JSON.stringify(val)
}

export const queryToParamValue = <T extends QueryParamValue>(val: string): T => {
  try {
    return JSON.parse(val)
  } catch {
    // val is a normal string
    return val as T
  }
}

export const paramsToString = (params: QueryParams | undefined): string =>
  (params &&
    new URLSearchParams(
      Object.entries(params)
        // Filter out non-0 falsy values to avoid empty query param values
        .filter((entry) => entry[1] !== 0 && !!entry[1])
        .map(([entryKey, entryVal]) => [camelCaseToDashCase(entryKey), getParamValue(entryVal)])
    ).toString()) ||
  ''

const arrayToParam = (item: string | string[] | number | number[]) => {
  if (typeof item === 'string') {
    return item
      .split(',')
      .map((id) => {
        return "'" + id + "'"
      })
      .join(', ')
  } else if (typeof item === 'object') {
    return JSON.stringify(item)
  }
  return item
}

const checkPasswordStrength = (password: string): { valid: boolean; score: PasswordScore } => {
  // minimum length 10
  // must not be 'weak', based on zxcvbn library
  const score = zxcvbn(password).score
  const valid = password.length >= CONSTANTS.MIN_PASSWORD_LENGTH && score > 1

  return { valid, score }
}

const getRisk = (value: SeverityRange) => {
  return {
    veryhigh: value >= 10,
    high: value >= 8 && value < 10,
    medium: value >= 6 && value < 8,
    low: value >= 3 && value < 6,
    safe: value >= 0 && value < 3
  }
}

const getRiskLabel = (value: SeverityRange) => {
  if (value > 9) {
    return 'Very High'
  }
  if (value > 7) {
    return 'High'
  }
  if (value > 5 && value <= 7) {
    return 'Medium'
  }
  if (value > 2 && value <= 5) {
    return 'Low'
  }
  if (value > -1 && value <= 2) {
    return 'Safe'
  }
  throw new Error(`Cannot label risk with severity ${value}`)
}

/* This test needs to cover 2 cases: 
  1. Value comes in as an immutable object
  2. Value comes in as a straight object
  If the value comes in as a straight object and sensitivePhrases.hasOwnProperty('sensitiveKeywords'), it will be
  an array, so we need to check length instead of size
*/
export const hasSensitiveContent = (value: IValue<ISensitive> | IValue<IFile> | ISensitive | IFile) => {
  const sensitivePhrases = value.hasOwnProperty('get')
    ? value.hasOwnProperty('size')
      ? toJsArray(value as any, 'sensitivePhrases')
      : toJs(value as IValue<ISensitive>, 'sensitivePhrases')
    : (value as SensitiveSingleFile | SensitiveMultiFile).sensitivePhrases

  const doesHaveSensitiveContent =
    sensitivePhrases &&
    Object.entries(sensitivePhrases).some(([k, v]: [string, any]) => {
      if (k === 'sensitiveKeywords') {
        // Using Object.keys to bypass some griddle non-sense
        return v?.size > 0 || Object.keys(v).length > 0
      }
      return v !== 0
    })

  return doesHaveSensitiveContent
}

export const hasSensitiveContentSimple = (value?: SensitiveContentStatus) => {
  if (value === SensitiveContentStatus.DETECTION_PENDING) return false
  if (value === SensitiveContentStatus.FOUND_NO_SENSITIVE_CONTENT) return false
  return true
}

export const formatSingleFileUrl = (
  owner: string | undefined,
  fileId: string,
  platformId: string,
  sensitive: boolean,
  defaultSelection?: FileGridNavType
) => {
  const modalParams = searchWithoutModalParams({}, ['sensitive'])
  const url = `${modalBasePath()}/file/${fileId}${modalParams}`

  let u = replaceUrlParam(url, 'owner', owner || '')
  u = replaceUrlParam(
    u,
    'selection',
    defaultSelection ? defaultSelection : sensitive ? FileGridNavType.SENSITIVE : FileGridNavType.TIMELINE
  )
  u = replaceUrlParam(u, 'platformId', platformId) // for GET /file endpoint, we will pass platformId
  if (sensitive) {
    u += '&sensitive=true'
  }
  return u
}

export const hasKeywords = (sensitivePhrases: any) => {
  return (
    (sensitivePhrases &&
      sensitivePhrases.hasOwnProperty('sensitiveKeywords') &&
      sensitivePhrases.sensitiveKeywords!.size > 0) ||
    sensitivePhrases.sensitiveKeywords!.length > 0
  )
}

export const getKeywords = (sensitivePhrases: SensitivePhraseSingleFile) => {
  const phrasesToMap: SensitiveObjectKeywordDetail[] = sensitivePhrases.sensitiveKeywords.hasOwnProperty('size')
    ? toJsArray(sensitivePhrases.sensitiveKeywords as any)
    : (sensitivePhrases.sensitiveKeywords as SensitiveObjectKeywordDetail[])

  let additional = 0
  const phrases: SensitiveObjectKeywordDetail[] = []
  if (phrasesToMap && phrasesToMap.length) {
    let total = 0
    phrasesToMap.forEach((item: IValue<SensitiveObjectKeywordDetail> | SensitiveObjectKeywordDetail) => {
      const phraseMap = item.hasOwnProperty('get') ? toJs(item as IValue<SensitiveObjectKeywordDetail>) : item

      total++
      if (total < 6) {
        const { count, keyword } = phraseMap
        phrases.push({
          count,
          keyword
        })
      } else {
        additional += phraseMap.count
      }
    })
  }
  return { phrases, additional }
}

const isMobileOrTablet = () => {
  const { userAgent } = window.navigator
  return /Mobile/i.test(userAgent) || /Android/i.test(userAgent)
}

interface IImmutable {
  get: (x: any) => any
}

export const toJsArray = (immutableArray: Map<number | string, any>, immutableString?: string | number) => {
  const target: Map<number, any> = immutableString ? immutableArray.get(immutableString) : immutableArray
  if (target.size) {
    return Array.from(target.entries()).reduce<any[]>((arr, [, entryV]) => {
      return [...arr, toJs(entryV)]
    }, [])
  }
  return target as unknown as any[]
}

export const toJs = (immutableObject: IImmutable, immutableString?: string | number) => {
  if (typeof immutableObject.get === 'undefined') {
    return immutableString && immutableObject.hasOwnProperty(immutableString)
      ? immutableObject[immutableString]
      : immutableObject
  }

  const immutableMap = (immutableString && immutableObject.get(immutableString)) || immutableObject
  const retval = {}
  if (immutableMap && typeof immutableMap.forEach === 'function') {
    immutableMap.forEach((value: any, key: any) => {
      retval[key] = value && typeof value.get === 'function' ? toJs(value) : value
    })
  }
  return retval
}

const modalRoutes = [
  '/spotlight/',
  '/file/',
  '/files/',
  '/folder/',
  '/people/',
  '/app-spotlight/',
  '/permissions/file/',
  '/resolve/'
]

const locationIsAModalRoute = (location: string) => modalRoutes.some((modalRoute) => location.includes(modalRoute))
const searchWithoutModalParams = (extraParams = {}, paramsToRemove: string[] = []) => {
  // This function removes modal-specific query params between routes. Passing other
  // params during modal navigation (navigating to or between modals) retains state,
  // which is desired. But the params for modal state cannot be passed between modals
  // since modal state should be reset on modal navigation.
  // `extraParams` is appended to the query string if provided.
  const searchString = window.location.search
  const finalString = searchString
    .replace(/[&?]modalPage=[0-9]+/g, '')
    .replace(/[&?]spotlightCard=[a-zA-z]+/g, '')
    .replace(/[&?]selectedEmail=[\w+.%]+/g, '')
    .replace(/[&?]breadcrumbPosition=[0-9]+/g, '')
    .replace(/[&?]selectedSubNavKey=[a-zA-z]+/g, '')
    .replace(/[&?]utm-source=([a-zA-Z'-]+)/g, '') // match parameters like &utm-source=risk-summary-email

  const queryParams = {
    ...parseQueryString(finalString),
    ...extraParams
  }

  paramsToRemove.forEach((p) => delete queryParams[p])
  delete queryParams[''] // cleansing empty param

  return jsonToQueryString(queryParams)
}

export const getExtraParamsByRiskTypeId = (riskTypeId: RiskTypeId) => {
  const isManyDownloadsByPerson =
    RiskCatalog.ManyDownloadsByPersonInternal.index === riskTypeId ||
    RiskCatalog.ManyDownloadsByPersonExternal.index === riskTypeId
  const extraParams = isManyDownloadsByPerson ? { selectedSubNavKey: 'personDownloads' } : {}
  return searchWithoutModalParams(extraParams)
}

const replaceUrlParam = (url: string, paramName: string, paramValue: string) => {
  if (paramValue == null) {
    paramValue = ''
  }
  const pattern = new RegExp('\\b(' + paramName + '=).*?(&|#|$)')
  if (url.search(pattern) >= 0) {
    return url.replace(pattern, '$1' + paramValue + '$2')
  }
  url = url.replace(/[?#]$/, '')
  return url + (url.indexOf('?') > 0 ? '&' : '?') + paramName + '=' + paramValue
}

const largeNumberDisplay = (n: number): string => {
  const LOWER_THRESHOLD = 10000
  const UPPER_THRESHOLD = 1000000

  if (n >= LOWER_THRESHOLD && n < UPPER_THRESHOLD) {
    return `${Math.floor(n / 1000)}k+`
  } else if (n >= UPPER_THRESHOLD) {
    return `${Math.floor(n / 1000000)}m+`
  }

  return n.toString()
}

const largeNumberWithPluralizedUnit = (largeNumber: number, unit: string) =>
  `${largeNumberDisplay(largeNumber)} ${pluralize(unit, largeNumber)}`

const singularize = (title: string) => title.slice(0, title.length - 1)

const pluralize = (txt: string, cnt: number) => {
  if (cnt === 1) {
    return txt
  }

  const plural = {
    '(quiz)$': '$1zes',
    '^(ox)$': '$1en',
    '([m|l])ouse$': '$1ice',
    '(matr|vert|ind)ix|ex$': '$1ices',
    '(x|ch|ss|sh)$': '$1es',
    '([^aeiouy]|qu)y$': '$1ies',
    '(hive)$': '$1s',
    '(?:([^f])fe|([lr])f)$': '$1$2ves',
    '(shea|lea|loa|thie)f$': '$1ves',
    sis$: 'ses',
    '([ti])um$': '$1a',
    '(tomat|potat|ech|her|vet)o$': '$1oes',
    '(bu)s$': '$1ses',
    '(alias)$': '$1es',
    '(octop)us$': '$1i',
    '(ax|test)is$': '$1es',
    '(us)$': '$1es',
    '([^s]+)$': '$1s'
  }

  const irregular = {
    move: 'moves',
    foot: 'feet',
    goose: 'geese',
    sex: 'sexes',
    child: 'children',
    man: 'men',
    tooth: 'teeth',
    person: 'people'
  }

  const uncountable = [
    'sheep',
    'fish',
    'deer',
    'moose',
    'series',
    'species',
    'money',
    'rice',
    'information',
    'equipment'
  ]

  // save some time in the case that singular and plural are the same
  if (uncountable.indexOf(txt.toLowerCase()) >= 0) {
    return txt
  }

  // check for irregular forms
  for (const word in irregular) {
    if (irregular.hasOwnProperty(word)) {
      const pattern = new RegExp(word + '$', 'i')
      const replace = irregular[word]

      if (pattern.test(txt)) {
        return txt.replace(pattern, replace)
      }
    }
  }

  const array = plural

  // check for matches using regular expressions
  for (const reg in array) {
    if (array.hasOwnProperty(reg)) {
      const ptn = new RegExp(reg, 'i')

      if (ptn.test(txt)) {
        return txt.replace(ptn, array[reg])
      }
    }
  }

  return txt
}

export const copyToClipboard = (txt: string) => {
  const element = document.createElement('textarea')
  element.value = txt
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  document.body.appendChild(element)
  element.select()
  document.execCommand('copy')
  document.body.removeChild(element)
}

export const truncateText = (txt: string, maxlen: number = 20) => {
  if (txt.length > maxlen) {
    return txt.substr(0, maxlen) + '...'
  }
  return txt
}

const addCSVColumn = (content?: string) => {
  return `${content || ''},`
}

export const isDemoEnv = ['demo', 'localdemo'].includes(process.env.REACT_APP_STAGE || '')
export const isDevEnv = ['dev'].includes(process.env.REACT_APP_STAGE || '')

export const getLoginRedirectPath = (location: Location<any>): string => {
  let nextPath = location.pathname
  if (location.search) {
    nextPath += location.search.replace('?', '&')
  }
  return `/login?nextPath=${nextPath}`
}

export const parseQueryString = (query: string): { [key: string]: string } =>
  fp.compose(
    JSON.parse,
    JSON.stringify,
    fp.reduce((acc: object, part: string) => {
      const [name, value] = part.split('=')
      acc[name] = decodeURIComponent(value || '')
      return acc
    }, {}),
    (str) => (str ? str.split('&') : []),
    fp.replace('?', '')
  )(query)

export const jsonToQueryString = (queryParams: { [key: string]: string | number | boolean }): string => {
  const pairs: string[] = []
  if (queryParams) {
    Object.keys(queryParams).forEach((key) => {
      if (queryParams[key] !== null && typeof queryParams[key] !== 'undefined') {
        const value = encodeURIComponent(queryParams[key].toString())
        if (value) {
          pairs.push(`${key}=${value}`)
        }
      }
    })
  }
  return pairs.length ? `?${pairs.join('&')}` : ''
}

export const isValidEmail = (input: string) => {
  const constraints = {
    from: {
      email: true
    }
  }

  // Undefined is returned if the email is valid
  return validate({ from: input }, constraints) === undefined
}

// tslint:disable-next-line no-empty

export const getEmailDomain = (email: string): string => email.replace(/.*@/, '')

export const isExternalEmail = (domains: string[] = [], creatorEmail: string): boolean => {
  return Boolean(creatorEmail) && !domains.includes(getEmailDomain(creatorEmail))
}

export const getFullName = ({ name }: { name: { givenName?: string; familyName?: string } }): string =>
  fp
    .reject((item) => !item)([name.givenName, name.familyName])
    .join(' ')

export const findMatches = (text: string, keyword: string): Array<[number, number]> => {
  const regex = new RegExp(keyword, 'gi')
  const matches: Array<[number, number]> = []
  let match = regex.exec(text)
  while (match !== null) {
    matches.push([match.index, match.index + keyword.length])
    match = regex.exec(text)
  }
  return matches
}

export const filterWithLimit = <T>(collection: T[], predicate: (item: T) => boolean, limit: number): T[] => {
  const results: T[] = []
  fp.forEach((item: T): boolean | undefined => {
    if (results.length === limit) {
      return false
    }
    if (predicate(item)) {
      results.push(item)
    }
    return undefined
  })(collection)
  return results
}

export const joinCSVCells = (cells: string | string[]): string => (Array.isArray(cells) ? cells.join() : cells)

export const printCSVdate = (unixTime: number, utc?: boolean) => DateUtils.unix(unixTime, utc)

export class DateUtils {
  static unix(unixTime: number, utc?: boolean) {
    if (utc) {
      return moment.unix(unixTime).utc().format(TIME_DISPLAY_FORMAT.COMMON_FORMAT_SHORT_DATE)
    }
    return moment.unix(unixTime).format(TIME_DISPLAY_FORMAT.COMMON_FORMAT_SHORT_DATE)
  }

  static getMoment(dateValue: number | string, utc: boolean = false) {
    const self = new DateUtils()
    return self._parsedDate(dateValue, utc)
  }

  _parsedDate(dateValue: number | string, utc: boolean) {
    let parsedDate
    if (isNumber(dateValue)) {
      parsedDate = utc ? moment.unix(dateValue as number).utc() : moment.unix(dateValue as number)
    } else {
      parsedDate = moment(dateValue)
    }
    return parsedDate
  }

  static now(format: string = TIME_DISPLAY_FORMAT.COMMON_FORMAT_SHORT_DATE) {
    return moment().format(format)
  }

  static timestamp(value?: string | number, utc?: boolean) {
    if (value) {
      return utc ? moment.utc(value).unix() : moment(value).unix()
    } else {
      return utc ? moment().utc().unix : moment().unix()
    }
  }

  static dateFormat(
    dateValue: string | number,
    format: string = TIME_DISPLAY_FORMAT.COMMON_FORMAT_SHORT_DATE,
    utc?: boolean
  ) {
    const self = new DateUtils()
    const _moment = self._parsedDate(dateValue, utc || false)
    return _moment.format(format)
  }
}

export const csvFileName = (fileName: string) => {
  return `${fileName}_${DateUtils.dateFormat(DateUtils.now(), 'DD-MM-YYYY_HH-mm-ss')}.csv`
}

export const isNumber = (value: any) => {
  return typeof value === 'number' && isFinite(value)
}

export const isValidDomain = (value: string) => {
  const regex = new RegExp(/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/g)
  return regex.test(value)
}

// only allows alphanumeric, hyphen, dash
export const isValidAppId = (value: string): boolean => {
  const regex = new RegExp(/^[a-z0-9_-]+$/i)
  return regex.test(value)
}

// only allows alphanumeric, hyphen, dash, space
export const isValidAppDesc = (value: string): boolean => {
  const regex = new RegExp(/^[a-z0-9_-\s]*$/i)
  return regex.test(value)
}

export {
  routePathNames,
  modalBasePath,
  trimName,
  generateRoutePath,
  createQueryStringParameters,
  arrayToParam,
  checkPasswordStrength,
  getRisk,
  getRiskLabel,
  capitalize,
  camelCaseToTitleCase,
  snakeCaseToTitleCase,
  ellipsify,
  isMobileOrTablet,
  modalRoutes,
  locationIsAModalRoute,
  searchWithoutModalParams,
  largeNumberDisplay,
  singularize,
  pluralize,
  largeNumberWithPluralizedUnit,
  addCSVColumn,
  replaceUrlParam
}

export function getQueryString(name: string) {
  const url = window.location.href
  name = name.replace(/[[]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

export const updateQueryParameter = (queryParameter: string, queryValue: string) => {
  if ('URLSearchParams' in window) {
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(queryParameter, queryValue)
    const newRelativePathQuery = window.location.pathname + '?' + searchParams.toString()
    window.history.pushState(null, '', newRelativePathQuery)
  }
}

export function getFolderUrl(folderId: string | undefined, platformId: string) {
  if (!folderId) {
    return null
  }
  const modalParams = searchWithoutModalParams({}, ['platformId'])
  const path = `${modalBasePath()}/folder/${folderId}`
  if (modalParams) {
    return `${path}${modalParams}&platformId=${platformId}`
  } else {
    return `${path}?platformId=${platformId}`
  }
}

export function getComponentName(child: any) {
  const childType = { ...child.type }
  return childType.displayName
}

export function pause(time?: number) {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(true)
    }, time || 0)
  })
}

/**
 *
 * @param id Id to normalize
 * @returns Id normalized to HTML standards
 */
export const normalizeId = (id: string): string => id.replace(/\s/g, '_')

/**
 *
 * @param value Value to turn into val data
 * @returns fileData for FileCell
 */
export const valToFileData = (value: any) => {
  const fileData = toJs(value)

  if (fileData.sensitivePhrases && fileData.sensitivePhrases.sensitiveKeywords) {
    fileData.sensitivePhrases.sensitiveKeywords = Array.from(
      Object.values(fileData.sensitivePhrases.sensitiveKeywords).map((v: any) => toJs(v))
    )
  }

  return fileData
}

/**
 *  takes in the testId but only returns the {'data-testid': testId} object in non-production build
 *  this way we can keep the production build DOM clean while still utilize it in development and test env
 */
export const renderAttributeIfDev = (attr: { [k: string]: string }): { [k: string]: string } | null =>
  process.env.NODE_ENV === 'production' ? null : attr

export const escapeComma = (str: string) => `"${str}"`

export const formatBytes = (bytes: number, decimals?: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals || 2
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const sizeUnitIndex = Math.floor(Math.log(bytes) / Math.log(k))
  const size = parseFloat((bytes / Math.pow(k, sizeUnitIndex)).toFixed(dm))

  return `${size} ${sizes[sizeUnitIndex]}`
}
