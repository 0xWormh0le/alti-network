import React, { Fragment, useMemo } from 'react'
import { Link } from 'react-router-dom'
import FileIcon from 'components/elements/FileIcon'
import { ellipsify, modalBasePath, searchWithoutModalParams, replaceUrlParam, getFolderUrl } from 'util/helpers'
import { PlatformCell } from 'components/elements/Platforms'
import SensitiveFileCell from 'components/elements/SensitiveFileCell'
import { hasSensitiveContent } from 'util/helpers'
import IconFolder from 'icons/icon-small-folder-black.svg'
import Tooltip from 'components/widgets/Tooltip'
import UI_STRINGS from 'util/ui-strings'
import CONSTANTS from 'util/constants'
import './SingleFileCell.scss'

export interface SingleFileCellProps {
  file: IFile
}

export const SingleFileCell: React.FC<SingleFileCellProps> = ({ file }) => {
  const FOLDERNAME_TRUNC_LENGTH = 35
  const { fileName, createdBy, mimeType, parentFolder, platformId, fileId, iconUrl } = file
  const truncatedFileName = ellipsify(fileName, 60)
  const shouldTruncate = fileName !== truncatedFileName && truncatedFileName.indexOf(' ') < 0
  const _hasSensitiveContent = hasSensitiveContent(file)

  const link = useMemo(() => {
    const owner = createdBy?.primaryEmail?.address || ''
    const modalParams = searchWithoutModalParams()
    const urlFileType = mimeType === 'folder' ? 'folder' : 'file'
    const url = `${modalBasePath()}/${urlFileType}/${fileId}${modalParams}`

    let u = replaceUrlParam(url, 'owner', owner)

    if (mimeType === 'folder') {
      u = replaceUrlParam(u, 'selection', 'filesInFolder')
    } else {
      u = replaceUrlParam(u, 'selection', _hasSensitiveContent ? 'sensitive' : 'timeline')
    }

    if (_hasSensitiveContent) {
      u += '&sensitive=true'
    }

    u = replaceUrlParam(u, 'platformId', platformId)
    return u
  }, [_hasSensitiveContent, createdBy, fileId, mimeType, platformId])

  const parentFolderName: string | undefined = parentFolder?.folderName

  const parentFolderId: string | undefined = parentFolder?.folderId

  const folderUrl = getFolderUrl(parentFolderId, platformId)
  const folderIcon = (
    <Tooltip text={UI_STRINGS.FILE.FOLDER} id={mimeType}>
      <img src={IconFolder} alt={mimeType} className='SingleFileCell__icon' />
    </Tooltip>
  )

  return (
    <div className='SingleFileCell'>
      {fileName === '' && <div className='SingleFileCell__not-found'>File not found</div>}
      {fileName !== '' && (
        <div className='SingleFileCell__title-container'>
          <div className='SingleFileCell__icon-container'>
            <div className='SingleFileCell__spacer-05' />
            {platformId && (
              <div className='SingleFileCell__spacer-05'>
                <PlatformCell platformId={platformId} />
              </div>
            )}
            <FileIcon mimeType={mimeType} iconUrl={iconUrl} />
          </div>
          <div className='SingleFileCell__folder-container'>
            <div>
              <Link to={link} className='SingleFileCell__link' title={shouldTruncate ? fileName : undefined}>
                {shouldTruncate ? truncatedFileName : fileName}
              </Link>
            </div>
            {parentFolderName && parentFolderId && (
              <div className='SingleFileCell__folder-text'>
                <span>In: </span>
                {parentFolderName === CONSTANTS.EXTERNAL_OR_UNKNOWN ? (
                  <span>
                    {folderIcon}
                    <span className='disabled'>{UI_STRINGS.FILE.EXTERNAL_OR_UNKNOWN}</span>
                  </span>
                ) : folderUrl ? (
                  <span>
                    <Link to={folderUrl} title={parentFolderName as string} className='SingleFileCell__link'>
                      {folderIcon}
                      {ellipsify(parentFolderName, FOLDERNAME_TRUNC_LENGTH)}
                    </Link>
                  </span>
                ) : (
                  <Fragment>
                    <span>
                      {folderIcon}
                      <span>{ellipsify(parentFolderName, FOLDERNAME_TRUNC_LENGTH)}</span>
                    </span>
                  </Fragment>
                )}
              </div>
            )}
            {_hasSensitiveContent && (
              <div className='SingleFileCell__sensitive-marker'>
                <SensitiveFileCell sensitiveFile={file as unknown as SensitiveMultiFile | SensitiveSingleFile} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SingleFileCell
