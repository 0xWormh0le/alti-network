/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'

context('People', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST)
      .login()
      .server()
      // Click the side navigaition to get to People search
      .get(':nth-child(3) > .Sidebar__link')
      .click()
  })

  it('Fetches all People', () => {
    cy.route('GET', `${BASE_URIS.API}/people`)
      .as('getPeople')
      .wait('@getPeople')
      .then((peopleResponse) => {
        const peopleData = peopleResponse.response.body
        expect(peopleData.people[0].primaryEmail?.address).to.contain('@')
      })
  })
})
