interface StorageItems<T> {
  [x: string]: T
}

export interface ILocalStorage<T> {
  localStorageName: string
  data: StorageItems<T>
  loadData: () => StorageItems<T>
  saveItem(key: keyof StorageItems<T>, value: T): void
  getItemByKey(key: keyof StorageItems<T>): T
  clearData(key?: keyof StorageItems<T>): void
}

class LocalStorage<T> implements ILocalStorage<T> {
  localStorageName: string = ''
  data: StorageItems<T>

  constructor(localStorageName: string) {
    this.localStorageName = localStorageName
    this.data = {}
  }

  loadData() {
    const data = localStorage.getItem(this.localStorageName)
    this.data = data ? JSON.parse(data) : {}
    return this.data
  }

  saveItem(key: keyof StorageItems<T>, data: T): void {
    this.loadData()
    localStorage.setItem(
      this.localStorageName,
      JSON.stringify({
        ...this.data,
        ...{ [key]: data },
      })
    )
    this.loadData()
  }

  getItemByKey(key: keyof StorageItems<T>) {
    if (Object.entries(this.data).length === 0) {
      this.loadData()
    }
    return this.data[key]
  }

  clearData(key?: keyof StorageItems<T>): void {
    this.loadData()
    localStorage.setItem(this.localStorageName, '')
    if (key) {
      const newData: StorageItems<T> = {}
      Object.keys(this.data).forEach((k) => {
        if (`${key}` !== k) {
          newData[k] = this.data[k]
        }
      })
      localStorage.setItem(this.localStorageName, JSON.stringify(newData))
      this.data = newData
    }
  }
}

export default LocalStorage
