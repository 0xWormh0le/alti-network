/// <reference types="cypress" />
import { RISK_TYPE_IDS, BASE_URIS } from '../../utils/config'
const { MANY_DOWNLOADS_BY_APP_ID } = RISK_TYPE_IDS

context('AppSpotlight', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST).login().server()
  })

  it('Loads Risk Endpoint and Open AppSpotlight', () => {
    cy.route('GET', `${BASE_URIS.API}/risks/stats`)
      .as('getStats')
      .wait('@getStats')
      .then((response) => {
        cy.get('.DashboardCards__card:nth-child(3)').click()
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
                }
                return foundRiskTypeIds
              }, [])

              // Check for 3010 Risk, if we have it, proceed with checking the links in the first result
              const firstManyDownloadsRiskIndex = risks.findIndex((el) => el.riskTypeId === MANY_DOWNLOADS_BY_APP_ID)
              if (firstManyDownloadsRiskIndex > -1) {
                // Check Risk Type Ids that were allowed in the filter vs actual response
                returnedRisks.forEach((returnedRiskId) =>
                  expect(riskTypeIds.indexOf(returnedRiskId)).to.be.greaterThan(-1)
                )
                const currentRisk = risks[firstManyDownloadsRiskIndex]
                // grab the text of the risk creator email, then find the link containing it and click on that
                expect(currentRisk.platformId).to.equal('gsuite')
                expect(currentRisk.riskTypeId).to.equal(MANY_DOWNLOADS_BY_APP_ID)
                // Open appspotlight
                cy.get('.Table__row:nth-child(' + (firstManyDownloadsRiskIndex + 1) + ') a')
                  .contains(currentRisk.plugin.id)
                  .click()

                cy.route('GET', `${BASE_URIS.API}/application/*`).as('getAppForAppSpotlight')
                cy.route('GET', `${BASE_URIS.API}/application/*/stats`).as('getStatsForAppSpotlight')
                cy.route('GET', `${BASE_URIS.API}/people?application-id=*`).as('getAuthorizedByForAppSpotlight')

                cy.wait('@getAppForAppSpotlight').then((appResponse) => {
                  const appData = appResponse.response.body
                  expect(appData.id).to.be.a('string')
                  expect(appData.grants).to.be.an('Array')
                  expect(appData.imageURI).to.be.a('string')
                  // expect(appData.marketplaceURI).to.be.a('string')
                  expect(appData.name).to.be.a('string')
                  if (appData.grants.length > 0) {
                    expect(appData.grants[0]).to.be.a('string')
                  }
                })

                cy.wait('@getStatsForAppSpotlight').then((statsResponse) => {
                  if (statsResponse.status !== 200) {
                    return
                  }
                  const statsData = statsResponse.response.body
                  const { labels, series, tileInfo } = statsData
                  expect(labels).to.be.an('Array')
                  expect(series.associatedRisks).to.be.an('Array')
                  expect(series.authorizedBy).to.be.an('Array')
                  expect(series.fileDownloads).to.be.an('Array')
                  expect(tileInfo.currentAuthorizedBy).to.be.a('number')
                  expect(tileInfo.currentRisks).to.be.a('number')
                  expect(tileInfo.totalEmails).to.be.a('number')
                  expect(tileInfo.totalSensitive).to.be.a('number')
                  if (series.associatedRisks.length > 0) {
                    expect(series.associatedRisks[0]).to.be.a('number')
                  }
                  if (series.authorizedBy.length > 0) {
                    expect(series.authorizedBy[0]).to.be.a('number')
                  }
                  if (series.fileDownloads.length > 0) {
                    expect(series.fileDownloads[0]).to.be.a('number')
                  }

                  cy.wait('@getAuthorizedByForAppSpotlight').then((peopleResponse) => {
                    const peopleData = peopleResponse.response.body
                    expect(peopleData.applicationId).to.be.a('string')
                    cy.checkPagination(peopleData, { orderBy: undefined })
                    if (peopleData.people.length > 0) {
                      if (peopleData.pageCount > 1) {
                        const pageSizeEst = Math.ceil(tileInfo.currentAuthorizedBy / peopleData.pageSize)
                        expect(peopleData.pageCount).to.equal(pageSizeEst)
                        expect(peopleData.people.length).to.equal(peopleData.pageSize)
                      } else {
                        expect(peopleData.people.length).to.equal(tileInfo.currentAuthorizedBy)
                      }
                      const person = peopleData.people[0]
                      cy.checkMinimumValidPerson(person)
                    }
                  })

                  cy.route('GET', `${BASE_URIS.API}/application/*/events?event-type=download*`).as(
                    'getDownloadsForAppSpotlight'
                  )
                  cy.get('.AppSpotlightGridTabItem__fileDownloads').click()
                  cy.wait('@getDownloadsForAppSpotlight').then((downloadsResponse) => {
                    const downloadsData = downloadsResponse.response.body
                    expect(downloadsData.eventType).to.equal('download')
                    cy.checkPagination(
                      downloadsData,
                      {},
                      {
                        wrapper: '.AppSpotlight'
                      }
                    )
                    // const totalDownloads = series.fileDownloads.reduce((prev, val) => prev + val)
                    // if (downloadsData.pageCount > 1) {
                    //   const pageSizeEst = Math.ceil(totalDownloads / downloadsData.pageSize)
                    //   expect(downloadsData.pageCount).to.equal(pageSizeEst)
                    //   expect(downloadsData.events.length).to.equal(downloadsData.pageSize)
                    // } else {
                    //   expect(downloadsData.events.length).to.equal(totalDownloads)
                    // }
                    // Pass 'filesIsObject' flag since this endpoint does not conform to the API spec.
                    // The spec dictates the files key should contain an array of files, but here we get
                    // a single file for each event's files key.
                    cy.checkEvents(downloadsData.events, true)
                  })

                  cy.route('GET', `${BASE_URIS.API}/risks*`).as('getRisksForAppSpotlight')
                  cy.get('.AppSpotlightGridTabItem__associatedRisks').click()
                  cy.wait('@getRisksForAppSpotlight').then((risksResponse) => {
                    const risksData = risksResponse.response.body
                    expect(risksData.applicationId).to.be.a('string')
                    expect(risksData.riskCount).to.be.a('number')
                    expect(risksData.riskTypeIds).to.be.an('Array')

                    cy.checkPagination(
                      risksData,
                      {},
                      {
                        wrapper: 'AppSpotlight'
                      }
                    )
                    cy.checkRisks(risksData.risks, MANY_DOWNLOADS_BY_APP_ID)
                    if (risksData.risks.length > 0) {
                      if (risksData.pageCount > 1) {
                        const pageSizeEst = Math.ceil(tileInfo.currentRisks / risksData.pageSize)
                        expect(risksData.pageCount).to.equal(pageSizeEst)
                        expect(risksData.risks.length).to.equal(risksData.pageSize)
                      } else {
                        expect(risksData.risks.length).to.equal(tileInfo.currentRisks)
                      }
                    }
                  })
                })
              }
            }
          })
      })
  })
})
