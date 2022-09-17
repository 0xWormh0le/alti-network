import { clearFromStorage, retrieveFromStorage, storeInStorage } from 'util/storage'

const readWriteTest = (type: string, data: any) => {
  it(`Stores and reads ${type}s successfully`, () => {
    storeInStorage('data', data)
    expect(retrieveFromStorage('data')).toEqual(data)
  })
}

describe('Storage utility', () => {
  it('Clears storage', () => {
    const data = 'Hello world!'
    storeInStorage('data', data)
    clearFromStorage('data')
    expect(retrieveFromStorage('data')).toBeNull()
  })
  readWriteTest('string', 'Hello World')
  readWriteTest('integer', 12)
  readWriteTest('float', 0.2)
  readWriteTest('boolean', false)
  readWriteTest('object', { something: 3, otherThing: 'hello' })
  readWriteTest('complex object', {
    something: 3,
    otherThing: 'hello',
    innerThing: { innerThingArr: [1, 2, 'foo', 'bar', { baz: 12 }] }
  })
  readWriteTest('array', [1, 2, 3, 4])
})
