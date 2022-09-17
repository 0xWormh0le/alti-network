import Person from './Person'
import { UsageKind } from 'types/common'

const email: Email = {
  address: 'sample@foo.bar',
  kind: UsageKind.personal,
  primary: false,
  accessCount: 1,
  riskCount: 1,
  lastDeletedPermissions: 0
}

class AnonymousPerson extends Person {
  constructor() {
    super({
      name: {
        familyName: 'User',
        givenName: 'Anonymous',
        fullName: 'User Anonymous'
      },
      primaryEmail: email
    } as IPerson)
  }
}

export default AnonymousPerson
