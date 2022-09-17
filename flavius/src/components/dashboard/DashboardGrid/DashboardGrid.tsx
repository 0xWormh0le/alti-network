import React from 'react'
import SectionTitle from 'components/elements/SectionTitle'
import DashboardCards, { DashboardCard } from '../DashboardCards'
import RiskTypesList from '../RiskTypesList'
import UI_STRINGS from 'util/ui-strings'
import './DashboardGrid.scss'

export interface DashboardGridProps {
  cards: DashboardCard[]
  selectedCardGroupType: number
  onCardClick: (cardKey: number) => void
  riskTypes: RiskTypeSummary[]
  loading?: boolean
}

export const DashboardGrid: React.FC<DashboardGridProps> = ({
  cards,
  loading,
  selectedCardGroupType,
  onCardClick,
  riskTypes
}) => {
  const selectedCard = cards.find((card) => card.groupType === selectedCardGroupType)
  return (
    <div className='DashboardGrid'>
      <SectionTitle titleText={UI_STRINGS.DASHBOARD.RISK_SUMMARY} />
      <div className='DashboardGrid__main'>
        <DashboardCards
          cards={cards}
          selectedCardGroupType={selectedCardGroupType}
          onCardClick={onCardClick}
          loading={loading}
        />
        <RiskTypesList
          riskTypes={riskTypes}
          categoryLabel={selectedCard ? selectedCard.label : 'Risks'}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default DashboardGrid
