import { LocalStorageType, saveData, loadData } from 'util/storage'

describe('saveData and loadData', () => {
  it('work correctly', () => {
    const data: LocalStorageType = {
      userId: 'foo@bar.com',
      personSearchHistory: ['history one', 'and', 'two'],
    }

    saveData(data)
    expect(loadData()).toStrictEqual(data)
  })
})
