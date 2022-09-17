import { Location } from 'history'
import fp from 'lodash/fp'
import moment from 'moment'
import RiskCatalog from 'models/RiskCatalog'

const generateRoutePath = (label: string) => {
  // convert to small caps, replace spaces with dashes, and add forward slash at the beginning
  const lowerCaseLabel = label.toLowerCase().replace(' ', '-')
  return `/${lowerCaseLabel}`
}

export const toProperCase = (str: string) => {
  return str
    .split(' ')
    .map((item) => {
      const newString = item[0].toUpperCase()
      return newString + item.slice(1)
    })
    .join(' ')
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

const ellipsify = (input: string, numberOfChars: number) => {
  if (!input) {
    return ''
  } else if (input.length > numberOfChars) {
    return input.substring(0, numberOfChars) + '…'
  } else {
    return input
  }
}

const getRisk = (value: SeverityRange) => {
  return {
    veryhigh: value > 9,
    high: value > 7,
    medium: value > 5 && value <= 7,
    low: value > 2 && value <= 5,
    safe: value > -1 && value <= 2
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
export const hasSensitiveContent = (value: any) => {
  const sensitivePhrases = toJs(value as IValue<ISensitiveObject>, 'sensitivePhrases') as ISensitiveObject
  if (sensitivePhrases.hasOwnProperty('ccFileNumCount') && sensitivePhrases.ccFileNumCount > 0) {
    return true
  } else if (
    sensitivePhrases.hasOwnProperty('sensitiveKeywordsFileCount') &&
    sensitivePhrases.sensitiveKeywordsFileCount > 0
  ) {
    return true
  } else if (sensitivePhrases.hasOwnProperty('ssnFileCount') && sensitivePhrases.ssnFileCount > 0) {
    return true
  } else if (sensitivePhrases.hasOwnProperty('ssn') && sensitivePhrases.ssn > 0) {
    return true
  } else if (sensitivePhrases.hasOwnProperty('ccNum') && sensitivePhrases.ccNum > 0) {
    return true
  } else if (sensitivePhrases.hasOwnProperty('sensitiveKeywords') && sensitivePhrases.sensitiveKeywords.size > 0) {
    return true
  } else if (
    sensitivePhrases.hasOwnProperty('sensitiveKeywords') &&
    sensitivePhrases.sensitiveKeywords.hasOwnProperty('length')
  ) {
    return sensitivePhrases.sensitiveKeywords.length > 0
  }
  return false
}

export const hasKeywords = (sensitivePhrases: ISensitivePhrase) => {
  return sensitivePhrases.hasOwnProperty('sensitiveKeywords') && sensitivePhrases.sensitiveKeywords!.size > 0
}

export const getKeywords = (sensitivePhrases: any) => {
  let additional = 0
  const phrases: IPhrase[] = []
  if (hasKeywords(sensitivePhrases)) {
    let total = 0
    sensitivePhrases.sensitiveKeywords.forEach((index: number) => {
      const phraseMap = sensitivePhrases.sensitiveKeywords.get(index)
      total++
      if (total < 6) {
        const count = phraseMap.get('count')
        const keyword = phraseMap.get('keyword')
        phrases.push({
          count,
          keyword
        })
      } else {
        additional += phraseMap.get('count')
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

export const toJs = (immutableObject: IImmutable, immutableString: string | number) => {
  if (typeof immutableObject.get === 'undefined') {
    return immutableObject.hasOwnProperty(immutableString) ? immutableObject[immutableString] : immutableObject
  }
  const immutableMap = immutableObject.get(immutableString)
  const retval = {}
  if (immutableMap && typeof immutableMap.forEach === 'function') {
    immutableMap.forEach((value: any, key: any) => {
      retval[key] = value
    })
  }
  return retval
}

const modalRoutes = [
  '/spotlight/',
  '/file/',
  '/files/',
  '/people/',
  '/app-spotlight/',
  '/permissions/file/',
  '/resolve/'
]

const locationIsAModalRoute = (location: string) => modalRoutes.some((modalRoute) => location.includes(modalRoute))
const searchWithoutModalParams = (extraParams = {}) => {
  // This function removes modal-specific query params between routes. Passing other
  // params during modal navigation (navigating to or between modals) retains state,
  // which is desired. But the params for modal state cannot be passed between modals
  // since modal state should be reset on modal navigation.
  // `extraParams` is appended to the query string if provided.
  const searchString = window.location.search
  const finalString = searchString
    .replace(/[&?]modalPage=[0-9]+/g, '')
    .replace(/[&?]spotlightCard=[a-z]+/g, '')
    .replace(/[&?]selectedEmail=[\w+.%]+/g, '')
    .replace(/[&?]breadcrumbPosition=[0-9]+/g, '')
    .replace(/[&?]selectedSubNavKey=[a-z]+/g, '')
    .replace(/[&?]utm-source=([a-zA-Z'-]+)/g, '') // match parameters like &utm-source=risk-summary-email

  const queryParams = {
    ...parseQueryString(finalString),
    ...extraParams
  }
  return jsonToQueryString(queryParams)
}

export const getExtraParams = (riskTypeId: RiskTypeId) => {
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

// tslint:disable-next-line no-empty
export const noop = () => {}

export const getEmailDomain = (email: string): string => email.replace(/.*@/, '')

export const isExternalEmail = (domains: string[] = [], creatorEmail: string): boolean => {
  return Boolean(creatorEmail) && !domains.includes(getEmailDomain(creatorEmail))
}

export const getFullName = ({ firstName, lastName }: { firstName?: string; lastName?: string }): string =>
  fp
    .reject((item) => !item)([firstName, lastName])
    .join(' ')

export const findMatches = (text: string, keyword: string): number[][] => {
  const regex = new RegExp(keyword, 'gi')
  const matches = []
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

export const joinCSVCells = (cells: string | string[]): string => (Array.isArray(cells) ? cells.join(',') : cells)

export const printCSVdate = (unixTime: number, format: string, utc?: boolean) => DateUtils.unix(unixTime, format, utc)

export class DateUtils {
  static unix(unixTime: number, format: string, utc?: boolean) {
    if (utc) {
      return moment.unix(unixTime).utc().format(format)
    }
    return moment.unix(unixTime).format(format)
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

  static now(format: string) {
    return moment().format(format)
  }

  static timestamp(value?: string | number, utc?: boolean) {
    if (value) {
      return utc ? moment.utc(value).unix() : moment(value).unix()
    } else {
      return utc ? moment().utc().unix : moment().unix()
    }
  }

  static dateFormat(dateValue: string | number, format: string, utc?: boolean) {
    const self = new DateUtils()
    const _moment = self._parsedDate(dateValue, utc || false)
    return _moment.format(format)
  }
}

export const csvFileName = (fileName: string, format: string) => {
  return `${fileName}_${DateUtils.dateFormat(DateUtils.now(format), 'DD-MM-YYYY_HH-mm-ss')}.csv`
}

export const isNumber = (value: any) => {
  return typeof value === 'number' && isFinite(value)
}

export {
  generateRoutePath,
  getRisk,
  getRiskLabel,
  capitalize,
  ellipsify,
  isMobileOrTablet,
  modalRoutes,
  locationIsAModalRoute,
  searchWithoutModalParams,
  largeNumberDisplay,
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
