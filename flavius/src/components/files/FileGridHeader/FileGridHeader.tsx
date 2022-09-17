import React, { Fragment, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import cn from 'classnames'
import {
  isExternalEmail,
  hasSensitiveContent,
  modalBasePath,
  searchWithoutModalParams,
  getFolderUrl
} from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import Button from 'components/elements/Button'
import PersonAvatar from 'components/elements/PersonAvatar'
import { PlatformCell } from 'components/elements/Platforms'
import { Tooltip } from 'components/widgets/Tooltip/Tooltip'
import Marker, { MarkerType } from 'components/elements/Marker'
import ContentLoader from 'react-content-loader'
import Person from 'models/Person'
import AnonymousPerson from 'models/AnonymousPerson'
import { UserContext } from 'models/UserContext'
import useQueryParam from 'util/hooks/useQueryParam'
import CONSTANTS from 'util/constants'
import { formatDate, parentFolderIcon, FileAttribute, FileContent, getViewFileText } from './fileGridHeaderUtils'
import './FileGridHeader.scss'

export interface FileGridHeaderProps {
  file: IFile
  loading: boolean
}

const FileGridHeader: React.FC<FileGridHeaderProps> = ({ file, loading }) => {
  const history = useHistory()
  const { fileName, fileId, createdBy, createdAt, linkVisibility, lastModified, app, iconUrl, mimeType, webLink } = file
  const [platformIdParam] = useQueryParam('platformId', '')
  const [pageNumber] = useQueryParam<number>('modalPage', 1)
  const platformId = file.platformId || platformIdParam // fallback to the platformId in query param in case any invalid API response
  const sensitiveContent = hasSensitiveContent(file) ? 'sensitive' : null
  const parentFolderName = file?.parentFolder?.folderName || ''
  const parentFolderId = file?.parentFolder?.folderId || ''
  const parentFolderUrl = getFolderUrl(parentFolderId, platformId)
  const isShared = !createdBy?.primaryEmail?.address && app === 'GDrive' // altnetId:

  const viewFileText = getViewFileText(file.mimeType, platformId)
  const owner = createdBy ? new Person(createdBy) : new AnonymousPerson()
  const displayUsername: boolean = Boolean(owner && owner.displayName !== UI_STRINGS.RISKS.ANONYMOUS_USER)
  const fileIconUrl =
    iconUrl && iconUrl.length ? iconUrl : 'https://drive-thirdparty.googleusercontent.com/256/type/document/png'

  const user = useContext(UserContext)
  const isExternal = isExternalEmail(user.domains, owner?.primaryEmail?.address ?? '')

  const handleEditPermission = () => {
    history.push({
      pathname: modalBasePath() + '/file/' + encodeURIComponent(fileId) + '/permissions',
      search: searchWithoutModalParams({ modalPage: pageNumber }) // has to pass in modalPage here, because the tables in FridGrid responds to modalPage, while this link will leads to another modal on top of the existing modal. Try test like this, File Spotlight -> Timeline -> Go to page 2 -> Edit Permissions, the table behind the permissions table won't reload
    })
  }

  return (
    <div className='FileGridHeader'>
      <div className='FileGridHeader--wrapper'>
        <div className='FileGridHeader--section'>
          <div className='FileGridHeader__file-info'>
            <div className='FileInfo'>
              <div className='FileInfo__icon'>
                {loading ? (
                  <ContentLoader
                    backgroundColor='#F0F0F0'
                    foregroundColor='#F7F7F7'
                    height={30}
                    width={30}
                    uniqueKey='FileIcon_Info'>
                    <rect x={0} y={0} width={30} height={30} rx={4} ry={4} />
                  </ContentLoader>
                ) : webLink ? (
                  <Link
                    to={{ pathname: webLink }}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='FileInfo__link-btn'>
                    <img src={fileIconUrl} alt={mimeType} />
                  </Link>
                ) : (
                  <img src={fileIconUrl} alt={mimeType} />
                )}
              </div>
              {loading ? (
                <ContentLoader
                  backgroundColor='#F0F0F0'
                  foregroundColor='#F7F7F7'
                  height={72}
                  width={287}
                  uniqueKey='FileInfo'>
                  <rect x={22} y={0} width={265} height={72} rx={4} ry={4} />
                </ContentLoader>
              ) : (
                <div title={fileName}>
                  {webLink ? (
                    <Link
                      to={{ pathname: webLink }}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='FileInfo__link-btn FileInfo__name'
                      title={fileName}>
                      {fileName}
                    </Link>
                  ) : (
                    <span className='FileInfo__link-btn FileInfo__name'>{fileName}</span>
                  )}
                  {!loading && (
                    <>
                      {parentFolderName === CONSTANTS.EXTERNAL_OR_UNKNOWN ? (
                        <div>
                          {parentFolderIcon}
                          <span className='FileGridHeader__file-info-link disabled'>
                            {UI_STRINGS.FILE.EXTERNAL_OR_UNKNOWN}
                          </span>
                        </div>
                      ) : (
                        parentFolderUrl && (
                          <div>
                            {parentFolderIcon}
                            <Link
                              to={parentFolderUrl}
                              title={parentFolderName}
                              className='FileGridHeader__file-info-link'>
                              {parentFolderName}
                            </Link>
                          </div>
                        )
                      )}
                      <div className='FileGridHeader__platform-container'>
                        <span
                          className={cn('FileGridHeader__descriptor', {
                            'FileGridHeader__descriptor--align': parentFolderUrl
                          })}>
                          {UI_STRINGS.FILE.PLATFORM}
                        </span>
                        <span className='FileGridHeader__file-info-icon'>
                          <PlatformCell platformId={platformId} />
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className='FileGridHeader__button-wrapper'>
              {loading ? (
                <ContentLoader
                  backgroundColor='#F0F0F0'
                  foregroundColor='#F7F7F7'
                  height={48}
                  width={220}
                  uniqueKey='FileGridHeader__button-wrapper'>
                  <rect x={0} y={18} width={220} height={30} rx={4} ry={4} />
                </ContentLoader>
              ) : webLink ? (
                <Link
                  to={{ pathname: webLink }}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='FileInfo__link-btn'>
                  <Button action='secondary' text={viewFileText} />
                </Link>
              ) : (
                <Button action='secondary' text={viewFileText} disabled={true} />
              )}
            </div>
          </div>
        </div>
        <div className='FileGridHeader--split' />
        <div className='FileGridHeader--section'>
          <div className='FileGridHeader__permission-info'>
            <div className='PermissionInfo'>
              <div className='OwnedBy FileAttributeGroup'>
                <FileAttribute
                  label={UI_STRINGS.EDIT_PERMISSIONS.OWNED_BY}
                  value={
                    loading ? (
                      <ContentLoader
                        backgroundColor='#F0F0F0'
                        foregroundColor='#F7F7F7'
                        height={20}
                        width={120}
                        uniqueKey='OwnedBy'>
                        <rect x={0} y={0} width={120} height={20} rx={4} ry={4} />
                      </ContentLoader>
                    ) : (
                      <Fragment>
                        <span className='FileGridHeader__file-attribute-value FileGridHeader__owner'>
                          {owner.primaryEmail?.address ? (
                            <PersonAvatar
                              className='FileGridHeader__file-attribute-avatar'
                              person={owner}
                              clickable={true}
                            />
                          ) : (
                            ''
                          )}
                          {displayUsername ? (
                            <strong>{owner.displayName}</strong>
                          ) : (
                            owner.primaryEmail?.address || 'Shared Drive'
                          )}
                          {isExternal && (
                            <Tooltip text={UI_STRINGS.SPOTLIGHT.EXTERNAL_TOOLTIP} id={`tooltip-ex-label-id`}>
                              <Marker type={MarkerType.Ext} />
                            </Tooltip>
                          )}
                        </span>
                      </Fragment>
                    )
                  }
                />
              </div>
              <div className='FileSharing FileAttributeGroup'>
                <FileAttribute
                  label={UI_STRINGS.FILE.FILE_SHARING}
                  value={
                    loading ? (
                      <ContentLoader
                        backgroundColor='#F0F0F0'
                        foregroundColor='#F7F7F7'
                        height={20}
                        width={120}
                        uniqueKey='FileSharing'>
                        <rect x={0} y={0} width={120} height={20} rx={4} ry={4} />
                      </ContentLoader>
                    ) : (
                      <span className='FileGridHeader__file-attribute-value'>
                        {UI_STRINGS.FILE.FILE_SHARING_STATUS(file.internalAccessCount, file.externalAccessCount)}
                      </span>
                    )
                  }
                />
              </div>
              <div className='LinkSharing FileAttributeGroup'>
                <FileContent linkVisibility={linkVisibility} sensitiveContent={sensitiveContent} />
              </div>
            </div>
            <div className='FileGridHeader__button-wrapper'>
              {loading ? (
                <ContentLoader
                  backgroundColor='#F0F0F0'
                  foregroundColor='#F7F7F7'
                  height={32}
                  width={220}
                  uniqueKey='FileGridHeader__button-wrapper'>
                  <rect x={0} y={-1} width={220} height={32} rx={4} ry={4} />
                </ContentLoader>
              ) : isShared ? (
                <Button
                  action='secondary'
                  disabled={false}
                  text={UI_STRINGS.RISKS.EDIT_PERMISSIONS}
                  className='Button--disabled'
                />
              ) : (
                <Button action='secondary' text={UI_STRINGS.RISKS.EDIT_PERMISSIONS} onClick={handleEditPermission} />
              )}
            </div>
          </div>
        </div>
        <div className='FileGridHeader--split' />
        <div className='FileGridHeader--section'>
          <div className='FileGridHeader__file-date'>
            <div className='FileDate'>
              <div className='File__created FileAttributeGroup'>
                <FileAttribute
                  label={UI_STRINGS.FILE.CREATED}
                  value={
                    loading ? (
                      <ContentLoader
                        backgroundColor='#F0F0F0'
                        foregroundColor='#F7F7F7'
                        height={20}
                        width={120}
                        uniqueKey='File__created'>
                        <rect x={0} y={0} width={120} height={20} rx={4} ry={4} />
                      </ContentLoader>
                    ) : (
                      <div className='FileGridHeader__file-attribute-value'>{formatDate(createdAt)}</div>
                    )
                  }
                />
              </div>
              <div className='File__modified FileAttributeGroup'>
                <FileAttribute
                  label={UI_STRINGS.FILE.MODIFIED}
                  value={
                    loading ? (
                      <ContentLoader
                        backgroundColor='#F0F0F0'
                        foregroundColor='#F7F7F7'
                        height={20}
                        width={120}
                        uniqueKey='File__modified'>
                        <rect x={0} y={0} width={120} height={20} rx={4} ry={4} />
                      </ContentLoader>
                    ) : (
                      <div className='FileGridHeader__file-attribute-value'>{formatDate(lastModified)}</div>
                    )
                  }
                />
              </div>
              <div className='File__analyzed FileAttributeGroup'>
                <FileAttribute
                  label={UI_STRINGS.FILE.ANALYZED}
                  value={
                    loading ? (
                      <ContentLoader
                        backgroundColor='#F0F0F0'
                        foregroundColor='#F7F7F7'
                        height={20}
                        width={120}
                        uniqueKey='File__analyzed'>
                        <rect x={0} y={0} width={120} height={20} rx={4} ry={4} />
                      </ContentLoader>
                    ) : (
                      <div className='FileGridHeader__file-attribute-value'>{formatDate(file.lastIngested)}</div>
                    )
                  }
                />
              </div>
            </div>
            <div className='FileGridHeader__button-wrapper hidden'>
              <Button action='secondary' text={UI_STRINGS.FILE.ANALYZE_FILE} onClick={handleEditPermission} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileGridHeader
