/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'

context('Authentication', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST).login().server()
  })

  // TODO: Re-enable the postAltimeter check once the CORS issue is fixed on prod
  it('Logs in to the app', () => {
    // cy.route('POST', `${BASE_URIS.API}/altimeter`).as('postAltimeter')
    cy.location('pathname', { timeout: 20000 }).should('include', '/dashboard')
    // cy.wait('@postAltimeter').then((altimeterResponse) => {
    //   expect(altimeterResponse.status).to.equal(200)
    // })
  })

  it('Logs out of the app', () => {
    cy.get('.LogoutButton').click()
    cy.location('pathname', { timeout: 20000 }).should('include', '/login')
  })

  it('Cannot access API when logged out', () => {
    cy.get('.LogoutButton').click()
    cy.request({
      method: 'GET',
      url: `${BASE_URIS.HOST}/file/1`,
      failOnStatusCode: false
    }).as('file')

    cy.get('@file').should((response) => {
      expect(response.body.message).to.be.oneOf([undefined, 'Unauthorized'])
    })
  })
})
