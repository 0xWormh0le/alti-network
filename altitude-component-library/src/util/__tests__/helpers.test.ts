import {
  generateRoutePath,
  capitalize,
  largeNumberDisplay,
  getEmailDomain,
  getFullName,
  isExternalEmail,
  findMatches,
  filterWithLimit,
  joinCSVCells
} from 'util/helpers'

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
      firstName: 'Test',
      lastName: 'User'
    }
    expect(getFullName(person)).toBe('Test User')
  })

  it('trims whitespace if either first name or last name is not specified', () => {
    const person1 = {
      firstName: 'Test'
    }
    const person2 = {
      lastName: 'User'
    }
    const person3 = {
      firstName: 'Test',
      lastName: ''
    }
    const person4 = {
      firstName: '',
      lastName: 'User'
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
