import React from 'react'
import UI_STRINGS from 'util/ui-strings'
import TooltipIp from 'components/elements/TooltipIp'
import { camelCaseToTitleCase, snakeCaseToTitleCase } from 'util/helpers'
import './EventDescriptionCell.scss'

export type EventData = {
  eventName: string
  targetPeople: IPerson[]
  membershipChangeType: string
  sourceFolderTitle: string
  destinationFolderTitle: string
  oldVisibility: string
  newVisibility: string
  oldValue: string
  newValue: string
  ipAddress: string
}

export interface EventDescriptionCellProps {
  fileEvent: IFileEvent
}

// different platforms have different event name format, gsuite is snake case, o365 is camel case
const makeSentence = (phrase: string): string => {
  if (phrase.includes('_')) {
    return snakeCaseToTitleCase(phrase)
  } else {
    return camelCaseToTitleCase(phrase)
  }
}

export const descriptionText = (value: EventData) => {
  const {
    eventName,
    targetPeople,
    membershipChangeType,
    sourceFolderTitle,
    destinationFolderTitle,
    oldVisibility,
    newVisibility,
    oldValue,
    newValue
  } = value

  let description = eventName
  const target = targetPeople.length > 0 ? targetPeople[0].primaryEmail?.address ?? '' : ''
  switch (eventName as FileEventName) {
    case 'team_drive_membership_change':
      description = `${target} ${membershipChangeType}`
      break
    case 'add_to_folder':
      description = UI_STRINGS.SPOTLIGHT.FILE_ADDED_TO_DESTINATION_FOLDER(destinationFolderTitle)
      break
    case 'rename':
      description = UI_STRINGS.SPOTLIGHT.RENAME_FROM_OLD_NAME_TO_NEW_NAME(oldValue, newValue)
      break
    case 'move':
      description = UI_STRINGS.SPOTLIGHT.FILE_MOVD_FROM_SRC_TO_DEST(sourceFolderTitle, destinationFolderTitle)
      break
    case 'change_user_access':
      description = UI_STRINGS.SPOTLIGHT.CHANGE_USER_ACCESS(oldValue, newValue)
      break
    case 'change_document_access_scope':
      description = UI_STRINGS.SPOTLIGHT.CHANGE_DOCUMENT_ACCESS_SCOPE(oldVisibility, oldValue, newVisibility, newValue)
      break
    default:
      description = makeSentence(eventName)
  }
  return description
}

export const EventDescriptionCell: React.FC<EventDescriptionCellProps> = ({ fileEvent }) => {
  const description = descriptionText(fileEvent)
  return (
    <div className='SingleFileCell EventDescriptionCell'>
      {description}
      <div className='EventDescriptionCell__ipContainer'>
        <TooltipIp ipAddress={fileEvent.ipAddress} />
      </div>
    </div>
  )
}

export default EventDescriptionCell
