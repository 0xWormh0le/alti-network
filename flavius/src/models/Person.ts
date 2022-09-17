import { UserKind, AccessLevel } from 'types/common'
import UI_STRINGS from 'util/ui-strings'
import anonymousUserIcon from 'icons/anonymous-user.svg'
class Person implements IPerson {
  public accessLevel: AccessLevel
  public name: Name
  public projectId: string
  public primaryEmail: Email
  public userKind: UserKind
  public altnetId?: string
  public recoveryEmail?: Email
  public phones: Phone[]
  public externalIds: UserId[]
  public avatar?: Avatar
  public internal?: boolean // deprecated thanks to userKind
  public anonymous?: boolean
  public internalCount?: number
  public externalCount?: number
  public emails: Email[]
  public accessCount?: number
  public riskCount?: number
  public orgUnitPath?: string
  public isEnrolledInMFA?: boolean
  public etag?: string
  public creationTime?: number
  public lastLoginTime?: number
  public lastModifiedTime?: number
  public notes?: Notes
  public lastRemovedPermissions?: number | null
  public title?: string
  public department?: string
  public phoneNumber?: string

  constructor(person: IPerson) {
    this.altnetId = person.altnetId
    this.projectId = person.projectId
    this.userKind = person.userKind
    this.accessLevel = person.accessLevel
    this.name = person.name || {
      givenName: '',
      familyName: '',
      fullName: ''
    }
    this.primaryEmail = person.primaryEmail
    this.recoveryEmail = person.recoveryEmail
    this.phones = person.phones || []
    this.externalIds = person.externalIds || []
    this.orgUnitPath = person.orgUnitPath
    this.etag = person.etag
    this.isEnrolledInMFA = person.isEnrolledInMFA
    this.creationTime = person.creationTime
    this.lastLoginTime = person.lastLoginTime
    this.lastModifiedTime = person.lastModifiedTime
    this.notes = person.notes
    this.avatar =
      this.name.fullName === UI_STRINGS.RISKS.ANONYMOUS_USER ? { url: anonymousUserIcon, url_etag: '' } : person.avatar
    this.title = person.title
    this.department = person.department
    this.phoneNumber = person.phoneNumber
    this.internal = person.internal
    this.anonymous = !person.primaryEmail?.address || person.primaryEmail?.address?.indexOf('@') === -1 // altnetId: person.personId?.indexOf('@') === -1 &&
    this.internalCount = person.internalCount
    this.externalCount = person.externalCount
    this.emails = person.emails || []
    this.accessCount = person.accessCount
    this.riskCount = person.riskCount
    this.lastRemovedPermissions = person.lastRemovedPermissions
  }

  public get displayName(): string {
    if (this.name.givenName && this.name.familyName) {
      return `${this.name.givenName} ${this.name.familyName}`
    } else if (this.anonymous) {
      return UI_STRINGS.RISKS.ANONYMOUS_USER
    } else if (this.primaryEmail?.address) {
      const emailFirst = this.primaryEmail?.address.split('@')
      return emailFirst && emailFirst.length > 0 ? emailFirst[0] : this.primaryEmail?.address
    } else {
      return this.primaryEmail?.address ?? '' // altnetId:
    }
  }

  /*
   * For transform value from Map to Object in griddle-react custom components, e.g. SimplePersonCell, ActorCell
   * This is a workaround solution, once we refactor the table to NOT use griddle-react, this method shall be gone
   */
  static fromMap(personMap: { get: (x: keyof IPerson) => any }): Person {
    return new Person({
      primaryEmail: personMap.get('primaryEmail') && (Object.fromEntries(personMap.get('primaryEmail')) as Email),
      recoveryEmail: personMap.get('recoveryEmail') && (Object.fromEntries(personMap.get('recoveryEmail')) as Email),
      avatar: personMap.get('avatar') && (Object.fromEntries(personMap.get('avatar')) as Avatar),
      name: personMap.get('name') && (Object.fromEntries(personMap.get('name')) as Name),
      internal: personMap.get('internal'),
      internalCount: personMap.get('internalCount'),
      externalCount: personMap.get('externalCount'),
      emails:
        personMap.get('emails') &&
        (Array.from(personMap.get('emails')).map((email: any) => Object.fromEntries(email)) as Email[]),
      accessCount: personMap.get('accessCount'),
      riskCount: personMap.get('riskCount'),
      altnetId: personMap.get('altnetId'),
      projectId: personMap.get('projectId'),
      accessLevel: personMap.get('accessLevel'),
      userKind: personMap.get('userKind'),
      phones:
        personMap.get('phones') &&
        (Array.from(personMap.get('phones')).map((email: any) => Object.fromEntries(email)) as Phone[]),
      externalIds:
        personMap.get('externalIds') &&
        (Array.from(personMap.get('externalIds')).map((email: any) => Object.fromEntries(email)) as UserId[]),
      orgUnitPath: personMap.get('orgUnitPath'),
      etag: personMap.get('etag'),
      isEnrolledInMFA: personMap.get('isEnrolledInMFA'),
      creationTime: personMap.get('creationTime'),
      lastLoginTime: personMap.get('lastLoginTime'),
      lastModifiedTime: personMap.get('lastModifiedTime'),
      notes: personMap.get('notes') && (Object.fromEntries(personMap.get('notes')) as Notes)
    })
  }
}

export default Person
