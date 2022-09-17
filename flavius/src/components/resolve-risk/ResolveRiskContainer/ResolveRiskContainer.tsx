import React, { useState, useCallback, useEffect, Fragment } from 'react'
import { Link } from 'react-router-dom'
import noop from 'lodash/noop'
import {
  modalBasePath,
  searchWithoutModalParams,
  largeNumberDisplay,
  pluralize,
  largeNumberWithPluralizedUnit,
  arrayToParam
} from 'util/helpers'
import config from 'config'

import API from '@aws-amplify/api/lib'
import { GENERAL_URLS } from 'api/endpoints'

import FilesAccessed from '../FilesAccessed'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import Button from 'components/elements/Button'
import ModalGroup from 'components/widgets/ModalGroup'
import RiskCatalog, { SharingRiskTypeIds } from 'models/RiskCatalog'
import * as Sentry from '@sentry/browser'
import PermissionDeletionStatus from 'components/elements/PermissionDeletionStatus'
import UI_STRINGS from 'util/ui-strings'
import useQueryParam from 'util/hooks/useQueryParam'
import './ResolveRiskContainer.scss'

const { featureFlags } = config
export interface ResolveRiskContainerProps {
  riskId: string
  fileCount: number
  appName?: string
  appId?: string
  email: string
  riskTypeId?: string
  requestRisk: () => void
}

interface ResolveRiskContainerState {
  loading: boolean
  statsLoading: boolean
  app?: any
  stats?: any
}

const ResolveRiskContainer: React.FC<ResolveRiskContainerProps> = (props) => {
  const { riskId, fileCount, email, appName, appId, riskTypeId, requestRisk } = props
  const [platformId] = useQueryParam<string>('platformId', '')
  const [pageNumber, setPageNumber] = useQueryParam<number>('modalPage', 1)

  const [state, setState] = useState<ResolveRiskContainerState>({
    loading: true,
    statsLoading: true,
    app: undefined
  })

  const { app } = state
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [successModalVisible, setSuccessModalVisible] = useState(false)
  const [failModalVisible, setFailModalVisible] = useState(false)
  const [removingAccess, setRemovingAccess] = useState(false)
  const [permissionsToBeDeletedCount, setPermissionsToBeDeletedCount] = useState(0)

  const getData = useCallback(async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true
    }))

    try {
      const response = await API.get(
        'files',
        `${GENERAL_URLS.FILES}?risk-id=${riskId}${
          platformId ? `&platform-ids=${arrayToParam([platformId])}` : ''
        }&page-number=${pageNumber}`,
        {}
      )
      setState((prevState) => ({
        ...prevState,
        loading: false,
        app: response
      }))
    } catch (err) {
      if (err.name !== 'PromiseCanceledError') {
        setState((prevState) => ({ ...prevState, receivedErrorResponse: true, loading: false }))
      }
    }
  }, [pageNumber, platformId, riskId])

  const getPermissionsToBeDeletedCount = useCallback(async () => {
    try {
      const resolutionStatusResponse: ResolutionStatus = await API.get(
        'permissions',
        `${GENERAL_URLS.PERMISSIONS}/status?risk-id=${riskId}`,
        {}
      )
      setPermissionsToBeDeletedCount(resolutionStatusResponse.active)
    } catch (err) {
      Sentry.captureException(err)
    }
  }, [riskId])

  useEffect(() => {
    getData()
    getPermissionsToBeDeletedCount()
  }, [getData, getPermissionsToBeDeletedCount])

  const handleConfirmRemove = useCallback(async () => {
    try {
      setRemovingAccess(true)
      await API.del('risks', `${GENERAL_URLS.RISK}/${riskId}/permissions`, {})
      getData()
      requestRisk()
      setSuccessModalVisible(true)
    } catch (err) {
      setFailModalVisible(true)
      Sentry.captureException(err)
    } finally {
      setRemovingAccess(false)
    }
  }, [riskId, getData, requestRisk])

  const riskTypeIdInt = parseInt('' + riskTypeId, 10)
  const appRisk = riskTypeIdInt === RiskCatalog.ManyDownloadsByApp.index
  const fileSharingRisk = SharingRiskTypeIds.indexOf(riskTypeIdInt) > -1
  const internalSharingRisk = riskTypeIdInt === RiskCatalog.SensitiveFileSharedByLinkInternal.index

  const riskTargetDisplayName = appRisk ? `App ${appName}` : `External Account ${email}`

  const onSuccessHandler = () => {
    setSuccessModalVisible(false)

    if (window.visibleModalCount !== undefined) {
      window.visibleModalCount--
    }
  }

  const onFailHandler = () => {
    setFailModalVisible(false)

    if (window.visibleModalCount !== undefined) {
      window.visibleModalCount--
    }
  }

  const renderResolveRiskContainerHeader = () => {
    if (fileSharingRisk) {
      return <Fragment>{`${UI_STRINGS.RESOLVE_RISK.RESOLVE_RISK_TITLE_LINK} `}</Fragment>
    } else if (appRisk) {
      return (
        <Fragment>
          {`${UI_STRINGS.RESOLVE_RISK.RESOLVE_RISK_TITLE_APP} `}
          <Link to={`${modalBasePath()}/app-spotlight/${appId}${searchWithoutModalParams()}`}>{appName}</Link>
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          {`${UI_STRINGS.RESOLVE_RISK.RESOLVE_RISK_TITLE_EXTERNAL} `}
          <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(email)}${searchWithoutModalParams()}`}>
            {email}
          </Link>
        </Fragment>
      )
    }
  }

  const renderResolveRiskContainerTitle = () => {
    if (fileSharingRisk) {
      return `${UI_STRINGS.RESOLVE_RISK.RESOLVE_RISK_TITLE_FILES_SHARED_BY_LINK(fileCount, internalSharingRisk)}`
    } else if (appRisk) {
      return (
        <Fragment>
          <Link to={`${modalBasePath()}/app-spotlight/${appId}${searchWithoutModalParams()}`}>{appName}</Link>
          <br />
          {` ${UI_STRINGS.RESOLVE_RISK.RESOLVE_RISK_TITLE_FILES_ACCESSIBLE(fileCount)}`}
        </Fragment>
      )
    } else {
      return (
        <Fragment>
          <Link to={`${modalBasePath()}/spotlight/${encodeURIComponent(email)}${searchWithoutModalParams()}`}>
            {email}
          </Link>
          <br />
          {` ${UI_STRINGS.RESOLVE_RISK.RESOLVE_RISK_TITLE_FILES_ACCESSIBLE(fileCount)}`}
        </Fragment>
      )
    }
  }

  const resolutionTargetDisplayName =
    '' + (fileSharingRisk ? `${internalSharingRisk ? 'internal' : 'external'} link sharing` : appRisk ? appName : email)
  const resolutionSuccessDisplayString = fileSharingRisk
    ? UI_STRINGS.RESOLVE_RISK.REMOVAL_SHARING_IN_PROGRESS(internalSharingRisk)
    : UI_STRINGS.RESOLVE_RISK.REMOVAL_ACCESS_TO_IN_PROGRESS(
        riskTargetDisplayName,
        largeNumberDisplay(permissionsToBeDeletedCount),
        pluralize('permission', permissionsToBeDeletedCount)
      )

  return (
    <div className='ResolveRiskContainer'>
      <div className='ResolveRiskContainer--header'>
        <p className='ResolveRiskContainer__heading'>
          {`${UI_STRINGS.RESOLVE_RISK.RESOLVE_RISK_TITLE} `}
          {renderResolveRiskContainerTitle()}
        </p>
        {featureFlags.ENABLE_BULK_PERMISSION_EDIT && (
          <div className='ResolveRiskContainer__heading--action'>
            <Button
              className='Button--primary'
              text={UI_STRINGS.BUTTON_LABELS.REMOVE_ACCESS}
              onClick={() => {
                setConfirmModalVisible(true)
                window.visibleModalCount = 2
              }}
              action='primary'
            />
          </div>
        )}
        <PermissionDeletionStatus riskId={riskId} />
        <hr className='ResolveRiskContainer__heading--hr' />
      </div>
      <div className='ResolveRiskContainer--wrapper'>
        <Typography variant={TypographyVariant.H4} weight='normal' className='ResolveRiskContainer--wrapper-heading'>
          {renderResolveRiskContainerHeader()}
        </Typography>
        <FilesAccessed
          files={app ? app.files : []}
          pageSize={app ? app.pageSize : 0}
          pageCount={app ? app.pageCount : 0}
          pageNumber={pageNumber}
          entityCount={fileCount}
          loading={state.loading}
          onPageChange={setPageNumber}
          email={email}
        />
      </div>
      <ModalGroup
        confirmModalTitle={UI_STRINGS.EDIT_PERMISSIONS.REMOVE_ALL_FILE_ACCESS}
        processingModalTitle={UI_STRINGS.EDIT_PERMISSIONS.REMOVE_ALL_FILE_ACCESS}
        successModalTitle={UI_STRINGS.EDIT_PERMISSIONS.SUCCESS}
        failModalTitle={UI_STRINGS.EDIT_PERMISSIONS.ERROR}
        confirmModalMessage={
          <div className='ConfirmPhraseModalContent'>
            {permissionsToBeDeletedCount === 0 && (
              <Typography variant={TypographyVariant.H4} className='ConfirmPhraseModalContent__title'>
                {UI_STRINGS.RESOLVE_RISK.NONE_CAN_BE_REMOVED}
              </Typography>
            )}
            {permissionsToBeDeletedCount > 0 && (
              <Typography variant={TypographyVariant.H4} className='ConfirmPhraseModalContent__title'>
                {UI_STRINGS.RESOLVE_RISK.ARE_YOU_SURE_TO_REMOVE(
                  `${permissionsToBeDeletedCount} ${pluralize('permission', permissionsToBeDeletedCount)}`,
                  resolutionTargetDisplayName,
                  largeNumberWithPluralizedUnit(fileCount, 'file')
                )}
              </Typography>
            )}
            <Typography variant={TypographyVariant.BODY_SMALL} className='ConfirmPhraseModalContent__infobox'>
              {UI_STRINGS.RESOLVE_RISK.PERMISSIONS_GRANTING_OR_SHARED_CAN_BE_REMOVED}
            </Typography>
          </div>
        }
        processingModalMessage={UI_STRINGS.RESOLVE_RISK.REQUESTING_FILE_ACCESS_REMOVAL}
        successModalMessage={resolutionSuccessDisplayString}
        failModalMessage='Failed'
        confirmModalVisible={confirmModalVisible}
        processingModalVisible={removingAccess}
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
    </div>
  )
}

export default ResolveRiskContainer
