import React, { useState } from 'react'
import RiskTypeSetting from 'components/risk-settings/RiskTypeSetting'
import InformationCard from 'components/elements/InformationCard'
import ContentLoader from 'react-content-loader'
import { noRiskCategoryEnabled } from 'components/risk-settings/RiskTypeSetting/conditions'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import { mapRiskCategories, mergeRiskCategories } from 'components/risk-settings/RiskTypeSetting/mappings'
import { DisplayRiskCategory } from 'components/risk-settings/RiskTypeSetting/RiskTypeSetting'
import useSlackNotificationApiClient from 'api/clients/slackNotificationApiClient'
import LightBulb from 'icons/LightBulb'
import { alertError } from 'util/alert'
import UI_STRINGS from 'util/ui-strings'

const handleError = (error: any) => alertError(error.meassage)

const SlackNotifications: React.FC = () => {
  const { useGetSlackNotifications } = useSlackNotificationApiClient({
    handleError,
    handleSuccess: (response: RiskCategory[]) => {
      setData(mapRiskCategories(response, true))
    }
  })

  const { useUpdateSlackNotifications } = useSlackNotificationApiClient({
    handleError,
    handleSuccess: (response: RiskCategory[]) => {
      setData((prev) => mergeRiskCategories(prev, mapRiskCategories(response, true)))
      setEditMode(false)
    }
  })

  const [data, setData] = useState<DisplayRiskCategory[]>([])
  const [editMode, setEditMode] = useState(false)
  const [, , loading] = useGetSlackNotifications()
  const [, , updatePending, saveTrigger] = useUpdateSlackNotifications()

  return (
    <>
      <Typography variant={TypographyVariant.BODY_LARGE} weight='normal'>
        {loading ? (
          <ContentLoader
            backgroundColor='#f0f0f0'
            foregroundColor='#f7f7f7'
            width='300'
            height='20'
            uniqueKey='RiskTypeSetting__group-item_Loader'>
            <rect x={0} y={0} width='100%' height={20} />
          </ContentLoader>
        ) : editMode ? (
          UI_STRINGS.SETTINGS.SLACK_SELECT_NOTIFICATIONS
        ) : noRiskCategoryEnabled(data) ? (
          UI_STRINGS.SETTINGS.SLACK_NO_CURRENT_NOTIFICATIONS
        ) : (
          UI_STRINGS.SETTINGS.SLACK_CURRENT_NOTIFICATIONS
        )}
      </Typography>
      {editMode && (
        <InformationCard
          className='Settings__config-tip'
          iconLocation='left'
          icon={<LightBulb size={20} color='black' />}>
          <p>{UI_STRINGS.SETTINGS.SLACK_NOTIFICATION_NOTE}</p>
        </InformationCard>
      )}
      <RiskTypeSetting
        loading={loading}
        editMode={editMode}
        updatePending={updatePending}
        data={data}
        onSave={(riskCategories: RiskCategoryPost[]) => saveTrigger.call({ platformId: 'gsuite', riskCategories })}
        editButtonLabel={UI_STRINGS.BUTTON_LABELS.EDIT_RISK_TYPE_NOTIFICATION_SETTING}
        onEdit={() => setEditMode(true)}
        onCancelEdit={() => setEditMode(false)}
      />
    </>
  )
}

export default SlackNotifications
