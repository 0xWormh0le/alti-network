import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { upperFirst } from 'lodash'
import AppIndicator from '../AppIndicator'
import SensitiveFileCell from 'components/elements/SensitiveFileCell'
import {
  ellipsify,
  modalBasePath,
  searchWithoutModalParams,
  hasSensitiveContentSimple,
  getFolderUrl,
  formatSingleFileUrl
} from 'util/helpers'
import FileIcon from 'components/elements/FileIcon'
import Tooltip from 'components/widgets/Tooltip'
import { UI_STRINGS } from 'util/ui-strings'
import { renderAttributeIfDev } from 'util/helpers'
import { SensitiveContentStatus } from 'types/common'
import './FileCell.scss'

export const MAX_LENGTH = 28
export const MAX_LENGTH_NOT_SENSITIVE = 60

export interface FileCellProps {
  fileResponse: (IFile & FileCellWithoutRisk) | FileCellWithRisk
  sensitiveContentDetected?: SensitiveContentStatus
}

const formatMultipleFilesUrl = (displayRiskDescription: FileCellWithRisk) => {
  const riskId = displayRiskDescription.riskId
  const riskTypeId = displayRiskDescription.riskTypeId
  const pluginId = displayRiskDescription.pluginId || ''
  const pluginName = displayRiskDescription.pluginName || upperFirst(UI_STRINGS.FILE.UNKNOWN)
  const personId = displayRiskDescription.personId?.replace(/\?(.*)/, '')
  const platformId = displayRiskDescription.platformId
  const modalParams = searchWithoutModalParams()
  let linkUrl = `${modalBasePath()}/files/${riskId}${modalParams}`

  if (riskId && typeof riskId !== undefined && riskId !== 'undefined') {
    const params = []
    params.push(`riskTypeId=${riskTypeId}`)
    if (pluginId) {
      params.push(`pluginId=${pluginId}`)
    }
    if (pluginName) {
      params.push(`pluginName=${pluginName}`)
    }
    if (personId) {
      params.push(`owner=${personId}`)
    }
    if (riskTypeId && typeof riskTypeId !== undefined && riskTypeId !== undefined) {
      params.push(`riskTypeId=${riskTypeId}`)
    }
    if (platformId) {
      params.push(`files-platformIds=["${platformId}"]`) // for GET /files endpoint, we will pass platformIds and prefix it with files
    }
    if (params && params.length && riskTypeId) {
      linkUrl += (modalParams ? '&' : '?') + params.join('&')
    }
  }
  return linkUrl
}

const FileCell: React.FC<FileCellProps> = ({ fileResponse, sensitiveContentDetected }) => {
  const file = fileResponse

  const { fileName, app, mimeType, iconUrl, platformId, webLink, fileId, createdBy } = file

  const fileCount = file.fileCount || 0

  const owner = createdBy?.primaryEmail?.address

  const isSensitiveContent = hasSensitiveContentSimple(sensitiveContentDetected)

  const linkUrl = useMemo(() => {
    if (fileCount > 1) {
      // There is more than one file related, link to the list of files associated with the risk
      return formatMultipleFilesUrl(file as FileCellWithRisk)
    } else {
      // Link to the file page using the `fileId`
      const isFolder = mimeType === 'folder'

      if (isFolder) {
        return getFolderUrl(fileId, platformId) || '#'
      } else {
        return formatSingleFileUrl(owner, fileId, platformId, isSensitiveContent)
      }
    }
  }, [file, fileCount, fileId, isSensitiveContent, mimeType, owner, platformId])

  const cellText = useMemo(() => {
    if (fileCount > 1) {
      return `${fileCount} files`
    } else {
      const maxLength = isSensitiveContent ? MAX_LENGTH : MAX_LENGTH_NOT_SENSITIVE
      return ellipsify(fileName, maxLength)
    }
  }, [fileCount, fileName, isSensitiveContent])

  const cssClassName = isSensitiveContent ? 'FileCell FileCell__multiline' : 'FileCell FileCell__singleline'
  const showIcon = !fileCount || fileCount === 1

  return (
    <React.Fragment>
      <div className={cssClassName}>
        <div className='FileCell__icons'>
          <AppIndicator value={app || ''} fileId={fileId} platformId={platformId} webLink={webLink} />
          <div style={{ marginRight: '0.3em' }} />
          {showIcon && <FileIcon mimeType={mimeType} iconUrl={iconUrl || ''} />}
        </div>
        <Link to={linkUrl} className='FileCell__link' {...renderAttributeIfDev({ 'data-testid': 'file-cell-link' })}>
          <div>
            {fileCount === 1 && cellText && cellText.match(/…/gi) ? (
              <Tooltip text={fileName}>
                <span>{cellText}</span>
              </Tooltip>
            ) : (
              <div>{cellText}</div>
            )}
            {isSensitiveContent && file.riskId && (
              <div className='FileCell__spacer-top-5'>
                <SensitiveFileCell
                  sensitiveContentDetected={sensitiveContentDetected}
                  sensitiveFile={{
                    sensitivePhrases: file.sensitivePhrases,
                    fileCount,
                    riskId: file.riskId,
                    riskTypeId: file.riskTypeId
                  }}
                />
              </div>
            )}
          </div>
        </Link>
      </div>
    </React.Fragment>
  )
}

export default FileCell
