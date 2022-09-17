import React from 'react'
import cx from 'classnames'
import { modalBasePath, searchWithoutModalParams } from 'util/helpers'
import DropdownButton, { ActionType } from 'components/elements/DropdownButton/DropdownButton'
import UI_STRINGS from 'util/ui-strings'
import './ActionsCell.scss'

const NOT_ENABLED_MESSAGE = 'not enabled in this version'
const NOT_ENABLED_FOR_THIS_RISK_MESSAGE = 'not enabled for this type of Risk'

export type ActionCallback = (...args: any[]) => void

interface ActionsCellProps {
  onEmailAction: ActionCallback
  onManagePermissionsAction: ActionCallback
  onLockoutAction: ActionCallback
  onIgnoreRiskAction: ActionCallback
  onPutBackToActiveAction: ActionCallback
  state: UserVisibilityState
  emailActionEnabled: boolean
  managePermissionsActionEnabled: boolean
  file?: any
  riskId?: string
  email?: string
  riskTypeId?: number
  appId?: string
  appName?: string
  owner?: IPerson
  platformId?: any
}

const ActionsCell: React.FC<ActionsCellProps> = ({
  onEmailAction,
  emailActionEnabled,
  onManagePermissionsAction,
  managePermissionsActionEnabled,
  onLockoutAction,
  onIgnoreRiskAction,
  onPutBackToActiveAction,
  state,
  file,
  riskId,
  email,
  riskTypeId,
  appId,
  appName,
  platformId,
  owner
}) => {
  const ownerEmail: string = owner?.primaryEmail?.address || ''
  const fileCount: number = file.fileCount
  const singleFileRisk: boolean = fileCount === 1

  const resolveRiskLink = {
    pathname: `${modalBasePath()}/resolve/${riskId}`,
    search: searchWithoutModalParams({
      riskId,
      riskTypeId,
      email: email ? email : ownerEmail,
      appName,
      appId,
      fileCount,
      platformId
    })
  }

  const actions: ActionType[] = [
    {
      onClick: onEmailAction,
      title: UI_STRINGS.RISKS.ALERT_FILE_OWNER,
      actionEnabled: emailActionEnabled,
      link: ''
    },
    {
      onClick: () => {
        onManagePermissionsAction()
      },
      title: UI_STRINGS.RISKS.RESOLVE_RISK,
      actionSecondaryText: managePermissionsActionEnabled ? '' : NOT_ENABLED_FOR_THIS_RISK_MESSAGE,
      actionEnabled: managePermissionsActionEnabled || singleFileRisk,
      link: resolveRiskLink
    },
    {
      onClick: onLockoutAction,
      title: UI_STRINGS.RISKS.LOCK_DOCUMENT,
      actionSecondaryText: NOT_ENABLED_MESSAGE,
      actionEnabled: false,
      link: ''
    },
    {
      onClick: onIgnoreRiskAction,
      title: UI_STRINGS.RISKS.IGNORE_RISK,
      actionEnabled: state === 'active',
      link: ''
    },
    {
      onClick: onPutBackToActiveAction,
      title: UI_STRINGS.RISKS.PUT_BACK_AS_ACTIVE,
      actionEnabled: state === 'ignored',
      link: ''
    }
  ]

  return (
    <div className={cx('ActionsCell')}>
      <DropdownButton text={UI_STRINGS.DROPDOWN.ACTIONS} actions={actions} enabled={true} />
    </div>
  )
}

export default ActionsCell
