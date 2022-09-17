import React, { Fragment } from 'react'
import ContentLoader from 'react-content-loader'

import { capitalize } from 'lodash'
import AvatarList from 'components/elements/AvatarList'
import Person from 'models/Person'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { UsageKind, UserKind, AccessLevel } from 'types/common'

import * as Sentry from '@sentry/browser'
import './AccessLists.scss'

type accessType = 'external' | 'internal'

export interface AccessListsProps {
  file: IFile
  loading?: boolean
}

export const AccessLists: React.FC<AccessListsProps> = ({ file, loading }) => (
  <div className='AccessLists'>
    <AccessList type='internal' file={file} loading={loading} />
    <span className='AccessLists__separator' />
    <AccessList type='external' file={file} loading={loading} />
  </div>
)

const hasExternalLinkAccess = (file: IFile) => {
  return file.linkVisibility === 'external' || file.linkVisibility === 'external_discoverable'
}

const hasExternalPersonAccess = (file: IFile) => {
  if (!Array.isArray(file.externalAccessList)) {
    Sentry.captureException(`File externalAccessList not of type Array. This should not happen. FileID: ${file.fileId}`)
    return false
  }
  return (
    file.externalAccessList.length > 1 ||
    (file.externalAccessList.length === 1 && file.externalAccessList[0].primaryEmail?.address !== '')
  )
}

const fixExternalList = (file: IFile): IFile => {
  const externalPerson: IPerson = {
    primaryEmail: {
      address: 'global',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    recoveryEmail: {
      address: 'test@email.com',
      kind: UsageKind.personal,
      primary: true,
      accessCount: 0,
      riskCount: 0,
      lastDeletedPermissions: 0
    },
    name: {
      givenName: 'Anyone with',
      familyName: 'Link',
      fullName: 'Anyone with link'
    },
    avatar: {
      url: '',
      url_etag: ''
    },
    riskCount: 0,
    accessCount: 0,
    internal: false,
    internalCount: 0,
    externalCount: 0,
    emails: [],
    altnetId: '',
    projectId: '',
    accessLevel: AccessLevel.member,
    userKind: UserKind.user,
    phones: [],
    externalIds: [],
    orgUnitPath: '',
    etag: '',
    isEnrolledInMFA: false,
    creationTime: 0,
    lastLoginTime: 0,
    lastModifiedTime: 0,
    notes: {
      content: '',
      content_type: ''
    }
  }

  if (!hasExternalPersonAccess(file) && hasExternalLinkAccess(file)) {
    return {
      ...file,
      externalAccessCount: 1,
      externalAccessList: [externalPerson]
    }
  } else if (hasExternalLinkAccess(file)) {
    return {
      ...file,
      externalAccessList: [...file.externalAccessList, externalPerson]
    }
  } else if (hasExternalPersonAccess(file)) {
    return file
  } else {
    return {
      ...file,
      externalAccessCount: 0,
      externalAccessList: []
    }
  }
}

interface AccessListProps {
  type: accessType
  file: IFile
  loading?: boolean
}

const AccessList: React.FC<AccessListProps> = ({ type, file, loading }) => {
  file = fixExternalList(file)
  const fileInfo = {
    accessCount: (file[`${type}AccessCount`] as number) || 0,
    accessList: file[`${type}AccessList`] as IPerson[]
  }

  return (
    <div className='AccessList'>
      <Typography variant={TypographyVariant.SUBHEAD1}>{capitalize(type)} Access:</Typography>
      {loading ? (
        <AccessListLoading />
      ) : (
        <Fragment>
          <div className='AccessList__count'>
            <span className='AccessList__value'>{`${fileInfo.accessCount}${
              type === 'external' && fileInfo.accessCount > 0 && hasExternalLinkAccess(file) ? '+' : ''
            }`}</span>
            {fileInfo.accessCount === 1 && type !== 'external' ? (
              <Typography variant={TypographyVariant.BODY_SMALL} component='span' className='AccessList__unit'>
                person
              </Typography>
            ) : (
              <Typography variant={TypographyVariant.BODY_SMALL} component='span' className='AccessList__unit'>
                people
              </Typography>
            )}
          </div>
          {fileInfo.accessCount > 0 && (
            <React.Fragment>
              <Typography
                variant={TypographyVariant.LABEL}
                component='div'
                weight='normal'
                className='AccessList__shared-with'>
                {fileInfo.accessCount === 1 && type === 'external' && hasExternalLinkAccess(file)
                  ? 'Accessible by anyone, shared with:'
                  : 'Shared with:'}
              </Typography>
              <AvatarList people={fileInfo.accessList.map((responsePerson) => new Person(responsePerson))} />
            </React.Fragment>
          )}
        </Fragment>
      )}
    </div>
  )
}

const AccessListLoading = () => (
  <ContentLoader
    backgroundColor='#F0F0F0'
    foregroundColor='#F7F7F7'
    height={130}
    width={180}
    className='AccessListLoading'
    uniqueKey='AccessListLoading'>
    <rect x={0} y={22} width={60} height={35} rx={4} ry={4} />
    <rect x={0} y={65} width={180} height={15} rx={4} ry={4} />
    <rect x={0} y={88} width={110} height={35} rx={4} ry={4} />
  </ContentLoader>
)

export default AccessLists
