import {
  generateRoutePath,
  capitalize,
  largeNumberDisplay,
  getEmailDomain,
  getFullName,
  isExternalEmail,
  findMatches,
  filterWithLimit,
  joinCSVCells,
  camelCaseToTitleCase,
  snakeCaseToTitleCase,
  camelCaseToDashCase,
  paramsToString,
  createQueryStringParameters,
  arrayToParam,
  DateUtils,
  printCSVdate,
  getFolderUrl,
  searchWithoutModalParams,
  isValidDomain,
  isValidAppId,
  isValidAppDesc,
  formatBytes,
  formatSingleFileUrl
} from 'util/helpers'
import { makePageSizeKey } from 'util/hooks'
import { FileGridNavType } from 'types/common'

describe('generateRoutePath', () => {
  it('converts labels to lowercase', () => {
    const result = generateRoutePath('DasHBOard')
    expect(result).toBe('/dashboard')
  })

  it('converts spaces on labels to dashes', () => {
    const result = generateRoutePath('Top Risks')
    expect(result).toBe('/top-risks')
  })
})

describe('capitalize', () => {
  it('handles empty string', () => {
    const result = capitalize('')
    expect(result).toBe('')
  })

  it('capitalizes nice string', () => {
    const result = capitalize('altitude')
    expect(result).toBe('Altitude')
  })

  it('handles messy string', () => {
    const result = capitalize('%aBcDEFg1230948@#@$#x%%')
    expect(result).toBe('%abcdefg1230948@#@$#x%%')
  })
})

describe('camelCaseToTitleCase', () => {
  it('handles empty string', () => {
    const result = camelCaseToTitleCase('')
    expect(result).toBe('')
  })

  it('convers camel case to words 1', () => {
    const result = camelCaseToTitleCase('FileAccessed')
    expect(result).toBe('File Accessed')
  })

  it('convers camel case to words 2', () => {
    const result = camelCaseToTitleCase('FileModifiedExtended')
    expect(result).toBe('File Modified Extended')
  })

  it('convers camel case to words 3', () => {
    const result = camelCaseToTitleCase('fileSyncUploadedFull')
    expect(result).toBe('File Sync Uploaded Full')
  })
})

describe('snakeCaseToTitleCase', () => {
  it('handles empty string', () => {
    const result = snakeCaseToTitleCase('')
    expect(result).toBe('')
  })

  it('convers snake case to words 1', () => {
    const result = snakeCaseToTitleCase('view')
    expect(result).toBe('View')
  })

  it('convers snake case to words 2', () => {
    const result = snakeCaseToTitleCase('change_acl_editors')
    expect(result).toBe('Change Acl Editors')
  })

  it('convers snake case to words 3', () => {
    const result = snakeCaseToTitleCase('change_User_Access')
    expect(result).toBe('Change User Access')
  })
})

describe('createQueryStringParameters', () => {
  it('creates query params with keys in camel case', () => {
    const queryParam1: QueryParams = {
      orderBy: 'datetime',
      pageCountCacheTTL: 3600,
      pageNumber: 1,
      pageSize: 2000,
      sort: 'desc'
    }
    const queryParam2: QueryParams = {
      orderBy: 'datetime',
      pageCountCacheTTL: 3600,
      pageNumber: 1,
      pageSize: 2000,
      platformIds: ['gsuite', 'o365'],
      riskTypeIds: [],
      sort: 'desc'
    }
    const result1 = createQueryStringParameters(queryParam1)
    const result2 = createQueryStringParameters(queryParam2)

    expect(result1).toEqual({
      'order-by': 'datetime',
      'page-count-cache-ttl': 3600,
      'page-number': 1,
      'page-size': 2000,
      sort: 'desc'
    })
    expect(result2).toEqual({
      'order-by': 'datetime',
      'page-count-cache-ttl': 3600,
      'page-number': 1,
      'page-size': 2000,
      'platform-ids': '["gsuite","o365"]',
      'risk-type-ids': '[]',
      sort: 'desc'
    })
  })
})

describe('arrayToParam', () => {
  const arr1 = ['gsuite', 'o365']
  const arr2 = [200, 1]

  expect(arrayToParam(arr1)).toEqual('["gsuite","o365"]')
  expect(arrayToParam(arr2)).toEqual('[200,1]')
})

describe('largeNumberDisplay', () => {
  it('returns a string representation of the numer', () => {
    const result = largeNumberDisplay(0)
    expect(result).toEqual('0')
  })

  it('returns the same number if the number is smaller than 10000', () => {
    const result = largeNumberDisplay(5430)
    expect(result).toEqual('5430')
  })

  it('replaces the thousands with a "k" if the number is greater or equal than 10000 but smaller than 1 million', () => {
    const result = largeNumberDisplay(12743)
    expect(result).toEqual('12k+')
  })

  it('number is rounded properly to the bottom thousand', () => {
    const result = largeNumberDisplay(566940)
    expect(result).toEqual('566k+')
  })

  it('replaces the million with a "m" if the number is greater or equal than 1000000', () => {
    const result = largeNumberDisplay(123456789)
    expect(result).toEqual('123m+')
  })

  it('number is rounded properly to the bottom million', () => {
    const result = largeNumberDisplay(552950000)
    expect(result).toEqual('552m+')
  })
})

describe('getEmailDomain', () => {
  it('returns domain of email', () => {
    expect(getEmailDomain('michael@thoughtlabs.io')).toBe('thoughtlabs.io')
  })

  it('returns the input email as is if email does not contain @ symbol', () => {
    expect(getEmailDomain('invalid.email')).toBe('invalid.email')
  })

  it('returns the last part after @ symbol if the email contains multiple @ symbols', () => {
    expect(getEmailDomain('invalid@email@example.com')).toBe('example.com')
  })
})

describe('isExternallyOwned', () => {
  it('returns true if creator email belongs to domains list', () => {
    const domains = ['thoughtlabs.io']
    expect(isExternalEmail(domains, 'michael@thoughtlabs.io')).toBe(false)
  })

  it('returns false if creator email does not belong to domains list', () => {
    const domains = ['thoughtlabs.io']
    expect(isExternalEmail(domains, 'michael@gmail.com')).toBe(true)
  })

  it('returns false if domains list is empty', () => {
    expect(isExternalEmail([], 'michael@gmail.com')).toBe(true)
  })
})

describe('getFullName', () => {
  it('returns full name from IPerson instance', () => {
    const person = {
      name: {
        givenName: 'Test',
        familyName: 'User',
        fullName: 'Test User'
      }
    }
    expect(getFullName(person)).toBe('Test User')
  })

  it('trims whitespace if either first name or last name is not specified', () => {
    const person1 = {
      name: { givenName: 'Test' }
    }
    const person2 = {
      name: { familyName: 'User' }
    }
    const person3 = {
      name: {
        givenName: 'Test',
        familyName: ''
      }
    }
    const person4 = {
      name: {
        givenName: '',
        familyName: 'User'
      }
    }
    expect(getFullName(person1)).toBe('Test')
    expect(getFullName(person2)).toBe('User')
    expect(getFullName(person3)).toBe('Test')
    expect(getFullName(person4)).toBe('User')
  })
})

describe('findMatches', () => {
  it('finds all matches in the string', () => {
    expect(findMatches('start tslint test', 'st')).toEqual([
      [0, 2],
      [15, 17]
    ])
  })

  it('returns empty array if there are no matches', () => {
    expect(findMatches('start tslint test', 'nothing')).toEqual([])
  })
})

describe('filterWithLimit', () => {
  const items = [
    { label: 'test1', value: 'value1' },
    { label: 'label2', value: 'value2' },
    { label: 'test3', value: 'value3' },
    { label: 'test4', value: 'value4' },
    { label: 'test5', value: 'value5' }
  ]

  const comp = ({ label }: { label: string }) => label.startsWith('test')

  it('limits filtered matches to a specified number', () => {
    const results = filterWithLimit(items, comp, 3)
    expect(results).toHaveLength(3)
    expect(results).toEqual([
      { label: 'test1', value: 'value1' },
      { label: 'test3', value: 'value3' },
      { label: 'test4', value: 'value4' }
    ])
  })

  it('returns all matches if matched count is less than a specified limit', () => {
    const results = filterWithLimit([1, 2, 1, 2, 2], (num) => num === 1, 3)
    expect(results).toHaveLength(2)
    expect(results).toEqual([1, 1])
  })
})

describe('joinCSVCells', () => {
  it('concatenates cell array by commans', () => {
    expect(joinCSVCells(['cell1', 'cell2', 'cell3'])).toEqual('cell1,cell2,cell3')
  })

  it('returns string parameter passed as is', () => {
    expect(joinCSVCells('cell1')).toEqual('cell1')
    expect(joinCSVCells('cell1,cell2')).toEqual('cell1,cell2')
  })
})

describe('Camel Case Conversion', () => {
  it('Converts single word', () => {
    const singleWord = 'foo'
    const rs = camelCaseToDashCase(singleWord)
    expect(rs).toBe(singleWord)
  })
  it('Converts multiple words', () => {
    const multipleWords = 'fooBarZhu'
    const multipleWordsDashed = 'foo-bar-zhu'
    const rs = camelCaseToDashCase(multipleWords)
    expect(rs).toBe(multipleWordsDashed)
  })
  it('Handles PascalCase', () => {
    const pascalCase = 'PascalCase'
    const pascalCaseDashed = 'pascal-case'
    const rs = camelCaseToDashCase(pascalCase)
    expect(rs).toBe(pascalCaseDashed)
  })
  it('Handles multiple uppercase in a row', () => {
    const multipleUppercaseWord = 'pageCountCacheTTL'
    const multipleUppercaseWordDashed = 'page-count-cache-ttl'
    const rs = camelCaseToDashCase(multipleUppercaseWord)
    expect(rs).toBe(multipleUppercaseWordDashed)
  })
  it('Does not fail for empty case', () => {
    const rs1 = camelCaseToDashCase('')
    const rs2 = camelCaseToDashCase(''[1])
    expect(rs1).toBe('')
    expect(rs2).toBe('')
  })
})

describe('Object to parameter conversion', () => {
  it('Converts single property', () => {
    const params = {
      foo: '1'
    }
    const paramsStringified = 'foo=1'
    const rs = paramsToString(params)
    expect(rs).toBe(paramsStringified)
  })

  it('Converts multiple properties', () => {
    const params = {
      foo: 'test',
      bar: 12321,
      zhu: 'aa'
    }

    const paramsStringified = 'foo=test&bar=12321&zhu=aa'

    const rs = paramsToString(params)
    expect(rs).toBe(paramsStringified)
  })

  it('Converts arrays', () => {
    const params = {
      foo: ['bar', 'zhu'],
      bar: [1, 2, 3]
    }

    const paramsStringified = 'foo=%5B%22bar%22%2C%22zhu%22%5D&bar=%5B1%2C2%2C3%5D'

    const rs = paramsToString(params)
    expect(rs).toBe(paramsStringified)
  })

  it('Ignores empty values', () => {
    const test = paramsToString({ bar: '', foo: undefined })

    expect(test).toBeFalsy()
  })
})

describe('DateUtils', () => {
  it('should get the time now as a unix timestamp', () => {
    const now = DateUtils.timestamp().toString()
    expect(now).toEqual(Date.now().toString().substring(0, now.length))
  })
  it('should return a timestamp(1601050889) based on the given value: 09/25/2020 16:21:29', () => {
    const timestamp = DateUtils.timestamp('09/25/2020 16:21:29', true)
    expect(timestamp).toEqual(1601050889)
  })
  it('should display September 25, 2020 4:21 PM', () => {
    // for testing, we need to render utc dates to get an expected date & time, thus 'true' as 3rd arg
    expect(DateUtils.dateFormat(1601050889, 'LLL', true)).toEqual('September 25, 2020 4:21 PM')
  })
})

describe('printCSVdate', () => {
  it('should display 09/25/2020 16:21:29', () => {
    // for testing, we need to render utc dates to get an expected date & time, thus 'true' as 2nd arg
    const date = printCSVdate(1601050889, true)
    expect(date).toEqual('09/25/2020 16:21:29')
  })
})

describe('searchWithoutModalParams', () => {
  const { location } = window
  const initialSearch = '?param=test'

  beforeAll(() => {
    delete window.location

    window.location = {
      ...window.location,
      pathname: '/',
      search: initialSearch
    }
  })

  it('returns empty by default when no params in the url if no params are passed', () => {
    window.location.search = ''
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe('')
  })

  it('returns existing params in the url if no params are passed', () => {
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(initialSearch)
  })

  it('removes modal specific query params if exist, e.g. modalPage', () => {
    window.location.search = initialSearch + '&modalPage=1'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(initialSearch)
  })

  it('removes modal specific query params if exist, e.g. spotlightCard', () => {
    window.location.search = initialSearch + '&spotlightCard=card'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(initialSearch)
  })

  it('removes modal specific query params if exist, e.g. selectedEmail', () => {
    window.location.search = initialSearch + '&selectedEmail=bobbie%40thoughtlabs.io'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(initialSearch)
  })

  it('removes modal specific query params if exist, e.g. breadcrumbPosition', () => {
    window.location.search = initialSearch + '&breadcrumbPosition=1'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(initialSearch)
  })

  it('removes modal specific query params if exist, e.g. selectedSubNavKey', () => {
    window.location.search = initialSearch + '&selectedSubNavKey=events'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(initialSearch)
  })

  it('removes modal specific query params if exist, e.g. utm-source', () => {
    window.location.search = initialSearch + '&utm-source=email'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(initialSearch)
  })

  it('appends extraParams if defined, e.g. 1 extra param', () => {
    window.location.search = initialSearch + '&newParam=test'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(`${initialSearch}&newParam=test`)
  })

  it('appends extraParams if defined, e.g. more than 1 extra params', () => {
    window.location.search = initialSearch + '&newParam1=test1&newParam2=test2&newParam3=test3'
    const modalParams = searchWithoutModalParams()

    expect(modalParams).toBe(`${initialSearch}&newParam1=test1&newParam2=test2&newParam3=test3`)
  })

  it('removes additional param if defined', () => {
    window.location.search = initialSearch + '&newParam1=test1&newParam2=test2&newParam3=test3'
    const modalParams = searchWithoutModalParams({}, ['newParam1'])

    expect(modalParams).toBe(`${initialSearch}&newParam2=test2&newParam3=test3`)
  })

  it('removes additional params if defined', () => {
    window.location.search = initialSearch + '&newParam1=test1&newParam2=test2&newParam3=test3'
    const modalParams = searchWithoutModalParams({}, ['newParam1', 'newParam2'])

    expect(modalParams).toBe(`${initialSearch}&newParam3=test3`)
  })

  afterEach(() => {
    window.location.search = initialSearch // have to reassign the original value back, otherwise the tests below this will fail
  })

  afterAll(() => {
    window.location = location
  })
})

describe('getFolderUrl', () => {
  it('returns null if folderId is undefined', () => {
    const folderUrl = getFolderUrl(undefined, '')

    expect(folderUrl).toBe(null)
  })

  it('returns url with platformId query param appended if no other params exist', () => {
    const folderUrl = getFolderUrl('testFolderId', 'gsuite')

    expect(folderUrl).toBe('/dashboard/folder/testFolderId?platformId=gsuite')
  })

  it('returns url with platformId query param appended if there is other params exist but not include platformId', () => {
    const { location } = window
    const initialSearch = '?param=test'

    delete window.location

    window.location = {
      ...window.location,
      pathname: '/',
      search: initialSearch
    }

    const folderUrl = getFolderUrl('testFolderId', 'gsuite')

    expect(folderUrl).toBe(`/dashboard/folder/testFolderId${initialSearch}&platformId=gsuite`)

    window.location = location
  })

  it('returns url with platformId query param replaced if there is other params exist and also includes platformId', () => {
    const { location } = window
    const initialSearch = '?param=test'

    delete window.location

    window.location = {
      ...window.location,
      pathname: '/',
      search: `${initialSearch}&platformId=o365`
    }

    const folderUrl = getFolderUrl('testFolderId', 'gsuite')

    expect(folderUrl).toBe(`/dashboard/folder/testFolderId${initialSearch}&platformId=gsuite`)

    window.location = location
  })
})

describe('formatSingleFileUrl', () => {
  it('should return correct url with owner, selection, platformId, sensitive in the query if no ther queries are appended', () => {
    expect(formatSingleFileUrl('bobbie@thoughtlabs.io', '12345', 'gsuite', false)).toBe(
      '/dashboard/file/12345?owner=bobbie@thoughtlabs.io&selection=timeline&platformId=gsuite'
    )
    expect(formatSingleFileUrl('bobbie@thoughtlabs.io', '12345', 'gsuite', true)).toBe(
      '/dashboard/file/12345?owner=bobbie@thoughtlabs.io&selection=sensitive&platformId=gsuite&sensitive=true'
    )
    expect(formatSingleFileUrl('', '12345', 'gsuite', false)).toBe(
      '/dashboard/file/12345?owner=&selection=timeline&platformId=gsuite'
    )
  })
  it('should return correct url with with selection being overriden if defined', () => {
    expect(formatSingleFileUrl('bobbie@thoughtlabs.io', '12345', 'gsuite', false, FileGridNavType.SENSITIVE)).toBe(
      '/dashboard/file/12345?owner=bobbie@thoughtlabs.io&selection=sensitive&platformId=gsuite'
    )
    expect(formatSingleFileUrl('bobbie@thoughtlabs.io', '12345', 'gsuite', true, FileGridNavType.TIMELINE)).toBe(
      '/dashboard/file/12345?owner=bobbie@thoughtlabs.io&selection=timeline&platformId=gsuite&sensitive=true'
    )
  })
})

describe('isValidDomain', () => {
  it('should return true if domain is valid', () => {
    expect(isValidDomain('domain.com')).toBe(true)
    expect(isValidDomain('do-main.com')).toBe(true)
    expect(isValidDomain('domain99.com')).toBe(true)
    expect(isValidDomain('99domain.com')).toBe(true)
    expect(isValidDomain('do99main.com')).toBe(true)
    expect(isValidDomain('domain.com.uk')).toBe(true)
    expect(isValidDomain('domain.co.in')).toBe(true)
    expect(isValidDomain('m.domain.com')).toBe(true)
  })
  it('should return false if domain is invalid', () => {
    expect(isValidDomain('domain')).toBe(false)
    expect(isValidDomain('new domain.com')).toBe(false)
    expect(isValidDomain('new_domain.com')).toBe(false)
    expect(isValidDomain('domain%#$%^&*()+=`~.com')).toBe(false)
    expect(isValidDomain(' ')).toBe(false)
  })
})

describe('isValidAppId', () => {
  it('should return true if app id is valid', () => {
    expect(isValidAppId('appId')).toBe(true)
    expect(isValidAppId('appId123')).toBe(true)
    expect(isValidAppId('appId-123')).toBe(true)
    expect(isValidAppId('appId_123')).toBe(true)
    expect(isValidAppId('appId-123_456')).toBe(true)
    expect(isValidAppId('appId-')).toBe(true)
    expect(isValidAppId('appId_')).toBe(true)
    expect(isValidAppId('appId-12-3-')).toBe(true)
    expect(isValidAppId('appId_12_3_')).toBe(true)
    expect(isValidAppId('appId-1_2-3')).toBe(true)
    expect(isValidAppId('appId-1_2-3-')).toBe(true)
    expect(isValidAppId('appId-1_2-3_')).toBe(true)
  })
  it('should return false if app id is invalid', () => {
    expect(isValidAppId('app id')).toBe(false)
    expect(isValidAppId('app%#$%^&*()+=`~')).toBe(false)
    expect(isValidAppId('app ')).toBe(false)
    expect(isValidAppId(' ')).toBe(false)
    expect(isValidAppId('')).toBe(false)
  })
})

describe('isValidAppDesc', () => {
  it('should return true if app description is valid', () => {
    expect(isValidAppDesc('appDesc')).toBe(true)
    expect(isValidAppDesc('appDesc123')).toBe(true)
    expect(isValidAppDesc('appDesc-123')).toBe(true)
    expect(isValidAppDesc('appDesc_123')).toBe(true)
    expect(isValidAppDesc('appDesc-123_456')).toBe(true)
    expect(isValidAppDesc('appDesc-')).toBe(true)
    expect(isValidAppDesc('appDesc_')).toBe(true)
    expect(isValidAppDesc('appDesc-12-3-')).toBe(true)
    expect(isValidAppDesc('appDesc_12_3_')).toBe(true)
    expect(isValidAppDesc('appDesc-1_2-3')).toBe(true)
    expect(isValidAppDesc('appDesc-1_2-3-')).toBe(true)
    expect(isValidAppDesc('appDesc-1_2-3_')).toBe(true)
    expect(isValidAppDesc('app desc here to be valid')).toBe(true)
    expect(isValidAppDesc('app ')).toBe(true)
    expect(isValidAppDesc(' ')).toBe(true)
    expect(isValidAppDesc('')).toBe(true)
  })
  it('should return false if app description is invalid', () => {
    expect(isValidAppDesc('app%#$%^&*()+=`~')).toBe(false)
  })
})

describe('Cached Page Size', () => {
  it('Generates keys correctly', () => {
    const risksPath = '/risks'
    const risksKey = 'r-603-pageSize'

    expect(makePageSizeKey(risksPath)).toEqual(risksKey)
  })

  it('Handles null key', () => {
    const undefinedPath = undefined
    const undefinedKey = 'pageSize'

    expect(makePageSizeKey(undefinedPath)).toEqual(undefinedKey)
  })

  it('Handles complex case', () => {
    const risksPath = '/risks/files/:riskId'
    const risksKey = 'rfr-1900-pageSize'

    expect(makePageSizeKey(risksPath)).toEqual(risksKey)
  })
})

describe('formatBytes', () => {
  it('formatt bytes correctly without decimals', () => {
    expect(formatBytes(1024)).toEqual('1 KB')
    expect(formatBytes(1234)).toEqual('1.21 KB')
  })

  it('formatt bytes correctly with decimals', () => {
    expect(formatBytes(1234, 3)).toEqual('1.205 KB')
  })
})
