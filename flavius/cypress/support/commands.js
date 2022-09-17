import * as Sentry from '@sentry/browser'
import { RISK_TYPE_IDS } from '../utils/config'
const { MANY_DOWNLOADS_BY_APP_ID } = RISK_TYPE_IDS
import { version } from '../../package.json'

Cypress.on('fail', (error, runnable) => {
  console.info('we failed!!', error, runnable)
  const errorMessage = `Heartbeat Error detected in spec '${runnable.parent.title}': ${error.message}`
  Sentry.init({
    dsn: 'https://4345e62a3abc48049f9965ccc17ed310@sentry.io/1306610',
    environment: Cypress.env('REACT_APP_STAGE'),
    release: `flavius@${version}`,
    integrations: [
      new Sentry.Integrations.Breadcrumbs({
        console: Cypress.env('REACT_APP_STAGE') === 'production',
        message: errorMessage
      })
    ]
  })
  const err = new Error(errorMessage)
  Sentry.withScope((scope) => {
    scope.setExtra('stacktrace', error.stack)
    scope.setExtra('codeframe', error.codeFrame)
    Sentry.captureException(err)
  })
  throw err
})

const checkMinimumValidPerson = (person) => {
  if (person) {
    expect(person.accessCount).to.be.a('number')
    expect(person.primaryEmail?.address).to.be.a('string')
    expect(person.hasOwnProperty('name')).to.be.true
  }
}

const checkMinimumFile = (file) => {
  const {
    createdAt,
    createdBy,
    externalAccessCount,
    externalAccessList,
    fileId,
    fileName,
    internalAccessCount,
    internalAccessList,
    lastModified,
    linkVisibility,
    lastIngested,
    iconUrl
  } = file
  if (createdAt) {
    expect(createdAt).to.be.a('number')
  }
  if (iconUrl) {
    expect(iconUrl).to.be.a('string')
  }
  expect(externalAccessCount).to.be.a('number')
  expect(externalAccessList).to.be.an('Array')
  // todo: uncomment. id and name is currently null
  expect(fileId).to.be.a('string')
  expect(fileName).to.be.a('string')
  expect(internalAccessCount).to.be.a('number')
  expect(internalAccessList).to.be.an('Array')
  if (lastModified) {
    expect(lastModified).to.be.a('number')
  }
  if (lastIngested) {
    expect(lastIngested).to.be.a('number')
  }
  expect(linkVisibility).to.be.a('string')
}

const checkMinimumFiles = (files) => checkMinimumFile(files[randomIndex(files)])

const randomIndex = (array) => Math.floor(Math.random() * array.length)

Cypress.Commands.add('login', () => {
  cy.get('#email').type('bobbie@thoughtlabs.io')
  cy.get('#password').type(Cypress.env('CYPRESS_USER_PASSWORD'))
  cy.get('.Login__button').click()
})

Cypress.Commands.add('checkMinimumValidPerson', checkMinimumValidPerson)

Cypress.Commands.add('checkFullPerson', (person) => {
  checkMinimumValidPerson(person)
  expect(person.externalCount).to.be.a('number')
  expect(person.userKind).to.be.a('number')
  expect(person.internalCount).to.be.a('number')
})

Cypress.Commands.add('checkFiles', (files) => {
  expect(files).to.be.an('Array')
  checkMinimumFiles(files)
})

Cypress.Commands.add('checkRisks', (risks, filteredRiskTypeId) => {
  expect(risks).to.be.an('Array')
  const randomRiskIndex = randomIndex(risks)
  const randomTestRisk = risks[randomRiskIndex]
  expect(randomTestRisk.platformId).to.be.a('string')
  expect(randomTestRisk.datetime).to.be.a('number')
  expect(randomTestRisk.fileCount).to.be.a('number')
  expect(randomTestRisk.hasOwnProperty('fileId')).to.be.true
  expect(randomTestRisk.hasOwnProperty('fileName')).to.be.true
  expect(randomTestRisk.riskDescription).to.be.a('string')
  expect(randomTestRisk.riskId).to.be.a('string')
  expect(randomTestRisk.riskTarget).to.be.an('Array')
  if (filteredRiskTypeId) {
    expect(randomTestRisk.riskTypeId).to.equal(filteredRiskTypeId)
  }
  expect(randomTestRisk.severity).to.be.a('number')

  checkMinimumValidPerson(randomTestRisk.creator)
  checkMinimumValidPerson(randomTestRisk.owner)

  if (filteredRiskTypeId === MANY_DOWNLOADS_BY_APP_ID) {
    expect(randomTestRisk.plugin.id).to.be.a('string')
    // todo: uncomment. name is currently null
    expect(randomTestRisk.plugin.name).to.be.a('string')
  }
})

Cypress.Commands.add('checkPagination', (paginationResponse, overrides, extra) => {
  expect(paginationResponse.orderBy).to.equal(
    overrides && overrides.hasOwnProperty('orderBy') ? overrides.orderBy : 'datetime'
  )
  expect(paginationResponse.pageCount).to.be.a('number')
  expect(paginationResponse.pageNumber).to.be.a('number')
  expect(paginationResponse.pageSize).to.be.a('number')
  expect(paginationResponse.sort).to.equal(overrides && overrides.hasOwnProperty('sort') ? overrides.sort : 'DESC')

  if (extra) {
    const { wrapper } = extra
    const { pageCount } = paginationResponse
    if (pageCount > 1) {
      if (pageCount > 5) {
        cy.get(wrapper + ' .PaginationItem--number').should('have.length', 5)
      } else {
        cy.get(wrapper + ' .PaginationItem--number').should('have.length', pageCount)
      }
    }
  }
})

Cypress.Commands.add('checkEvents', (events, filesIsObject) => {
  expect(events).to.be.an('Array')
  const randomEventIndex = randomIndex(events)
  const randomTestEvent = events[randomEventIndex]
  expect(randomTestEvent.datetime).to.be.a('number')
  expect(randomTestEvent.eventDescription).to.be.a('string')
  expect(randomTestEvent.eventId).to.be.a('string')
  expect(randomTestEvent.eventName).to.be.a('string')
  expect(randomTestEvent.targetPeople).to.be.an('Array')
  if (!filesIsObject) {
    expect(randomTestEvent.files).to.be.an('Array')
    const randomFileIndex = randomIndex(randomTestEvent.files)
    checkMinimumFile(randomTestEvent.files[randomFileIndex])
  } else {
    checkMinimumFiles(randomTestEvent.files)
  }
})
