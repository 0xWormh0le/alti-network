import React from 'react'
import RiskCatalog from 'models/RiskCatalog'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './FilterPills.scss'

export interface FilterPillsProps {
  selectedFilterIds: RiskTypeId[]
  onRemoveFilter: (filterId: RiskTypeId) => void
}

export const FilterPills: React.FC<FilterPillsProps> = ({ selectedFilterIds, onRemoveFilter }) => {
  const pills: JSX.Element[] = []
  return (
    <div className='FilterPills'>
      {selectedFilterIds.length > 0 && (
        <Typography variant={TypographyVariant.LABEL_LARGE} weight='light' className='FilterPills__title'>
          Filtered by
        </Typography>
      )}
      {selectedFilterIds.reduce((pillsAcc, filterId) => {
        const currentRisk = Object.keys(RiskCatalog).find((key) => RiskCatalog[key].index === filterId)
        if (currentRisk) {
          const { shortName } = RiskCatalog[currentRisk]
          pillsAcc.push(
            <Typography
              key={filterId}
              variant={TypographyVariant.BODY_SMALL}
              component='div'
              className='FilterPills__pill'>
              {shortName}
              <Typography
                variant={TypographyVariant.LABEL_LARGE}
                component='span'
                className='FilterPills__pill-remove'
                onClick={() => onRemoveFilter(filterId)}>
                ×
              </Typography>
            </Typography>
          )
        }
        return pillsAcc
      }, pills)}
    </div>
  )
}

export default FilterPills
