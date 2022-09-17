import React, { useState } from 'react'
import cx from 'classnames'
import RiskTypeSetting from 'components/risk-settings/RiskTypeSetting'
import ContentLoader from 'react-content-loader'
import { noRiskCategoryEnabled } from 'components/risk-settings/RiskTypeSetting/conditions'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { mapRiskCategories, mergeRiskCategories } from 'components/risk-settings/RiskTypeSetting/mappings'
import { DisplayRiskCategory } from '../RiskTypeSetting/RiskTypeSetting'
import useRisksSettingsApiClient from 'api/clients/risksSettingsApiClient'
import { alertError } from 'util/alert'
import UI_STRINGS from 'util/ui-strings'
import './RiskTypeStatus.scss'

interface RiskTypeStatusProps {
  className?: string
  infoCard?: React.ReactNode
}

const handleError = (error: any) => alertError(error.response.data.message)

const RiskTypeStatus: React.FC<RiskTypeStatusProps> = ({ className, infoCard }) => {
  const { useGetRiskTypeStatus } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: RiskTypeStatusResponse) => {
      setData(mapRiskCategories(response.settings.riskTypeStatus, false))
    }
  })

  const { useUpdateRiskTypeStatus } = useRisksSettingsApiClient({
    handleError,
    handleSuccess: (response: RiskTypeStatusResponse) => {
      setData((prev) => mergeRiskCategories(prev, mapRiskCategories(response.settings.riskTypeStatus, false)))
      setEditMode(false)
    }
  })

  const [data, setData] = useState<DisplayRiskCategory[]>([])
  const [editMode, setEditMode] = useState(false)
  const [, , loading] = useGetRiskTypeStatus()
  const [, , updatePending, saveTrigger] = useUpdateRiskTypeStatus()

  return (
    <div className={cx('RiskTypeStatus', className)}>
      <Typography variant={TypographyVariant.BODY_LARGE} weight='normal'>
        {loading ? (
          <ContentLoader backgroundColor='#f0f0f0' foregroundColor='#f7f7f7' width='300' height='20'>
            <rect x={0} y={0} width='100%' height={20} />
          </ContentLoader>
        ) : editMode ? (
          UI_STRINGS.RISK_SETTINGS.RISK_TYPE_EDIT
        ) : noRiskCategoryEnabled(data) ? (
          UI_STRINGS.RISK_SETTINGS.RIKS_TYPE_NO_ENABLED
        ) : (
          UI_STRINGS.RISK_SETTINGS.RISK_TYPE_STATE
        )}
      </Typography>
      <div className='RiskTypeStatus__configuration'>
        <RiskTypeSetting
          loading={loading}
          editMode={editMode}
          updatePending={updatePending}
          data={data}
          onSave={(riskCategories: RiskCategoryPost[]) => saveTrigger.call({ riskCategories })}
          editButtonLabel={UI_STRINGS.RISK_SETTINGS.EDIT_RISK_TYPE_SETTING}
          onEdit={() => setEditMode(true)}
          onCancelEdit={() => setEditMode(false)}
        />
        {infoCard && <div className='RiskTypeStatus__information'>{infoCard}</div>}
      </div>
    </div>
  )
}

export default RiskTypeStatus
