import React, { useState, useEffect } from 'react'
import API from '@aws-amplify/api/lib'
import { GENERAL_URLS } from 'api/endpoints'
import DashboardGrid from '../DashboardGrid'
import { alertError } from 'util/alert'
import { DashboardCard } from '../DashboardCards'
import { useCancelablePromise } from 'util/hooks'
import { riskTypeGroups } from 'config'

const INITIAL_CARDS: DashboardCard[] = riskTypeGroups.map((item) => ({
  groupType: item.groupType,
  label: item.name,
  value: 0
}))

// TODO: This method can utilize the consts defined in Models/RiskCatalog.ts
// Returns true if the risk type id is within this card group, otherwise, returns false
const riskBelongsToCardGroup = (riskTypeId: number, card: DashboardCard | undefined) => {
  if (!card) {
    return false
  }

  const lowerBound = card.groupType * 1000
  const upperBound = lowerBound + 1000

  return riskTypeId < upperBound && riskTypeId >= lowerBound
}

// Return the updated cards with the count for each category
const addCountToCards = (cards: DashboardCard[], stats: RiskTypeSummary[]) => {
  return stats.reduce(
    (updatedCards, riskType) => {
      const riskTypeId = riskType.riskTypeId
      return updatedCards.map((card) => {
        if (riskBelongsToCardGroup(riskTypeId, card)) {
          return { ...card, value: (card.value += riskType.count) }
        } else {
          return card
        }
      })
    },
    cards.map((card) => ({ ...card, value: 0 }))
  ) // reset count in cards before computing sum
}

const DashboardRiskSummary: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true)
  const [cards, setCards] = useState<DashboardCard[]>(INITIAL_CARDS)
  const [selectedCardGroupType, setSelectedCardGroupType] = useState(1)
  const [riskTypes, setRiskTypes] = useState<RiskTypeSummary[]>([])
  const cancelablePromise = useCancelablePromise()

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)

      try {
        const apiResponse = await cancelablePromise(API.get('risks', `${GENERAL_URLS.RISKS}/stats`, {}))
        const updatedCards = addCountToCards(INITIAL_CARDS, apiResponse.stats)

        setCards(updatedCards)
        setRiskTypes(apiResponse.stats)
        setLoading(false)
      } catch (error) {
        if (error.name !== 'PromiseCanceledError') {
          alertError(error.message)
          setLoading(false)
        }
      }
    }

    fetchStats()
  }, [cancelablePromise])

  const selectedCard = cards.find((card) => selectedCardGroupType === card.groupType)
  const riskTypesToRender = riskTypes.filter((riskType) => riskBelongsToCardGroup(riskType.riskTypeId, selectedCard))

  return (
    <div className='DashboardRiskSummary'>
      <DashboardGrid
        loading={loading}
        cards={cards}
        selectedCardGroupType={selectedCardGroupType}
        onCardClick={(cardGroupType: number) => setSelectedCardGroupType(cardGroupType)}
        riskTypes={riskTypesToRender}
      />
    </div>
  )
}

export default DashboardRiskSummary
