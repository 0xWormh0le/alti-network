import React, { useState, useCallback, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import * as Sentry from '@sentry/browser'
import noop from 'lodash/noop'
import { modalBasePath, isExternalEmail } from 'util/helpers'
import { capitalize } from 'lodash'
import ButtonCell from 'components/elements/ButtonCell'
import Phrase from 'components/elements/Phrase'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import ModalGroup from 'components/widgets/ModalGroup'
import { UserContextConsumer } from 'models/UserContext'
import Tooltip from 'components/widgets/Tooltip'
import UI_STRINGS from 'util/ui-strings'
import { ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import iconPending from 'icons/pending.svg'
import iconWarning from 'icons/warning-small.svg'
import useFileApiClient from 'api/clients/fileApiClient'
import useRiskApiClient from 'api/clients/riskApiClient'
import { PermissionType, PermissionShared, PermissionRole, PermissionItemStatus } from 'types/common'
import './FilePermissions.scss'

interface SelectedPermission {
  text: string
  permissionId: string
  description: string
  email: string
}

export interface FilePermissionsProps {
  permissions: Permission[]
  totalEntityCount: number
  pageSize: number
  pageCount: number
  pageNumber: number
  entityCount: number
  loading: boolean
  fileId: string
  fileName: string
  ownerEmail: string
  riskId: string
  platformId: string
  onPageChange: (nextPage: number) => void
  getPermissions: () => void
}

export const checkPermissionEmail = (owner: string, permissionEmail: string): boolean => owner === permissionEmail

const FilePermissions: React.FC<FilePermissionsProps> = (props) => {
  const {
    pageSize,
    pageCount,
    pageNumber,
    entityCount,
    permissions,
    loading,
    fileId,
    fileName,
    riskId,
    platformId,
    onPageChange,
    getPermissions,
    ownerEmail,
    totalEntityCount
  } = props

  const data = permissions
  const { useDeleteFilePermission } = useFileApiClient()
  const { useDeleteAllPermissions } = useRiskApiClient()

  const [rsDeletingFilePerm, errDeletingFilePerm, isLoadingDeletingFilePerm, deleteFilePermission] =
    useDeleteFilePermission()
  const [rsDeletingAllPerm, errDeletingAllPerm, isLoadingDeleteAllPerms, deleteAllPermissions] =
    useDeleteAllPermissions()

  const [selectedPermission, setSelectedPermission] = useState<SelectedPermission>()
  const [closeAllModals, setCloseAllModals] = useState(false)

  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false)
  const [failModalVisible, setFailModalVisible] = useState<boolean>(false)
  const [failModalMessage, setFailModalMessage] = useState<string>(
    UI_STRINGS.EDIT_PERMISSIONS.ERROR_ENCOUNTERED_TRY_AGAIN
  )
  const [removingPermission, setRemovingPermission] = useState(false)

  const removePermission = (value: SelectedPermission) => {
    setSelectedPermission(value)
    setConfirmModalVisible(true)

    window.visibleModalCount = 2
  }

  const toolTipForPermission = (permission: Permission) => {
    const { permissionEmailAddress, shared } = permission
    if (ownerEmail === '' || ownerEmail === undefined) {
      return UI_STRINGS.EDIT_PERMISSIONS.PERMISSIONS_CANNOT_BE_REMOVED_DIRECT_REMOVE(platformId)
    }
    const isOwner = checkPermissionEmail(ownerEmail, permissionEmailAddress || '')
    if (isOwner) {
      if (shared === PermissionShared.external) {
        return UI_STRINGS.EDIT_PERMISSIONS.PERMISSIONS_FOR_EXTERNALLY_OWNED_CANT_BE_REMOVED(platformId)
      } else {
        return UI_STRINGS.EDIT_PERMISSIONS.OWNER_CANT_BE_REMOVED
      }
    }
    return ''
  }

  // here, false should normally be: permissions.length === 2
  // but we won't use this yet since the api is not working as expected
  // expected behavior is to remove the risk and offending permission from
  // the ui on deletion of last offending permission from a risk
  const lastRemovablePermissionOfRisk = false

  const mapButton = (permission: Permission, description: string) => {
    const { permissionEmailAddress, permissionId, status } = permission
    const isOwner = checkPermissionEmail(ownerEmail, permissionEmailAddress || '')

    const tooltip = !ownerEmail
      ? UI_STRINGS.SPOTLIGHT.PERMISSIONS_GRANTING_ACCESS_CAN_ONLY_BE_REMOVED
      : toolTipForPermission(permission)

    return (
      <UserContextConsumer>
        {({ domains }) => {
          const externallyOwned = isExternalEmail(domains, ownerEmail)
          const disabled = isOwner || externallyOwned || !ownerEmail
          const btnValue: SelectedPermission = {
            text: UI_STRINGS.BUTTON_LABELS.REMOVE,
            permissionId,
            description,
            email: permissionEmailAddress || ''
          }

          if (status === PermissionItemStatus.pending) {
            return (
              <Typography className='StatusLabel' variant={TypographyVariant.LABEL}>
                <img src={iconPending} alt='' />
                {UI_STRINGS.EDIT_PERMISSIONS.REMOVAL_IN_PROGRESS}
              </Typography>
            )
          } else if (status === PermissionItemStatus.cannotBeRemoved) {
            return (
              <Typography className='StatusLabel' variant={TypographyVariant.LABEL}>
                <img src={iconWarning} alt='' />
                {UI_STRINGS.EDIT_PERMISSIONS.CANNOT_BE_REMOVED}
              </Typography>
            )
          }

          return disabled ? (
            <Tooltip text={tooltip} id={`tooltip-avatar-${permissionId}`}>
              <span className='TooltipButton'>
                <ButtonCell value={btnValue} onClick={noop} className='Button--disabled' />
              </span>
            </Tooltip>
          ) : (
            <ButtonCell value={btnValue} onClick={removePermission} disabled={false} />
          )
        }}
      </UserContextConsumer>
    )
  }

  const getDescriptionAndTitle = (permission: Permission) => {
    if (permission === null) {
      return { description: '', title: '' }
    }

    let title: string | JSX.Element = ''
    let description: string = ''
    const { permissionEmailAddress, type, shared, discoverable, role, permissionId } = permission

    const isOwner = checkPermissionEmail(ownerEmail, permissionEmailAddress || '')

    if (type === PermissionType.anyone) {
      if (discoverable) {
        if (shared === PermissionShared.external) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_EX_DISCOVER_BY_ANYONE
        } else if (shared === PermissionShared.internal) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_IN_DISCOVER_BY_ANYONE
        } else {
          title = UI_STRINGS.EDIT_PERMISSIONS.DISCOVERABLE_BY_ANYONE
        }
      } else {
        if (shared === PermissionShared.external) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_EXTERNALLY
        } else if (shared === PermissionShared.internal) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_INTERNALLY
        } else if (permissionId === 'anyoneWithLink') {
          title = UI_STRINGS.EDIT_PERMISSIONS.ANYONE_WITH_THE_LINK_CAN(capitalize(role))
        } else if (role) {
          title = UI_STRINGS.EDIT_PERMISSIONS.ANYONE_CAN(capitalize(role))
        }
      }
      description = title
    } else if (type === PermissionType.domain) {
      if (discoverable) {
        if (shared === PermissionShared.external) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_EX_DISCOVER_BY_ANYONE_AT_COMPANY
        } else if (shared === PermissionShared.internal) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_IN_DISCOVER_BY_ANYONE_AT_COMPANY
        } else {
          title = UI_STRINGS.EDIT_PERMISSIONS.DISCOVERABLE_BY_ANYONE_AT_COMPANY
        }
      } else {
        if (shared === PermissionShared.external) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_EXTERNALLY
        } else if (shared === PermissionShared.internal) {
          title = UI_STRINGS.EDIT_PERMISSIONS.SHARED_BY_LINK_INTERNALLY
        } else if (permissionId === 'anyoneWithLink') {
          title = UI_STRINGS.EDIT_PERMISSIONS.ANYONE_AT_COMPANY_WITH_THE_LINK_CAN(capitalize(role))
        } else if (role) {
          title = UI_STRINGS.EDIT_PERMISSIONS.ANYONE_AT_COMPANY_CAN(capitalize(role))
        }
      }
      description = title
    } else {
      if (permissionEmailAddress) {
        if (isOwner) {
          description = UI_STRINGS.EDIT_PERMISSIONS.EMAIL_IS_THE_OWNER(ownerEmail)
          title = (
            <Fragment>
              <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(permissionEmailAddress)}`}>
                {permissionEmailAddress}
              </Link>
              &nbsp;is the Owner
            </Fragment>
          )
        } else {
          if (role === PermissionRole.read) {
            description = UI_STRINGS.EDIT_PERMISSIONS.EMAIL_CAN_READ(permissionEmailAddress)
            title = (
              <Fragment>
                <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(permissionEmailAddress)}`}>
                  {permissionEmailAddress}
                </Link>
                &nbsp;can Read
              </Fragment>
            )
          } else {
            description = UI_STRINGS.EDIT_PERMISSIONS.EMAIL_CAN_WRITE(permissionEmailAddress)
            title = (
              <Fragment>
                <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(permissionEmailAddress)}`}>
                  {permissionEmailAddress}
                </Link>
                &nbsp;can Write
              </Fragment>
            )
          }
        }
      } else {
        if (role === PermissionRole.read) {
          title = UI_STRINGS.EDIT_PERMISSIONS.ANYONE_CAN_READ
        } else {
          title = UI_STRINGS.EDIT_PERMISSIONS.ANYONE_CAN_WRITE
        }
        description = title
      }
    }

    return { description, title }
  }

  // Modal controller
  useEffect(() => {
    const showSuccessModal = (rsDeletingAllPerm && !errDeletingAllPerm) || (rsDeletingFilePerm && !errDeletingFilePerm)
    const showErrModal = errDeletingAllPerm || errDeletingFilePerm

    if (closeAllModals) {
      setSuccessModalVisible(false)
      setFailModalVisible(false)
      return
    }

    if (showSuccessModal && !successModalVisible) {
      setCloseAllModals(false)
      setSuccessModalVisible(true)
    }

    if (showErrModal && !failModalVisible) {
      setCloseAllModals(false)
      setFailModalVisible(true)
    }

    if (isLoadingDeleteAllPerms || isLoadingDeletingFilePerm) {
      setRemovingPermission(true)
    } else {
      if (removingPermission) {
        setRemovingPermission(false)
      }
    }
  }, [
    successModalVisible,
    closeAllModals,
    removingPermission,
    setCloseAllModals,
    failModalVisible,
    rsDeletingFilePerm,
    rsDeletingAllPerm,
    isLoadingDeleteAllPerms,
    isLoadingDeletingFilePerm,
    errDeletingFilePerm,
    errDeletingAllPerm,
    setSuccessModalVisible,
    getPermissions,
    setFailModalMessage
  ])

  const handleConfirmRemove = useCallback(async () => {
    try {
      if (lastRemovablePermissionOfRisk) {
        deleteAllPermissions.call({ riskId })
      } else {
        if (selectedPermission?.permissionId) {
          deleteFilePermission.call({
            fileId,
            permissionId: selectedPermission.permissionId,
            platformId
          })
        }
      }
      if (window.visibleModalCount !== undefined) {
        window.visibleModalCount++
      }
    } catch (error) {
      if (error?.message.indexOf('401')) {
        setFailModalMessage(UI_STRINGS.EDIT_PERMISSIONS.YOUR_ORG_HASNT_ENABLED_THIS_FEATURE)
      }

      if (window.visibleModalCount !== undefined) {
        window.visibleModalCount++
      }
      Sentry.captureException(error)
    }
  }, [
    selectedPermission,
    deleteAllPermissions,
    deleteFilePermission,
    fileId,
    riskId,
    platformId,
    lastRemovablePermissionOfRisk
  ])
  const onSuccessHandler = () => {
    getPermissions()
    setCloseAllModals(true)

    if (window.visibleModalCount !== undefined) {
      window.visibleModalCount--
    }
  }

  const onFailHandler = () => {
    setCloseAllModals(true)

    if (window.visibleModalCount !== undefined) {
      window.visibleModalCount--
    }
  }
  const removeMessage: string = selectedPermission
    ? selectedPermission.email
      ? selectedPermission.email
      : UI_STRINGS.EDIT_PERMISSIONS.ANYONE_WITH_THE_LINK
    : ''

  const heading = `${entityCount} ${UI_STRINGS.EDIT_PERMISSIONS.PERMISSIONS_TOTAL}`

  return (
    <div className='FilePermissions'>
      <ModernTable
        className='FilePermissions__Table'
        items={data}
        fields={[heading]}
        isLoading={loading}
        loadingComponent={<TableLoading />}
        scopedSlots={{
          [heading]: (val) => {
            return <span className='DescriptionCell'>{getDescriptionAndTitle(val).title}</span>
          }
        }}
        actions={(val) => mapButton(val, getDescriptionAndTitle(val).description)}>
        <EntityCountPagination
          entityCount={entityCount}
          totalEntityCount={totalEntityCount}
          onPageChange={onPageChange}
          pageCount={pageCount}
          pageNumber={pageNumber}
          pageSize={pageSize}
        />
      </ModernTable>

      {selectedPermission && (
        <ModalGroup
          confirmModalTitle={UI_STRINGS.EDIT_PERMISSIONS.CONFIRM_EDIT}
          processingModalTitle={UI_STRINGS.EDIT_PERMISSIONS.CONFIRM_EDIT}
          successModalTitle={UI_STRINGS.EDIT_PERMISSIONS.SUCCESS}
          failModalTitle={UI_STRINGS.EDIT_PERMISSIONS.ERROR}
          confirmModalMessage={
            <div className='ConfirmPhraseModalContent'>
              <Typography variant={TypographyVariant.H3}>
                {UI_STRINGS.EDIT_PERMISSIONS.ARE_YOU_SURE_TO_REMOVE_THIS_PERMISSION}
              </Typography>
              <Phrase phrase={selectedPermission && selectedPermission.description} size='lg' />
            </div>
          }
          processingModalMessage={UI_STRINGS.EDIT_PERMISSIONS.REMOVING_PERMISSION}
          successModalMessage={UI_STRINGS.EDIT_PERMISSIONS.FILENAME_CAN_NOLONGER_BE_ACCESSED_BY(
            fileName,
            removeMessage
          )}
          failModalMessage={failModalMessage}
          confirmModalVisible={confirmModalVisible}
          processingModalVisible={removingPermission}
          successModalVisible={successModalVisible}
          failModalVisible={failModalVisible}
          onConfirm={handleConfirmRemove}
          onCancel={() => {
            setConfirmModalVisible(false)

            if (window.visibleModalCount !== undefined) {
              window.visibleModalCount--
            }
          }}
          onProcessingConfirm={noop}
          onProcessingCancel={noop}
          onSuccessConfirm={onSuccessHandler}
          onSuccessCancel={onSuccessHandler}
          onFailConfirm={onFailHandler}
          onFailCancel={onFailHandler}
        />
      )}
    </div>
  )
}

export default FilePermissions
