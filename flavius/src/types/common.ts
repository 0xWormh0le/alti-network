export enum UsageKind {
  personal = 'personal',
  work = 'work'
}

export enum UserKind {
  user = 'user',
  person = 'person',
  serviceAccount = 'serviceAccount'
}

export enum AccessLevel {
  member = 'member',
  manager = 'manager',
  owner = 'owner',
  admin = 'admin'
}

export enum RiskCategoryType {
  SHARING_RISKS = 'Sharings',
  RELATIONSHIP_RISKS = 'Relationships',
  ACTIVITY_RISKS = 'Actions',
  INFORMATIONAL_RISKS = 'Informatives'
}

export enum FileActivityType {
  ACCESS_GRANTED = 'ACCESS_GRANTED',
  CHANGE_FOLDER_PERMISSION = 'CHANGE_FOLDER_PERMISSION',
  CONTENT_ACCESS = 'CONTENT_ACCESS',
  DOWNLOAD = 'DOWNLOAD',
  FILE_WATERMARKED_DOWNLOAD = 'FILE_WATERMARKED_DOWNLOAD',
  ITEM_DOWNLOAD = 'ITEM_DOWNLOAD',
  ITEM_PREVIEW = 'ITEM_PREVIEW',
  ITEM_SHARED = 'ITEM_SHARED',
  ITEM_SHARED_CREATE = 'ITEM_SHARED_CREATE',
  ITEM_SHARED_UPDATE = 'ITEM_SHARED_UPDATE',
  ITEM_SYNC = 'ITEM_SYNC',
  SHARE = 'SHARE'
}

export enum PermissionRole {
  own = 'own',
  read = 'read',
  write = 'write'
}

export enum PermissionShared {
  external = 'external',
  internal = 'internal',
  none = 'none'
}

export enum PermissionType {
  anyone = 'anyone',
  domain = 'domain',
  user = 'user'
}

export enum PermissionItemStatus {
  active = 'ACTIVE',
  pending = 'PENDING',
  removed = 'REMOVED',
  cannotBeRemoved = 'CANNOT_BE_REMOVED'
}

export enum SensitiveContentStatus {
  DETECTION_PENDING = 'pending',
  FOUND_SENSITIVE_CONTENT = 'yes',
  FOUND_NO_SENSITIVE_CONTENT = 'no',
  FAILED_DETECTION = 'failed'
}

export enum FileGridNavType {
  TIMELINE = 'timeline',
  INTERNAL = 'internal',
  EXTERNAL = 'external',
  SENSITIVE = 'sensitive',
  FILES_IN_FOLDER = 'filesInFolder',
  DETAILS = 'details'
}
