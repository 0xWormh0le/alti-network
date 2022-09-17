import React from 'react'
import { Link } from 'react-router-dom'

import Person from 'models/Person'
// import AppFileIndicator from 'components/elements/AppFileIndicator'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { modalBasePath } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import FileIcon from 'components/elements/FileIcon'
import './DashboardFileInfo.scss'

export interface DashboardFileInfoProps {
  file: IFile
}

const ownerString = UI_STRINGS.DASHBOARD.OWNER + ': '

export const DashboardFileInfo: React.FC<DashboardFileInfoProps> = ({ file }) => {
  const creator = new Person(file.createdBy)
  const { fileName, mimeType, iconUrl, webLink } = file
  const { primaryEmail } = creator

  return (
    <div className='DashboardFileInfo'>
      {iconUrl && (
        <Link to={{ pathname: webLink }} target='_blank' rel='noopener noreferrer'>
          <FileIcon mimeType={mimeType} iconUrl={iconUrl} className='DashboardFileInfo__icon' />
        </Link>
      )}
      <div className='DashboardFileInfo__text'>
        <Typography variant={TypographyVariant.LABEL} component='div' className='DashboardFileInfo__filename'>
          {fileName}
        </Typography>
        <Typography variant={TypographyVariant.BODY} component='div' className='DashboardFileInfo__email'>
          {ownerString}
          {primaryEmail ? (
            <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(primaryEmail?.address ?? '')}`}>
              {primaryEmail?.address}
            </Link>
          ) : (
            UI_STRINGS.DASHBOARD.UNKNOWN
          )}
        </Typography>
      </div>
    </div>
  )
}

export default DashboardFileInfo
