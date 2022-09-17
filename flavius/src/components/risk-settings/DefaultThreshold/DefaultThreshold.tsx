import React, { useCallback } from 'react'
import cx from 'classnames'
import DefaultThresholdItem from 'components/risk-settings/DefaultThresholdItem'
import LoadingBar from 'components/elements/LoadingBar'
import ModalConfirmationDialog from 'components/widgets/ModalConfirmationDialog'
import { ErrorBox } from '@altitudenetworks/component-library'
import { noop } from 'lodash'

import UI_STRINGS from 'util/ui-strings'
import useRisksSettingsApiClient from 'api/clients/risksSettingsApiClient'
import { alertSuccess, alertError } from 'util/alert'
import { useConfirmModal } from 'util/hooks'
import './DefaultThreshold.scss'

interface DefaultThresholdProps {
  className?: string
}

const DefaultThreshold: React.FC<DefaultThresholdProps> = ({ className }) => {
  const { useGetDefaultThreshold } = useRisksSettingsApiClient()
  const { useUpdateDefaultThreshold } = useRisksSettingsApiClient({
    handleError: () => alertError(UI_STRINGS.RISKS.DOWNLOAD_RISK_THRESHOLD_UPDATE_ERROR), // or we can display err => alert(err.message)
    handleSuccess: () => {
      alertSuccess(UI_STRINGS.SETTINGS.CHANGE_SUCCESS)
    }
  })

  const [initialResponse, defaultThresholdErr, isLoading] = useGetDefaultThreshold()
  const [updateResponse, updateThresholdError, updatePending, updateCaller] = useUpdateDefaultThreshold()
  const response = updateResponse || initialResponse

  const showModal = useConfirmModal()
  const values: Maybe<DefaultThreshold> = response ? response.settings.defaultThreshold : null

  const handleSave = useCallback(
    (newValue: number, type: RiskThresholdActorType) => {
      showModal({
        onConfirm: () => updateCaller.call({ actor: type, value: Number(newValue) }),
        verticalAlign: 'top',
        confirmButtonText: UI_STRINGS.SETTINGS.SAVE,
        cancelButtonText: UI_STRINGS.BUTTON_LABELS.CANCEL,
        confirmButtonActionType: 'primary',
        cancelButtonActionType: 'secondary',
        dialogTitle: UI_STRINGS.SETTINGS.SAVE_CHANGES,
        message: UI_STRINGS.SETTINGS.THRESHOLD_Files_CHANGE_CONFIRM
      })
    },
    [showModal, updateCaller]
  )

  if (defaultThresholdErr || updateThresholdError) {
    return (
      <ErrorBox
        mainMessage={UI_STRINGS.ERROR_MESSAGES.SOMETHING_WRONG}
        secondaryMessage={UI_STRINGS.ERROR_MESSAGES.OUR_END}
      />
    )
  }

  return (
    <div className={cx('DefaultThreshold', className)}>
      <p className='DefaultThreshold__title'>{UI_STRINGS.RISKS.DOWNLOAD_RISKS_SETTING}</p>
      <hr />
      <DefaultThresholdItem
        title={UI_STRINGS.RISKS.DOWNLOAD_RISK_THRESHOLD('internal')}
        description={UI_STRINGS.RISKS.DOWNLOAD_RISK_THRESHOLD_DESCRIPTION('internal')}
        initialValue={values ? values.internal : 0}
        type='internal'
        isLoading={isLoading}
        onSave={handleSave}
      />
      <DefaultThresholdItem
        title={UI_STRINGS.RISKS.DOWNLOAD_RISK_THRESHOLD('external')}
        description={UI_STRINGS.RISKS.DOWNLOAD_RISK_THRESHOLD_DESCRIPTION('external')}
        initialValue={values ? values.external : 0}
        type='external'
        isLoading={isLoading}
        onSave={handleSave}
      />

      {updatePending && (
        <ModalConfirmationDialog
          verticalAlign='top'
          dialogTitle='Download Risk Setting'
          message={
            <div>
              Updating download risks settings
              <LoadingBar className='DefaultThresholdItem__loading' />
            </div>
          }
          onConfirm={noop}
          onCancel={noop}
        />
      )}
    </div>
  )
}

export default DefaultThreshold
