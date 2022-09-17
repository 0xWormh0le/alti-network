/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'
import { capitalize } from '../../utils/helpers'

context('EditPermissions', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST).login().server()
  })

  it('Loads Risk Endpoint and Open EditPermissions', () => {
    VerifyEditPermissions()
  })
})

const VerifyEditPermissions = () => {
  cy.route('GET', `${BASE_URIS.API}/risks/stats`)
    .as('getStats')
    .wait('@getStats')
    .then(() => {
      cy.route('GET', `${BASE_URIS.API}/file/*`).as('getFileInfo')
      cy.contains('risks associated').click()

      cy.wait('@getFileInfo').then((fileResponse) => {
        const fileData = fileResponse.response.body
        expect(fileData.createdAt).to.be.a('number')
        expect(fileData.fileName).to.be.an('string')
        expect(fileData.lastModified).to.be.a('number')
        expect(fileData.createdBy).to.be.an('object')

        cy.contains('Edit Permissions').click()
        cy.route('GET', `${BASE_URIS.API}/file/*/permissions*`).as('getPermissionsForFile')
        cy.wait('@getPermissionsForFile').then((permissionsResponse) => {
          const permissionsData = permissionsResponse.response.body
          expect(permissionsData.orderBy).to.be.a('string')
          expect(permissionsData.permissions).to.be.an('Array')
          expect(permissionsData.permissionsCount).to.be.a('number')

          if (permissionsData.permissionsCount > 0) {
            const testPermission = permissionsData.permissions[0]
            expect(testPermission.discoverable).to.be.a('boolean')
            expect(testPermission.permissionId).to.be.a('string')
            expect(testPermission.role).to.be.a('string')
            expect(testPermission.type).to.be.oneOf(['anyone', 'domain', 'user'])
          }
        })
      })
    })
}

export default VerifyEditPermissions
