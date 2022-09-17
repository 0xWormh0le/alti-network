import { fillUrl } from 'api/apiClientUtils'

describe('Api Client Utils', () => {
  it('Fills urls', () => {
    const someId = '123foobar'
    const url = '/baseEndpoint/:someId/endpoint'
    const params = {
      someId
    }
    const testUrl = `/baseEndpoint/${someId}/endpoint`

    const filledUrl = fillUrl(url, params)

    expect(filledUrl).toEqual(testUrl)
  })

  it('Fills multiple param urls', () => {
    const someId = '123foobar'
    const someSecondId = 'barbaz'
    const url = '/baseEndpoint/:someId/endpoint/:someSecondId/'
    const params = {
      someId,
      someSecondId
    }
    const testUrl = `/baseEndpoint/${someId}/endpoint/${someSecondId}`

    const filledUrl = fillUrl(url, params)

    expect(filledUrl).toEqual(testUrl)
  })
})
