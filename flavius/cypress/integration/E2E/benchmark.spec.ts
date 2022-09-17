/// <reference types="cypress" />
import { BASE_URIS } from '../../utils/config'

type BenchmarkResult = {
  avg: number
  min: number
  max: number
  note?: string
}
const file: { [x: string]: BenchmarkResult } = {}

const logToFile = (domain: string, result: BenchmarkResult | null) => {
  file[domain] = result
}

type BenchmarkTestFunction = () => Promise<number>

const benchmarkGen = (
  uriKey: string,
  apiUrl: string | RegExp,
  buttonSelector?: () => Cypress.Chainable<JQuery<HTMLButtonElement>>,
  exportApiUrl?: string
) =>
  new Promise<number>((resolve) => {
    //@ts-ignore
    cy.visit(BASE_URIS.HOST).server().login()
    cy.route('GET', apiUrl).as(`apiCall`)

    cy.url().should('eq', `${BASE_URIS.HOST}/dashboard`)

    cy.fixture('benchmark-uris.json').then((uris) => {
      const url = `${BASE_URIS.HOST}/${encodeURI(uris[uriKey])}`
      cy.visit(url)
      cy.url().should('eq', url)
      let startTime = new Date()
      cy.wait(`@apiCall`, {
        responseTimeout: 30000
      }).then(() => {
        if (!buttonSelector) {
          const endTime = new Date()
          const duration = endTime.getTime() - startTime.getTime()
          resolve(duration)
        } else {
          cy.route('GET', exportApiUrl).as('exportApiCall')
          buttonSelector().scrollIntoView().click({ force: true })

          startTime = new Date()
          cy.wait('@exportApiCall').then(() => {
            const endTime = new Date()
            const duration = endTime.getTime() - startTime.getTime()
            resolve(duration)
          })
        }
      })
    })
  })

const benchmarkContext = (cb: BenchmarkTestFunction, domainKey: string) => {
  const NUM_BENCHMARK_TESTS = Cypress.env('NUM_BENCHMARK_TESTS') || 5
  const results = new Array(NUM_BENCHMARK_TESTS)

  Array.from(results.keys()).forEach((r) => {
    it(`${domainKey} attempt ${r}`, () => {
      cy.wrap(cb()).then((duration) => {
        results[r] = duration
        cy.log(`duration: ${duration}`)
        cy.visit(`${BASE_URIS.HOST}/logout`)
        cy.url().should('eq', `${BASE_URIS.HOST}/logout`)
        cy.url().should('eq', `${BASE_URIS.HOST}/login`)
      })
    })
  })

  it(`Logs results for ${domainKey}`, () => {
    cy.wrap(
      new Promise<number>((resolve) => {
        if (results?.length === 0 || undefined) {
          logToFile(domainKey, null)
          return
        }
        results.sort((a, b) => a - b)

        const sum = results.reduce((pv, cv) => {
          return pv + cv
        }, 0)

        const avg = sum / NUM_BENCHMARK_TESTS
        const min = results[0]
        const max = results[NUM_BENCHMARK_TESTS - 1]

        logToFile(domainKey, { avg, min, max })
        resolve(1)
      })
    )
  })
}

const finalizeFile = () => {
  const content = Object.entries(file).reduce((fullContent, [domain, { avg, max, min }]) => {
    return `${fullContent}\n${domain},${avg || 'failed'},${min || 'failed'},${max || 'failed'}`
  }, 'domain,avg(ms),min(ms),max(ms)')
  cy.writeFile(`benchmark-results-${new Date().getTime()}.csv`, content)
}

context('Benchmark File Export All', () => {
  benchmarkContext(
    () =>
      benchmarkGen(
        `fileExportAll`,
        `${BASE_URIS.API}/files**`,
        () => cy.get('.SpotlightGrid').find('button').contains('Export All'),
        `${BASE_URIS.API}/files**`
      ),
    'File Export All'
  )
})

context('Benchmark Risks 1020', () => {
  benchmarkContext(() => benchmarkGen('risks1020', `${BASE_URIS.API}/risks?*`), 'Risks 1020')
})

context('Benchmark Risks 2000', () => {
  benchmarkContext(() => benchmarkGen('risks2000', `${BASE_URIS.API}/risks?*`), 'Risks 2000')
})

context('Benchmark Risks 3010', () => {
  benchmarkContext(() => benchmarkGen('risks3010', `${BASE_URIS.API}/risks?*`), 'Risks 3010')
})

context('Benchmark Risks General', () => {
  benchmarkContext(() => benchmarkGen('risksGeneral', `${BASE_URIS.API}/risks?*`), 'Risks General')
})

context('Benchmark Files', () => {
  benchmarkContext(() => benchmarkGen('files', `${BASE_URIS.API}/files*`), 'Files')
})

context('Benchmark Spotlight', () => {
  benchmarkContext(() => benchmarkGen('spotlight', `${BASE_URIS.API}/risks?*person-id=*`), 'Spotlight')
})

context('Benchmark File', () => {
  benchmarkContext(() => benchmarkGen('file', `${BASE_URIS.API}/file/*`), 'File')
})

context('Benchmark Dashboard', () => {
  benchmarkContext(() => benchmarkGen('dashboard', `${BASE_URIS.API}/risks/tiles?category=*`), 'Dashboard')
})

context('Benchmark Risks Export All', () => {
  benchmarkContext(
    () =>
      benchmarkGen(
        'risksExportAll',
        `${BASE_URIS.API}/risks?*`,
        () => cy.get('button').contains('Export All'),
        `${BASE_URIS.API}/risks?*`
      ),
    'Risks Export All'
  )
})

context('Benchmark Search', () => {
  benchmarkContext(() => benchmarkGen(`search`, `${BASE_URIS.API}/people`), 'Search')
})

context('Benchmark Spotlight Downloads', () => {
  benchmarkContext(() => benchmarkGen('spotlightDownloads', '**/person/*/events?*'), 'Spotlight Downloads')
})

context('Benchmark Spotlight Downloads Export All', () => {
  benchmarkContext(
    () =>
      benchmarkGen(
        'spotlightDownloads',
        '**/person/*/events?*',
        () => cy.get('.SpotlightGrid').find('button').contains('Export All'),
        '**/person/*/events?*'
      ),
    'Spotlight Downloads Export All'
  )
})

context('Finalizes Results', () => {
  it('Does that', () => {
    cy.log(
      Object.entries(file).reduce((pv, [domain, result]) => {
        return pv + `${domain}:avg:${result.avg}`
      }, '')
    )
    finalizeFile()
  })
})
