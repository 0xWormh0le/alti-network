const KEY_PREFIX = 'flavius'
const allowedTypes = ['string', 'int', 'float', 'bigint', 'boolean', 'object']

// =========================== Internal Storage Utils ============================ //

const createKey = (key: string) => {
  return `${KEY_PREFIX}__${key}`
}

const prepareDataForWriting = (data: any, type: AllowedType) => {
  switch (type) {
    case 'string':
      return data
    default:
      return JSON.stringify(data)
  }
}

const prepareDataForReading = (data: any, type: AllowedType) => {
  switch (type) {
    case 'bigint':
    case 'int':
      return Number.parseInt(data, 10)
    case 'float':
      return Number.parseFloat(data)
    case 'object':
    case 'boolean':
      return JSON.parse(data)
    default:
      return data
  }
}

export const getNumberType = (data: any): 'boolean' | 'bigint' | 'float' | 'int' => {
  const typeString = typeof data

  return typeString === 'boolean' ? 'boolean' : typeString === 'bigint' ? 'bigint' : data % 1 === 0 ? 'int' : 'float'
}

// ========================= Base External Storage Utils ========================= //

export const retrieveFromStorage = <T = unknown>(key: string): T | null => {
  const dataString = localStorage.getItem(createKey(key))
  if (!dataString) return null
  const storageObject: StorageObject = JSON.parse(dataString)

  const data = prepareDataForReading(storageObject.data, storageObject.dataType)

  return data
}

export const storeInStorage = (key: string, data: Primitive | { [k: string]: any }) => {
  const type: string = isNaN(data as any) ? typeof data : getNumberType(data as bigint | number)

  if (!allowedTypes.includes(type)) throw new Error(`Can not store data of type ${type}`)

  const storedObject: StorageObject = {
    dataType: type as AllowedType,
    data: prepareDataForWriting(data, type as AllowedType)
  }

  localStorage.setItem(createKey(key), JSON.stringify(storedObject))
}

export const clearFromStorage = (key: string) => {
  localStorage.removeItem(createKey(key))
}

// ====================================== Hooks ================================== //

export const useStorage = <T = unknown>(key: string): [T | null, (data: T) => void] => {
  const data = retrieveFromStorage<T>(key)
  return [data, (newData: T) => storeInStorage(key, newData)]
}
