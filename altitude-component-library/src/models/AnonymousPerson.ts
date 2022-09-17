import Person from './Person'

class AnonymousPerson extends Person {
  constructor() {
    super({
      firstName: 'Anonymous',
      lastName: 'User'
    } as IPerson)
  }
}

export default AnonymousPerson
