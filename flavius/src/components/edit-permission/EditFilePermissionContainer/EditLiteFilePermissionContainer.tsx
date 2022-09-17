import React, { useState, useEffect } from 'react'
import * as Sentry from '@sentry/browser'
import { ModernTable } from '@altitudenetworks/component-library'
import TableLoading from 'components/elements/TableLoading'
import EntityCountPagination from 'components/elements/EntityCountPagination'
import EditLiteFilePermissionHeader from '../EditFilePermissionHeader/EditLiteFilePermissionHeader'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import useQueryParam from 'util/hooks/useQueryParam'
import CONSTANTS from 'util/constants'
import { isExternalEmail, modalBasePath } from 'util/helpers'
import Tooltip from 'components/widgets/Tooltip'
import { UserContextConsumer } from 'models/UserContext'
import { checkPermissionEmail } from '../FilePermissions/FilePermissions'
import Phrase from 'components/elements/Phrase'
import Button from 'components/elements/Button'
import { Link } from 'react-router-dom'
import { lowerCase, noop } from 'lodash'
import ModalGroup from 'components/widgets/ModalGroup'
import './EditFilePermissionContainer.scss'

export interface EditLiteFilePermissionContainerProps {
  fileId: string
  platformId: string
}

const EditLiteFilePermissionContainer: React.FC<EditLiteFilePermissionContainerProps> = (props) => {
  const { fileId, platformId } = props
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)
  const [selectedPermission, setSelectedPermission] = useState<Maybe<LiteFilePermission>>(null)
  const [confirmModalVisible, setConfirmModalVisible] = useState<boolean>(false)
  const [closeAllModals, setCloseAllModals] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState<boolean>(false)
  const [failModalVisible, setFailModalVisible] = useState<boolean>(false)
  const [failModalMessage, setFailModalMessage] = useState<string>(
    UI_STRINGS.EDIT_PERMISSIONS.ERROR_ENCOUNTERED_TRY_AGAIN
  )
  const [removingPermission, setRemovingPermission] = useState(false)

  const { useGetLiteFile, useGetLiteFilePermissions, useDeleteLiteFilePermissions } = useLitePlatformApiClient()
  const [file] = useGetLiteFile({ requestDetails: { fileId, platformId } })
  const [permissionsData, , permissionsLoading, getPermissions] = useGetLiteFilePermissions({
    requestDetails: { fileId, platformId, pageNumber, pageSize: CONSTANTS.DEFAULT_PAGE_SIZE }
  })
  const [rsDeletePermission, errDeletePermission, isLoadingDeletePermission, deletePermission] =
    useDeleteLiteFilePermissions(
      {
        meta: {
          handleError: (error: any) => {
            setFailModalMessage(UI_STRINGS.EDIT_PERMISSIONS.YOUR_ORG_HASNT_ENABLED_THIS_FEATURE)
            if (window.visibleModalCount !== undefined) {
              window.visibleModalCount++
            }
            Sentry.captureException(error)
          },
          handleSuccess: () => {
            getPermissions.call({ fileId, platformId, pageNumber, pageSize: CONSTANTS.DEFAULT_PAGE_SIZE })
          }
        }
      },
      platformId
    )

  const entityCount: number = permissionsData?.permissions.length || 0
  const ownerEmail: string = file?.createdBy.primaryEmail.address || ''
  const heading = `${entityCount} ${UI_STRINGS.EDIT_PERMISSIONS.PERMISSIONS_TOTAL}`

  const handleSelectPermission = (permission: LiteFilePermission) => {
    setSelectedPermission(permission)
    setConfirmModalVisible(true)
    window.visibleModalCount = 2
  }

  const handleConfirmRemove = () => {
    if (!selectedPermission || !selectedPermission.permissionId || !selectedPermission.permissionEmailAddress) return
    deletePermission.call({
      fileId,
      permissionId: selectedPermission.permissionId,
      permissionEmailAddress: selectedPermission.permissionEmailAddress
    })
    if (window.visibleModalCount !== undefined) {
      window.visibleModalCount++
    }
  }

  const onSuccessHandler = () => {
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

  // Modal controller
  useEffect(() => {
    const showSuccessModal = rsDeletePermission && !errDeletePermission
    const showErrModal = errDeletePermission

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

    if (isLoadingDeletePermission) {
      setRemovingPermission(true)
    } else {
      if (removingPermission) {
        setRemovingPermission(false)
      }
    }
  }, [
    closeAllModals,
    errDeletePermission,
    failModalVisible,
    isLoadingDeletePermission,
    removingPermission,
    rsDeletePermission,
    successModalVisible
  ])

  return (
    <div className='EditFilePermissionContainer'>
      {file && <EditLiteFilePermissionHeader file={file} platformId={platformId} />}
      <div className='EditFilePermissionContainer--wrapper'>
        <Typography variant={TypographyVariant.H4} weight='normal' className='EditFilePermissionContainer__heading'>
          {UI_STRINGS.EDIT_PERMISSIONS.FILE_PERMISSIONS}
        </Typography>
        <div className='FilePermissions'>
          <ModernTable
            className='FilePermissions__Table'
            items={permissionsData?.permissions || []}
            fields={[heading]}
            isLoading={permissionsLoading}
            loadingComponent={<TableLoading />}
            scopedSlots={{
              [heading]: (val) => {
                return (
                  <span className='DescriptionCell'>
                    <Link
                      to={`${modalBasePath()}/spotlight/${encodeURIComponent(
                        val.permissionEmailAddress || ''
                      )}?platformId=${platformId}`}>
                      {val.permissionEmailAddress}
                    </Link>{' '}
                    {lowerCase(val.permissionId)}
                  </span>
                )
              }
            }}
            actions={(val) => {
              const { permissionEmailAddress, permissionId } = val
              const isOwner = checkPermissionEmail(ownerEmail, permissionEmailAddress || '')

              // TODO: the tooltip content is not clear yet, update this one the API is ready
              const tooltip = !ownerEmail
                ? UI_STRINGS.SPOTLIGHT.PERMISSIONS_GRANTING_ACCESS_CAN_ONLY_BE_REMOVED
                : UI_STRINGS.EDIT_PERMISSIONS.OWNER_CANT_BE_REMOVED

              return (
                <UserContextConsumer>
                  {({ domains }) => {
                    const externallyOwned = isExternalEmail(domains, ownerEmail)
                    const disabled = isOwner || externallyOwned || !ownerEmail
                    const btn = (
                      <Button
                        onClick={() => handleSelectPermission(val)}
                        text={UI_STRINGS.BUTTON_LABELS.REMOVE}
                        action='secondary'
                        size='small'
                        disabled={disabled}
                      />
                    )

                    return disabled ? (
                      <Tooltip text={tooltip} id={`tooltip-avatar-${permissionId}`}>
                        <span className='TooltipButton'>{btn}</span>
                      </Tooltip>
                    ) : (
                      btn
                    )
                  }}
                </UserContextConsumer>
              )
            }}>
            <EntityCountPagination
              entityCount={entityCount}
              onPageChange={(next) => setPageNumber(next)}
              pageCount={permissionsData?.pageCount || 0}
              pageNumber={pageNumber}
              pageSize={CONSTANTS.DEFAULT_PAGE_SIZE}
            />
          </ModernTable>
        </div>
      </div>
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
              {selectedPermission && <Phrase phrase={selectedPermission.permissionId} size='lg' />}
            </div>
          }
          processingModalMessage={UI_STRINGS.EDIT_PERMISSIONS.REMOVING_PERMISSION}
          successModalMessage={UI_STRINGS.EDIT_PERMISSIONS.FILENAME_CAN_NOLONGER_BE_ACCESSED_BY(
            file?.fileName || '',
            selectedPermission.permissionEmailAddress || ''
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

export default EditLiteFilePermissionContainer
