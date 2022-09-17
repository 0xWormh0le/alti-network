/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'

const AddThenDeletePhrase = (phrase, exact, initialSensitivePhraseCount) => {
  cy.route('POST', `${BASE_URIS.API}/sensitive-phrase*`)
    .as('postSensitivePhrase')
    .get('.FormControl')
    .type(phrase)
    // .get(`input[value="${exact}]"`)
    .get(`[type="radio"][value="${exact}"]`)
    .check({ force: true })
    .get('.NewSensitivePhrase__button')
    .click()
    .wait(1000)
    .get('.ModalConfirmationDialog__button:nth-child(1)')
    .click()
    .wait('@getSensitivePhrases')
    .then((sensitivePhrasesUpdateResponse) => {
      const sensitivePhrasesUpdateData = sensitivePhrasesUpdateResponse.response.body
      const postedExactPhraseData = sensitivePhrasesUpdateData.filter((el) => el.phrase === phrase)
      expect(postedExactPhraseData[0].exact).to.equal(exact)
      expect(sensitivePhrasesUpdateData.length).to.equal(initialSensitivePhraseCount + 1)
    })
    .wait('@postSensitivePhrase')
    .then((sensitivePhrasePostResponse) => {
      const sensitivePhraseData = sensitivePhrasePostResponse.response.body
      expect(sensitivePhraseData).to.equal(`Successfully added ${phrase}`)
      cy.get('.ModalConfirmationDialog__button')
        .click()
        .route('DELETE', `${BASE_URIS.API}/sensitive-phrase*`)
        .as('deleteSensitivePhrase')
        .get('.PhraseTable')
        .contains('tr', phrase)
        .find('button')
        .click()
        .wait(1000)
        .get('.ModalConfirmationDialog__button:nth-child(1)')
        .click()
        .wait(['@deleteSensitivePhrase', '@getSensitivePhrases'])
        .then((responses) => {
          cy.get('.ModalConfirmationDialog__button').click()
          expect(responses[1].response.body.length).to.equal(initialSensitivePhraseCount)
        })
    })
}

context('Risk Settings', () => {
  beforeEach(() => {
    cy.visit(BASE_URIS.HOST)
      .login()
      .server()
      // Click the side navigaition to get to People search
      .get(':nth-child(4) > .Sidebar__link')
      .click()
  })

  it('Fetches, creates, and deletes Sensitive Phrases', () => {
    cy.route('GET', `${BASE_URIS.API}/sensitive-phrases`)
      .as('getSensitivePhrases')
      .wait('@getSensitivePhrases')
      .then((sensitivePhrasesResponse) => {
        const sensitivePhrasesData = sensitivePhrasesResponse.response.body
        if (sensitivePhrasesData.length === 0) {
          return
        }
        expect(sensitivePhrasesData[0].exact).to.be.a('boolean')
        const initialSensitivePhraseCount = sensitivePhrasesData.length
        const testPhrase = `e2e-runner:${Cypress.moment().format('DD-MM-YYYY_HH-mm-ss')}`
        const partialTestPhrase = `e2e-runner:${Cypress.moment().format('DD-MM-YYYY_HH-mm-ss')} as partial`

        AddThenDeletePhrase(testPhrase, false, initialSensitivePhraseCount)
        AddThenDeletePhrase(partialTestPhrase, false, initialSensitivePhraseCount)
      })
  })
})
