/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'

context('Files', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST).login().server()
  })

  it('Load Risk Endpoint and Open FilesInspector', () => {
    cy.route('GET', `${BASE_URIS.API}/risks/stats`)
      .as('getStats')
      .wait('@getStats')
      .then(() => {
        cy.get('.DashboardCards__card:nth-child(4)').click()
        cy.get('.RiskTypeRow:first-child .RiskTypesList--actions-column button').click()
        cy.route('GET', `${BASE_URIS.API}/risks*`)
          .as('getRisks')
          .wait('@getRisks')
          .then((riskResponse) => {
            // Open FilesInspector
            const riskData = riskResponse.response.body
            const { risks } = riskData
            if (risks.length > 0 && risks[0].fileCount > 0) {
              cy.route('GET', `${BASE_URIS.API}/files?risk-id=*`).as('getFiles')
              cy.get('.Table__row:nth-child(2) .FileCell a.FileCell__link').click()
              cy.wait('@getFiles').then((filesResponse) => {
                const filesData = filesResponse.response.body
                expect(filesData.riskId).to.be.a('string')
                if (filesData.files.length > 0) {
                  const file = filesData.files[0]
                  expect(file.createdAt).to.be.a('number')
                  expect(file.externalAccessCount).to.be.a('number')
                  expect(file.externalAccessList).to.be.an('Array')
                  expect(file.fileId).to.be.a('string')
                  expect(file.fileName).to.be.a('string')
                  expect(file.internalAccessCount).to.be.a('number')
                  expect(file.internalAccessList).to.be.an('Array')
                  expect(file.lastModified).to.be.a('number')
                  expect(file.linkVisibility).to.be.a('string')

                  if (Object.keys(file.createdBy).length) {
                    expect(file.createdBy.accessCount).to.be.oneOf(['number', undefined])
                    expect(file.createdBy.primaryEmail?.address).to.be.a('string')
                    expect(file.createdBy.name.givenName).to.be.a('string')
                    expect(file.createdBy.name.familyName).to.be.a('string')
                    expect(file.createdBy.altnetId).to.be.a('string')
                    expect(file.createdBy.riskCount).to.be.oneOf(['number', undefined])
                  }
                }

                // test CSV download

                cy.route('GET', `${BASE_URIS.API}/files?risk-id=*`).as('getFilesCSV')
                cy.get('.ModalPage .Files .Table__export-button').click()
                cy.wait('@getFilesCSV').then((response) => {
                  expect(response.status).to.equal(200)
                })
              })
            }
          })
      })
  })
})
