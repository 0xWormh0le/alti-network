import Tooltip from 'components/widgets/Tooltip'
import React from 'react'
import { Link } from 'react-router-dom'
import { ellipsify, modalBasePath } from 'util/helpers'
import FileIcon from '../FileIcon'
import { MAX_LENGTH } from './FileCell'

interface LiteFileCellProps {
  file: LiteFile
  platformId: string
}

const LiteFileCell: React.FC<LiteFileCellProps> = ({ file, platformId }) => {
  return (
    <div className='FileCell FileCell__singleline'>
      <div className='FileCell__icons'>
        <FileIcon mimeType={file.mimeType} />
      </div>
      <Link
        to={`${modalBasePath()}/file/${encodeURIComponent(file.fileId)}?owner=${
          file.createdBy?.primaryEmail?.address
        }&platformId=${platformId}`}
        className='FileCell__link'>
        {/* 
          TODO: Replace this link with the proper file spotlight link when it's ready
        */}
        <div>
          <Tooltip text={file.fileName}>
            <span>{ellipsify(file.fileName, MAX_LENGTH)}</span>
          </Tooltip>
        </div>
      </Link>
    </div>
  )
}

export default LiteFileCell
