/// <reference types="cypress" />
import { RISK_TYPE_IDS, BASE_URIS } from '../../utils/config'
const { MANY_DOWNLOADS_BY_APP_ID } = RISK_TYPE_IDS

context('Spotlight', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST).login().server()
  })

  it('Loads Risk Endpoint and Open spotlight', () => {
    VerifySpotlight()
  })
})

const VerifySpotlight = () => {
  cy.route('GET', `${BASE_URIS.API}/risks/stats`)
    .as('getStats')
    .wait('@getStats')
    .then((response) => {
      cy.get('.DashboardCards__card:nth-child(2)').click()
      cy.get('.RiskTypesList__show-all-button').click()
      cy.route('GET', `${BASE_URIS.API}/risks*`)
        .as('getRisks')
        .wait('@getRisks')
        .then((riskResponse) => {
          const riskData = riskResponse.response.body
          const { riskTypeIds, risks } = riskData
          if (risks.length) {
            expect(risks).be.an('Array')
            const returnedRisks = risks.reduce((foundRiskTypeIds, currentRisk) => {
              const { riskTypeId } = currentRisk
              if (foundRiskTypeIds.indexOf(riskTypeId) === -1) {
                foundRiskTypeIds.push(riskTypeId)
              } else {
              }
              return foundRiskTypeIds
            }, [])

            // Check for 3010 Risk, if we have it, proceed with checking the links in the first result
            const firstManyDownloadsRiskIndex = risks.findIndex((el) => el.riskTypeId === MANY_DOWNLOADS_BY_APP_ID)

            if (firstManyDownloadsRiskIndex > -1) {
              returnedRisks.forEach((returnedRiskId) =>
                expect(riskTypeIds.indexOf(returnedRiskId)).to.be.greaterThan(-1)
              )

              const currentRisk = risks[firstManyDownloadsRiskIndex]
              // grab the text of the risk creator email, then find the link containing it and click on that
              expect(currentRisk.app).to.equal('GDrive')
              expect(currentRisk.riskTypeId).to.equal(MANY_DOWNLOADS_BY_APP_ID)
              // Open spotlight
              cy.get('.Table__row:nth-child(' + (firstManyDownloadsRiskIndex + 1) + ')  .RiskDescriptionCell a')
                .contains(currentRisk.creator.primaryEmail?.address)
                .click()
              cy.route('GET', `${BASE_URIS.API}/person/*`).as('getPersonForSpotlight')
              cy.route('GET', `${BASE_URIS.API}/person/*/stats`).as('getStatsForSpotlight')

              cy.wait('@getPersonForSpotlight').then((personResponse) => {
                const personData = personResponse.response.body
                cy.checkFullPerson(personData)
              })

              cy.wait('@getStatsForSpotlight').then((statsResponse) => {
                const statsData = statsResponse.response.body
                const { labels, series } = statsData
                expect(labels).to.be.an('Array')
                const {
                  allActivity,
                  atRiskFilesOwned,
                  collaborators,
                  appDownloads,
                  filesSharedBy,
                  filesSharedWith,
                  risks,
                  risksCreated
                } = series
                const len = 12 | 13
                expect(allActivity).to.be.an('Array')
                expect(allActivity).to.have.lengthOf(len)
                expect(atRiskFilesOwned).to.be.an('Array')
                expect(atRiskFilesOwned).to.have.lengthOf(len)
                expect(collaborators).to.be.an('Array')
                expect(collaborators).to.have.lengthOf(len)
                expect(appDownloads).to.be.an('Array')
                expect(appDownloads).to.have.lengthOf(len)
                expect(filesSharedBy).to.be.an('Array')
                expect(filesSharedBy).to.have.lengthOf(len)
                expect(filesSharedWith).to.be.an('Array')
                expect(filesSharedWith).to.have.lengthOf(len)
                expect(risks).to.be.an('Array')
                expect(risks).to.have.lengthOf(len)
                expect(risksCreated).to.be.an('Array')
                expect(risksCreated).to.have.lengthOf(len)

                cy.route('GET', `${BASE_URIS.API}/files?person-id=*`).as('getFilesAccessibleForSpotlight')
                cy.get('.SpotlightGridNav__group:nth-child(2)>nav:nth-of-type(1)').click()
                cy.wait('@getFilesAccessibleForSpotlight').then((filesResponse) => {
                  const { files, ...pagination } = filesResponse.response.body
                  cy.checkPagination(
                    pagination,
                    {
                      orderBy: 'lastModified'
                    },
                    {
                      wrapper: '.Spotlight'
                    }
                  )
                  expect(files).to.be.an('Array')
                  cy.checkFiles(files)
                })

                cy.route('GET', `${BASE_URIS.API}/files?owner-id=*`).as('getFilesOwnedForSpotlight')
                cy.get('.SpotlightGridNav__group:nth-child(2)>nav:nth-of-type(2)').click()
                cy.wait('@getFilesOwnedForSpotlight').then((filesResponse) => {
                  const { files, ...pagination } = filesResponse.response.body
                  cy.checkPagination(
                    pagination,
                    {
                      orderBy: 'lastModified'
                    },
                    {
                      wrapper: '.Spotlight'
                    }
                  )
                  expect(files).to.be.an('Array')
                  cy.checkFiles(files)
                })

                cy.route('GET', `${BASE_URIS.API}/person/*/events?event-type=sharedWith*`).as('getReceivedForSpotlight')
                cy.get('.SpotlightGridNav__group:nth-child(2)>nav:nth-of-type(3)').click()
                cy.wait('@getReceivedForSpotlight').then((filesResponse) => {
                  const { eventType, events, ...pagination } = filesResponse.response.body
                  expect(eventType).to.equal('sharedWith')
                  cy.checkPagination(
                    pagination,
                    {},
                    {
                      wrapper: '.Spotlight'
                    }
                  )
                  cy.checkEvents(events)
                })

                // cy.route('GET', `${BASE_URIS.API}/person/*/events?event-type=sharedBy*`).as('getSharedFilesForSpotlight')
                // cy.get('.SpotlightGridNav__group:nth-child(2)>nav:nth-of-type(2)').click()
                // cy.wait('@getSharedFilesForSpotlight').then((filesResponse) => {
                //   const { eventType, events, ...pagination } = filesResponse.response.body
                //   expect(eventType).to.equal('sharedBy')
                //   cy.checkPagination(
                //     pagination,
                //     {},
                //     {
                //       wrapper: '.Spotlight'
                //     }
                //   )
                //   cy.checkEvents(events)
                // })

                cy.route('GET', `${BASE_URIS.API}/person/*/events?event-type=personDownloads*`).as(
                  'getFileDownloadsForSpotlight'
                )
                cy.get('.SpotlightGridNav__group:nth-child(3)>nav:nth-of-type(1)').click()
                cy.wait('@getFileDownloadsForSpotlight').then((filesResponse) => {
                  const { eventType, events, ...pagination } = filesResponse.response.body
                  expect(eventType).to.equal('personDownloads')

                  cy.checkPagination(
                    pagination,
                    {},
                    {
                      wrapper: '.Spotlight'
                    }
                  )
                  cy.checkEvents(events)
                })

                cy.route('GET', `${BASE_URIS.API}/person/*/events?event-type=appDownloads*`).as(
                  'getAppFileDownloadsForSpotlight'
                )
                cy.get('.SpotlightGridNav__group:nth-child(3)>nav:nth-of-type(2)').click()
                cy.wait('@getAppFileDownloadsForSpotlight').then((filesResponse) => {
                  const { eventType, events, ...pagination } = filesResponse.response.body
                  expect(eventType).to.equal('appDownloads')

                  cy.checkPagination(
                    pagination,
                    {},
                    {
                      wrapper: '.Spotlight'
                    }
                  )
                  cy.checkEvents(events)
                })

                // cy.route('GET', `${BASE_URIS.API}/person/*/events?event-type=added*`).as(
                //   'getCollaboratorAddsForSpotlight'
                // )
                // cy.get('.SpotlightGridNav__group:nth-child(3)>nav:nth-of-type(3)').click()
                // cy.wait('@getCollaboratorAddsForSpotlight').then((filesResponse) => {
                //   const { eventType, events, ...pagination } = filesResponse.response.body
                //   expect(eventType).to.equal('added')

                //   cy.checkPagination(
                //     pagination,
                //     {},
                //     {
                //       wrapper: '.Spotlight'
                //     }
                //   )
                //   cy.checkEvents(events)
                // })

                cy.route('GET', `${BASE_URIS.API}/person/*/events*`).as('getAllFileEventsForSpotlight')
                cy.get('.SpotlightGridNav__group:nth-child(3)>nav:nth-of-type(4)').click()
                cy.wait('@getAllFileEventsForSpotlight').then((filesResponse) => {
                  const { eventType, events, ...pagination } = filesResponse.response.body
                  cy.checkPagination(
                    pagination,
                    {},
                    {
                      wrapper: '.Spotlight'
                    }
                  )
                  cy.checkEvents(events)
                })
              })
            }
          }
        })
    })
}

export default VerifySpotlight

// Tests exporting all risks to CSV using the 'Export All' button on the Risks page
// it('Exports All Risks', () => {
//   cy.route('GET', `${BASE_URIS.api}/risks*`).as('getRisks')
//   .wait('@getRisks').then(riskResponse => {
//     const riskData = riskResponse.response.body
//     const { riskCount } = riskData
//     cy.route('GET', `${BASE_URIS.api}/risks*`).as('getAllRisks')
//     cy.get('.Table__export-button').click()
//     const pages = Math.ceil(riskCount / 4000)

//     // Wait list is a list of @getAllRisk aliases equal to the number
//     // of requests required to complete the csv export
//     const waitList = []
//     for (let i = 0; i < pages; i++) {
//       waitList.push('@getAllRisks')
//     }
//     cy.wait(waitList).then(() => {
//       const fileName = `Altitude_Export_n_${Cypress.moment().format('DD-MM-YYYY_HH-mm-ss')}`
//       // TODO: set path as env var
//       cy.readFile(`/Users/joe/Downloads/${fileName}.csv`).should('be.a', 'string')
//     })
//   })
// })
