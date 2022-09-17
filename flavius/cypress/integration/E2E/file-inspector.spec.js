/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'

context('FileInspector', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST).login().server()
  })

  it('Load Risk Endpoint and Open FileInspector', () => {
    cy.route('GET', `${BASE_URIS.API}/risks/stats`)
      .as('getStats')
      .wait('@getStats')
      .then((statsResponse) => {
        cy.route('GET', `${BASE_URIS.API}/file/*`).as('getFileInfo')
        cy.contains('risks associated').click()
        cy.wait('@getFileInfo').then((fileResponse) => {
          const fileData = fileResponse.response.body
          expect(fileData.createdAt).to.be.a('number')
          expect(fileData.createdBy.accessCount).to.be.oneOf(['number', undefined])
          // expect(fileData.createdBy.avatar).to.be.a('string')
          expect(fileData.createdBy.primaryEmail?.address).to.be.a('string')
          // expect(fileData.createdBy.name.givenName).to.be.a('string')
          // expect(fileData.createdBy.name.familyName).to.be.a('string')
          // expect(fileData.createdBy.emails).to.be.an('Array')
          expect(fileData.createdBy.altnetId).to.be.a('string')
          expect(fileData.createdBy.riskCount).to.be.oneOf(['number', undefined])
          expect(fileData.externalAccessCount).to.be.a('number')
          expect(fileData.externalAccessList).to.be.an('Array')
          if (fileData.externalAccessCount > 0) {
            expect(fileData.externalAccessList[0].accessCount).to.be.a('number')
            expect(fileData.externalAccessList[0].avatar?.url).to.be.oneOf(['string', undefined])
            expect(fileData.externalAccessList[0].avatar?.url_etag).to.be.oneOf(['string', undefined])
            expect(fileData.externalAccessList[0].primaryEmail?.address).to.be.a('string')
            expect(fileData.externalAccessList[0].name.givenName).to.be.a('string')
            expect(fileData.externalAccessList[0].name.familyName).to.be.a('string')
            // expect(fileData.externalAccessList[0].permissionId).to.be.a('string')
            // expect(fileData.externalAccessList[0].role).to.be.a('string')
            expect(fileData.externalAccessList[0].riskCount).to.be.a('number')
            expect(fileData.externalAccessList[0].emails).to.be.an('Array')
          }
          expect(fileData.fileId).to.be.a('string')
          expect(fileData.fileName).to.be.a('string')
          expect(fileData.internalAccessCount).to.be.a('number')
          expect(fileData.internalAccessList).to.be.an('Array')
          if (fileData.internalAccessCount > 0) {
            expect(fileData.internalAccessList[0].accessCount).to.be.a('number')
            expect(fileData.internalAccessList[0].avatar?.url).to.be.oneOf(['string', undefined])
            expect(fileData.internalAccessList[0].avatar?.url_etag).to.be.oneOf(['string', undefined])
            expect(fileData.internalAccessList[0].primaryEmail?.address).to.be.a('string')
            expect(fileData.internalAccessList[0].name.givenName).to.be.a('string')
            expect(fileData.internalAccessList[0].name.familyName).to.be.a('string')
            // expect(fileData.internalAccessList[0].permissionId).to.be.a('string')
            // expect(fileData.internalAccessList[0].role).to.be.a('string')
            expect(fileData.internalAccessList[0].riskCount).to.be.a('number')
            // expect(fileData.internalAccessList[0].emails).to.be.an('Array')
          }
          expect(fileData.lastModified).to.be.a('number')
          expect(fileData.lastIngested).to.be.a('number')
          expect(fileData.linkVisibility).to.be.a('string')
          expect(fileData.iconUrl).to.be.a('string')
          expect(fileData.trashed).to.be.a('boolean')
          expect(fileData.sharedToDomains).to.be.an('Array')
          if (fileData.sharedToDomains.length > 0) {
            expect(fileData.sharedToDomains[0].name).to.be.a('string')
            expect(fileData.sharedToDomains[0].permissionId).to.be.a('string')
          }

          let visibilityString = 'No Link Sharing'
          switch (fileData.linkVisibility) {
            case 'none':
            case 'group':
            case 'user':
              visibilityString = 'No Link Sharing'
              break
            case 'internal':
              visibilityString = 'Internal Link Sharing'
              break
            case 'internal_discoverable':
              visibilityString = 'Internal & Discoverable'
              break
            case 'external':
              visibilityString = 'External Link Sharing'
              break
            case 'external_discoverable':
              visibilityString = 'External & Discoverable'
              break
            case 'unknown':
              visibilityString = 'Unknown'
              break
            default:
              throw new Error(`Link visibility can never be ${fileData.linkVisibility}`)
          }

          cy.get('.FileGridHeader__permission-info span.VisibilityPill:eq(0)').should('have.text', visibilityString)
        })
      })
  })
})
