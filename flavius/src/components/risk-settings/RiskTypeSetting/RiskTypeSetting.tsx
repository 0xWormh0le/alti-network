import React, { useEffect, useState, useCallback } from 'react'
import fp from 'lodash/fp'
import Button from 'components/elements/Button'
import RiskTypeSettingItem, { RiskTypeSettingItemLoading } from './RiskTypeSettingItem'
import { trimName } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import { isRiskCategoryPartiallyEnabled, isRiskCategoryEnabled, isRiskCategoryConfigurable } from './conditions'
import './RiskTypeSetting.scss'

export interface DisplayRiskCategory extends RiskCategoryBase {
  label: string
  order: number
  riskTypes: DisplayRiskType[]
}

export interface DisplayRiskType extends RiskTypeBase {
  enabled: boolean
  configurable: boolean
  description: string
  severity: SeverityRange
}

interface RiskTypeSettingProps {
  loading: boolean
  editMode: boolean
  editButtonLabel: string
  updatePending: boolean
  data: DisplayRiskCategory[]
  onSave: (saveData: RiskCategoryPost[]) => any
  onEdit: () => void
  onCancelEdit: () => void
}

const RiskTypeSetting: React.FC<RiskTypeSettingProps> = ({
  loading,
  updatePending,
  editMode,
  editButtonLabel,
  data,
  onCancelEdit,
  onEdit,
  onSave
}) => {
  const [riskCategories, setRiskCategories] = useState(data)

  useEffect(() => {
    setRiskCategories(data)
  }, [data])

  const handleCancelEditClick = useCallback(() => {
    onCancelEdit()
    setRiskCategories(data)
  }, [onCancelEdit, data])

  const handleSaveChanges = useCallback(() => {
    const newRiskCategories: RiskCategoryPost[] = []

    riskCategories.forEach((riskCategory: DisplayRiskCategory) => {
      if (isRiskCategoryConfigurable(riskCategory)) {
        const newRiskCategory: RiskCategoryPost = {
          category: riskCategory.category,
          riskTypes: []
        }

        riskCategory.riskTypes.forEach((riskType: DisplayRiskType) => {
          if (riskType.configurable) {
            const newRiskType: RiskTypePost = { riskTypeId: riskType.riskTypeId, enabled: riskType.enabled }
            newRiskCategory.riskTypes.push(newRiskType)
          }
        })

        newRiskCategories.push(newRiskCategory)
      }
    })

    onSave(newRiskCategories)
  }, [onSave, riskCategories])

  const handleRiskCategoryToggle = useCallback(
    (riskCategoryIndex: number) => {
      const currentRiskCategoryEnabled: boolean = isRiskCategoryEnabled(riskCategories[riskCategoryIndex])

      const riskCategory: DisplayRiskCategory = {
        ...riskCategories[riskCategoryIndex],
        riskTypes: riskCategories[riskCategoryIndex].riskTypes.map((riskType) => {
          if (riskType.configurable) {
            return {
              ...riskType,
              enabled: !currentRiskCategoryEnabled
            }
          } else {
            return riskType
          }
        })
      }

      setRiskCategories(
        (prev) =>
          prev &&
          prev.map((item, index) => {
            if (index === riskCategoryIndex) {
              return riskCategory
            } else {
              return item
            }
          })
      )
    },
    [riskCategories]
  )

  const handleRiskTypeToggle = useCallback(
    (riskCategoryIndex: number, riskTypeIndex: number) => {
      const currentRiskType: DisplayRiskType = riskCategories[riskCategoryIndex].riskTypes[riskTypeIndex]

      if (!currentRiskType.configurable) {
        return
      }

      setRiskCategories(fp.set(`[${riskCategoryIndex}].riskTypes[${riskTypeIndex}].enabled`, !currentRiskType.enabled))
    },
    [riskCategories]
  )

  if (loading) {
    return (
      <div className='RiskTypeSetting'>
        <div className='RiskTypeSetting__content'>
          <RiskTypeSettingItemLoading />
          <RiskTypeSettingItemLoading />
        </div>
      </div>
    )
  }

  return (
    <div className='RiskTypeSetting'>
      <div className='RiskTypeSetting__content'>
        {riskCategories.map((riskCategory, index) => (
          <RiskTypeSettingItem
            key={trimName(riskCategory.category)}
            riskCategoryIndex={index}
            editMode={editMode}
            editable={isRiskCategoryConfigurable(riskCategory)}
            checked={isRiskCategoryEnabled(riskCategory)}
            displayRiskCategoryInRead={isRiskCategoryPartiallyEnabled(riskCategory)}
            riskCategory={riskCategory}
            onToggleRiskCategory={handleRiskCategoryToggle}
            onToggleRiskType={handleRiskTypeToggle}
          />
        ))}
      </div>
      <div className='RiskTypeSetting__actions'>
        {editMode ? (
          <div className='RiskTypeSetting__button-group'>
            <Button
              action='primary'
              isLoading={updatePending}
              text={UI_STRINGS.SETTINGS.SAVE_CHANGES}
              loadingText={UI_STRINGS.SETTINGS.SAVING_CHANGES}
              onClick={handleSaveChanges}
            />
            <Button
              action='secondary'
              type='reset'
              disabled={updatePending}
              text={UI_STRINGS.BUTTON_LABELS.CANCEL}
              onClick={handleCancelEditClick}
            />
          </div>
        ) : (
          <Button action='primary' text={editButtonLabel} onClick={onEdit} />
        )}
      </div>
    </div>
  )
}

export default RiskTypeSetting
