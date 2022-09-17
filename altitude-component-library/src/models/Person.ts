class Person implements IPerson {
  public personId: string
  public firstName: string
  public lastName: string
  public email: string
  public avatar: string
  public internal: boolean
  public anonymous?: boolean
  public internalEmailCount: number
  public externalEmailCount: number
  public otherEmails: OtherEmail[]
  public accessCount: number
  public riskCount: number
  public title?: string
  public department?: string
  public phoneNumber?: string
  public permissionsLastDeleted?: string | null

  constructor(person: IPerson) {
    this.personId = person.personId
    this.firstName = person.firstName
    this.lastName = person.lastName
    this.email = person.email
    this.avatar = person.avatar
    this.title = person.title
    this.department = person.department
    this.phoneNumber = person.phoneNumber
    this.internal = person.internal
    this.anonymous = person.personId?.indexOf('@') === -1 && person.email?.indexOf('@') === -1
    this.internalEmailCount = person.internalEmailCount
    this.externalEmailCount = person.externalEmailCount
    this.otherEmails = person.otherEmails
    this.accessCount = person.accessCount
    this.riskCount = person.riskCount
    this.permissionsLastDeleted = person.permissionsLastDeleted
  }

  public get displayName(): string {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`
    } else if (this.anonymous) {
      return 'Anonymous User'
    } else if (this.email) {
      const emailFirst = this.email.split('@')
      return emailFirst && emailFirst.length > 0 ? emailFirst[0] : this.email
    } else {
      return this.personId
    }
  }
}

export default Person
