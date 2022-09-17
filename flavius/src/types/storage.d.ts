type AllowedType = 'string' | 'int' | 'float' | 'bigint' | 'boolean' | 'object'

interface StorageObject {
  dataType: AllowedType
  data: string
}
