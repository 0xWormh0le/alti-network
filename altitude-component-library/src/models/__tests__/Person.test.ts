import Person from '../Person'

describe('displayName()', () => {
  it('returns full name with first and last name when they are present', () => {
    const person = new Person({
      personId: 'id',
      firstName: 'John',
      lastName: 'Smith',
      avatar: '',
      email: 'john.smith@company.org',
      internalEmailCount: 1,
      externalEmailCount: 0,
      internal: true,
      otherEmails: [],
      accessCount: 0,
      riskCount: 99
    })

    expect(person.displayName).toBe('John Smith')
  })

  it('returns email up to @ when first name or last name is not available', () => {
    const person = new Person({
      personId: 'id',
      firstName: 'John',
      lastName: '',
      email: 'john.smith@company.org',
      avatar: '',
      internalEmailCount: 1,
      externalEmailCount: 0,
      internal: true,
      otherEmails: [],
      accessCount: 0,
      riskCount: 99
    })

    expect(person.displayName).toBe('john.smith')
  })

  it('returns Anonymous User when email and names are not available', () => {
    const person = new Person({
      personId: '1234',
      firstName: '',
      lastName: '',
      email: '',
      avatar: '',
      internalEmailCount: 1,
      externalEmailCount: 0,
      internal: true,
      otherEmails: [],
      accessCount: 0,
      riskCount: 99
    })

    expect(person.displayName).toBe('Anonymous User')
  })
})
