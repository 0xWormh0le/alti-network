/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'
import { UserKind } from '../../../src/types/common'

context('Dashboard', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST).login().server()
  })

  it('Fetches All Dahboard Endpoints', () => {
    cy.route('GET', `${BASE_URIS.API}/risks/tiles`).as('getTiles')
    cy.route('GET', `${BASE_URIS.API}/risks/stats`).as('getRiskStats')
    cy.route('GET', `${BASE_URIS.API}/company-information/domains`).as('getDomains')

    cy.wait('@getTiles').then((tilesResponse) => {
      const tileData = tilesResponse.response.body

      /*
        Checks response for counts and a file or person where appropriate.
        It does not check all fields of file/person response, but covers key
        pieces of the expected response
      */
      expect(tileData.highestRiskFile.count).to.be.a('number')
      expect(tileData.highestRiskFile.file.fileName).to.be.a('string')
      expect(tileData.mostAtRiskFilesOwned.count).to.be.a('number')
      expect(tileData.mostAtRiskFilesOwned.person.primaryEmail?.address).to.be.a('string')
      expect(tileData.mostExternalAccess.count).to.be.a('number')
      expect(tileData.mostExternalAccess.person.userKind).to.equal(UserKind.person)
      expect(tileData.mostRisksCreated.count).to.be.a('number')
      expect(tileData.mostRisksCreated.person.primaryEmail?.address).to.be.a('string')
    })

    cy.wait('@getRiskStats').then((riskStatsResponse) => {
      const riskStatsData = riskStatsResponse.response.body

      expect(riskStatsData.stats).to.be.an('Array')
      if (riskStatsData.stats.length > 0) {
        expect(riskStatsData.stats[0].count).to.be.a('number')
        expect(riskStatsData.stats[0].riskTypeId).to.be.a('number')
        expect(riskStatsData.stats[0].severity).to.be.a('number')
      }
    })

    cy.wait('@getDomains').then((domainsResponse) => {
      const domainsData = domainsResponse.response.body

      expect(domainsData[0]).to.contain('.')
    })
  })
})
