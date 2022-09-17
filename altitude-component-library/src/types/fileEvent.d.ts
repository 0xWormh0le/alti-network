interface Actor extends FileOwner {
  actorPerson: true
}

interface BaseFileEvent {
  actor: Actor
  datetime: number
  eventName: FileEventName
}

type FileEventName =
  | 'team_drive_membership_change'
  | 'edit'
  | 'download'
  | 'view'
  | 'add_to_folder'
  | 'create'
  | 'rename'
  | 'move'
  | 'trash'
  | 'change_user_access'
  | 'change_document_access_scope'
  | 'change_acl_editors'
  | 'change_document_visibility'
  | 'delete'
  | 'copy'
  | 'remove_from_folder'
  | 'untrash'
  | 'print'
  | 'upload'
  | 'sheets_import_range_access_change'

interface IFileEvent extends BaseFileEvent {
  eventId: string
  eventDescription: string
  ipAddress: string
  membershipChangeType: string
  newValue: string
  newVisibility: string
  oldValue: string
  oldVisibility: string
  sourceFolderTitle: string
  destinationFolderTitle: string
  visibilityChange: string
  targetPeople: Array<IPerson>
}

interface DisplayFileEvent {
  event: IFileEvent
  target?: IPerson
  datetime: number
  actor: IPerson
}
