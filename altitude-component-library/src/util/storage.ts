const localStorageName = 'flavius__local_storage'

export interface LocalStorageType {
  userId?: string
  personSearchHistory?: string[]
}

const defaultStorageObject = {
  userId: 'Unknown User',
  personSearchHistory: [],
}

export function loadData(): LocalStorageType {
  try {
    const data = localStorage.getItem(localStorageName)
    return data ? JSON.parse(data) : defaultStorageObject
  } catch (e) {
    return defaultStorageObject
  }
}

export function saveData(data: LocalStorageType): void {
  const savedData = loadData()
  localStorage.setItem(
    localStorageName,
    JSON.stringify({
      ...savedData,
      ...data,
    })
  )
}

export function clearData(): void {
  localStorage.setItem(localStorageName, '')
}
