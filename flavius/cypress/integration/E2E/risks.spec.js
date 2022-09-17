/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'

context('Risks', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST)
      .login()
      .server()
      // Click the side navigaition to get to Risks
      .get(':nth-child(2) > .Sidebar__link')
      .click()
  })

  it('Loads Risk Endpoint and Navigates to last page', () => {
    cy.route('GET', `${BASE_URIS.API}/risks*`)
      .as('getRisks')
      .wait('@getRisks')
      .then((riskResponse) => {
        const riskData = riskResponse.response.body
        const { pageCount, orderBy } = riskData

        expect(orderBy).to.equal('datetime')

        if (pageCount > 5) {
          // Navigate to last page we expect to be able to paginate to
          cy.route('GET', `${BASE_URIS.API}/risks*`)
            .as('getRisksPaginated')
            .get('.PageNumberInput__input')
            .type(`${pageCount}`)
            .get('.PageNumberInput > .Button')
            .click()
            .wait('@getRisksPaginated')
            .then((riskResponse) => {
              const riskData = riskResponse.response.body
              expect(riskData.pageNumber).to.equal(pageCount)
            })
        } else if (pageCount > 1) {
          cy.route('GET', `${BASE_URIS.API}/risks*`)
            .as('getRisksPaginated')
            .get(`.PaginationItem--number:nth-child(${pageCount + 1})`)
            .click()
            .wait('@getRisksPaginated')
            .then((riskResponse) => {
              const riskData = riskResponse.response.body
              expect(riskData.pageNumber).to.equal(pageCount)
            })
        }

        cy.route('Get', `${BASE_URIS.API}/risks*`)
          .as('select-microsoft356')
          .get('.dropdown-select-row')
          .click()
          .get('.dropdown-select-dropdown > .dropdown-item-row:nth-child(1) input')
          .click()
          .get('.dropdown-select-dropdown button')
          .click()
          .wait('@select-microsoft356')
          .then((riskResponse) => {
            const risks = riskResponse.response.body.risks
            console.log(risks.filter((item) => item.platformId === 'o365').length)
            if (risks.length > 0) {
              expect(risks.filter((item) => item.platformId === 'o365').length).to.equal(risks.length)

              cy.route('Get', `${BASE_URIS.API}/files?risk-id=*`)
                .as('getO365')
                .get(`.griddle-table-body tr:nth-child(1) a.FileCell__link`)
                .click()
                .wait('@getO365')
                .then((o365Response) => {
                  const filesData = o365Response.response.body.files
                    ? o365Response.response.body.files
                    : o365Response.response.body
                  if (filesData.length > 0) {
                    expect(filesData.filter((item) => item.platformId === 'o365').length).to.equal(filesData.length)
                  }
                })
                .get('.Actionbar__close')
                .click()
            }
          })

        cy.route('Get', `${BASE_URIS.API}/risks*`)
          .as('select-google-workspace')
          .get('.dropdown-select-row')
          .click()
          .get('.dropdown-select-dropdown > .dropdown-item-row:nth-child(1) input')
          .click()
          .get('.dropdown-select-dropdown > .dropdown-item-row:nth-child(2) input')
          .click()
          .get('.dropdown-select-dropdown button')
          .click()
          .wait('@select-google-workspace')
          .then((riskResponse) => {
            const risks = riskResponse.response.body.risks
            console.log(risks.filter((item) => item.platformId === 'gsuite').length)
            if (risks.length > 0) {
              expect(risks.filter((item) => item.platformId === 'gsuite').length).to.equal(risks.length)

              cy.route('Get', `*`)
                .as('getGsuite')
                .get(`.griddle-table-body tr:nth-child(1) a.FileCell__link`)
                .click()
                .wait('@getGsuite')
                .then((gsuiteResponse) => {
                  const filesData = gsuiteResponse.response.body
                  if (filesData) {
                    expect(filesData.platformId).to.equal('gsuite')
                  }
                })
                .get('.Actionbar__close')
                .click()
            }
          })
      })
  })
})
