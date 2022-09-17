import React from 'react'
import ContentLoader from 'react-content-loader'
import cx from 'classnames'

import { largeNumberDisplay } from 'util/helpers'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import './DashboardCards.scss'

export interface DashboardCard {
  label: string
  value: number
  groupType: number
}

export interface DashboardCardsProps {
  cards: DashboardCard[]
  loading?: boolean
  selectedCardGroupType: number
  onCardClick: (key: number) => void
}

export const DashboardCards: React.FC<DashboardCardsProps> = ({
  cards,
  selectedCardGroupType,
  onCardClick,
  loading
}) => (
  <div className='DashboardCards'>
    {cards.map((card) => (
      <div
        key={card.label}
        onClick={() => onCardClick(card.groupType)}
        className={cx('DashboardCards__card', {
          'DashboardCards__card--active': card.groupType === selectedCardGroupType
        })}>
        {loading ? (
          <ContentLoader
            backgroundColor='#cce8fe'
            foregroundColor='#e5f3fe'
            height={90}
            className='DashboardCards__card-value'
            uniqueKey='DashboardCards__card-value'>
            <rect x={0} y={0} width='100%' height={90} />
          </ContentLoader>
        ) : (
          <Typography variant={TypographyVariant.H1} component='div' className='DashboardCards__card-value'>
            {largeNumberDisplay(card.value)}
          </Typography>
        )}
        <Typography variant={TypographyVariant.LABEL} className='DashboardCards__card-label'>
          {card.label}
        </Typography>
      </div>
    ))}
  </div>
)

export default DashboardCards
