import { getFileActivityTypeLabel } from 'pages/Activity/activityUtils'
import React from 'react'

interface LiteEventDescriptionCellProps {
  eventName: string
}

const LiteEventDescriptionCell: React.FC<LiteEventDescriptionCellProps> = ({ eventName }) => {
  const description = getFileActivityTypeLabel(eventName)
  return <div className='SingleFileCell EventDescriptionCell'>{description}</div>
}

export default LiteEventDescriptionCell
