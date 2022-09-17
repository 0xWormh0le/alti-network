import React, { useState, useCallback } from 'react'
import API from '@aws-amplify/api/lib'
import { GENERAL_URLS } from 'api/endpoints'
import { useCancelablePromise, useInterval } from 'util/hooks'
import * as Sentry from '@sentry/browser'
import { largeNumberDisplay, largeNumberWithPluralizedUnit } from 'util/helpers'
import Typography, { TypographyVariant } from '../Typography'
import success from 'icons/success-small.svg'
import pending from 'icons/pending.svg'
import failed from 'icons/warning-small.svg'
import './PermissionDeletionStatus.scss'

interface PermissionDeletionStatusRisk {
  riskId: string
  email?: never
}

interface PermissionDeletionStatusEmail {
  email: string
  riskId?: never
}

export type PermissionDeletionStatusProps = PermissionDeletionStatusRisk | PermissionDeletionStatusEmail

const PermissionDeletionStatus: React.FC<PermissionDeletionStatusProps> = ({ riskId, email }) => {
  const [resolutionStatus, setResolutionStatus] = useState({
    active: 0,
    completed: 0,
    failed: 0,
    pending: 0,
    totalCount: 0
  } as ResolutionStatus)
  const cancelablePromise = useCancelablePromise()

  const handleDeletionStatus = useCallback(async () => {
    try {
      const resolutionStatusResponse: ResolutionStatus = await cancelablePromise(
        API.get(
          'permissions',
          `${GENERAL_URLS.PERMISSIONS}/status?${riskId ? `risk-id=${riskId}` : `email=${email}`}`,
          {}
        )
      )
      setResolutionStatus(resolutionStatusResponse)
    } catch (err) {
      if (err.name !== 'PromiseCanceledError') {
        Sentry.captureException(err)
      }
    }
  }, [cancelablePromise, riskId, email])

  useInterval(handleDeletionStatus, 45000, true)

  const resolutionInProgress = resolutionStatus?.pending > 0

  const recentlyResolved = (resolutionStatus?.completed > 0 || resolutionStatus?.failed > 0) && !resolutionInProgress

  if (!resolutionInProgress && !recentlyResolved) {
    return <span />
  } else if (recentlyResolved) {
    return (
      <Typography className='PermissionDeletionStatus' variant={TypographyVariant.BODY}>
        Recently removed {largeNumberWithPluralizedUnit(resolutionStatus.totalCount, 'permission')}. Updates will be
        reflected here within 24 hours.
      </Typography>
    )
  }

  return (
    <Typography className='PermissionDeletionStatus' variant={TypographyVariant.BODY}>
      Removing {largeNumberWithPluralizedUnit(resolutionStatus.totalCount, 'permission')}
      <img src={success} alt='Success' />
      {largeNumberDisplay(resolutionStatus.completed)} successful
      <img src={pending} alt='Pending' />
      {largeNumberDisplay(resolutionStatus.pending)} in progress
      <img src={failed} alt='Failed' />
      {largeNumberDisplay(resolutionStatus.failed)} failed
    </Typography>
  )
}

export default PermissionDeletionStatus
