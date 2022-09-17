import { Accordion, AccordionDetails, AccordionSummary } from '@altitudenetworks/component-library'
import cx from 'classnames'
import RiskIndicator from 'components/elements/RiskIndicator'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import React from 'react'
import ContentLoader from 'react-content-loader'
import { trimName } from 'util/helpers'
import { DisplayRiskCategory, DisplayRiskType } from 'components/risk-settings/RiskTypeSetting/RiskTypeSetting'

export interface RiskTypeSettingItemProps {
  riskCategoryIndex: number
  editMode: boolean
  editable: boolean
  checked: boolean
  displayRiskCategoryInRead: boolean
  riskCategory: DisplayRiskCategory
  onToggleRiskCategory: (riskCategoryIndex: number) => void
  onToggleRiskType: (riskCategoryIndex: number, riskTypeIndex: number) => void
}

const RiskTypeSettingItem: React.FC<RiskTypeSettingItemProps> = ({
  riskCategoryIndex,
  editMode,
  editable,
  checked,
  displayRiskCategoryInRead,
  riskCategory,
  onToggleRiskCategory,
  onToggleRiskType
}) => {
  if (editMode) {
    return (
      <Accordion expanded={editable}>
        <AccordionSummary>
          <div className={cx('RiskTypeSetting__group-item', { 'RiskTypeSetting__group-item--disabled': !editable })}>
            <input
              type='checkbox'
              id={trimName(riskCategory.category)}
              checked={editable ? checked : false}
              disabled={!editable}
              onChange={() => onToggleRiskCategory(riskCategoryIndex)}
            />
            <label htmlFor={trimName(riskCategory.category)}>
              <Typography variant={TypographyVariant.LABEL} weight='medium'>
                {riskCategory.label}
              </Typography>
            </label>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          {riskCategory.riskTypes.map((riskType: DisplayRiskType, riskTypeIndex: number) => (
            <div
              key={`${riskType.riskTypeId}_edit`}
              className={cx('RiskTypeSetting__subgroup-item', {
                'RiskTypeSetting__subgroup-item--disabled': !riskType.configurable
              })}>
              <input
                type='checkbox'
                id={`riskType-${riskType.riskTypeId}`}
                disabled={!riskType.configurable}
                checked={riskType.configurable && riskType.enabled}
                onChange={() => onToggleRiskType(riskCategoryIndex, riskTypeIndex)}
              />
              <label htmlFor={`riskType-${riskType.riskTypeId}`}>
                <RiskIndicator value={riskType.severity} type='circle' />
                <Typography variant={TypographyVariant.BODY} weight='normal' component='span'>
                  {riskType.description}
                </Typography>
              </label>
            </div>
          ))}
        </AccordionDetails>
      </Accordion>
    )
  } else if (displayRiskCategoryInRead) {
    return (
      <div key={`${trimName(riskCategory.category)}_read_${riskCategoryIndex}`} className='RiskTypeSetting__overview'>
        <div className='RiskTypeSetting__group-item'>
          <Typography variant={TypographyVariant.LABEL} weight='medium'>
            {riskCategory.label}
          </Typography>
        </div>
        {riskCategory.riskTypes.map(
          (riskType: DisplayRiskType) =>
            riskType.configurable &&
            riskType.enabled && (
              <div key={`${riskType.riskTypeId}_read`} className='RiskTypeSetting__subgroup-item'>
                <RiskIndicator value={riskType.severity} type='circle' />
                <Typography variant={TypographyVariant.BODY} weight='normal' component='span'>
                  {riskType.description}
                </Typography>
              </div>
            )
        )}
      </div>
    )
  } else {
    return null
  }
}

export const RiskTypeSettingItemLoading = () => (
  <div className='RiskTypeSetting__overview'>
    <div className='RiskTypeSetting__group-item-loader'>
      <ContentLoader
        backgroundColor='#f0f0f0'
        foregroundColor='#f7f7f7'
        width='100%'
        height={20}
        uniqueKey='RiskTypeSetting__group-item_Loader'>
        <rect x={0} y={0} width='25%' height={20} />
      </ContentLoader>
    </div>
    <div className='RiskTypeSetting__subgroup-item-loader'>
      <ContentLoader
        backgroundColor='#f0f0f0'
        foregroundColor='#f7f7f7'
        width='100%'
        height={20}
        uniqueKey='RiskTypeSetting__subgroup-item_Loader'>
        <rect x={0} y={0} width='100%' height={20} />
      </ContentLoader>
    </div>
    <div className='RiskTypeSetting__subgroup-item-loader'>
      <ContentLoader
        backgroundColor='#f0f0f0'
        foregroundColor='#f7f7f7'
        width='100%'
        height={20}
        uniqueKey='RiskTypeSetting__subgroup-item_Loader'>
        <rect x={0} y={0} width='100%' height={20} />
      </ContentLoader>
    </div>
  </div>
)

export default RiskTypeSettingItem
