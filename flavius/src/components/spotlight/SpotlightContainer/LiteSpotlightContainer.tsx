import useLitePlatformApiClient from 'api/clients/litePlatformApiClient'
import React from 'react'
import useQueryParam from 'util/hooks/useQueryParam'
import LITE_TABS from '../LiteTabs'
import LiteSpotlightGrid from 'components/spotlight/SpotlightGrid/LiteSpotlightGrid'

interface LiteSpotlightContainerProps {
  personId: string
  platformId: string
}

const LiteSpotlightContainer: React.FC<LiteSpotlightContainerProps> = ({ personId, platformId }) => {
  const { useGetLitePerson } = useLitePlatformApiClient()
  const [person, , isLoading] = useGetLitePerson(personId, platformId)
  const [subNavKey, changeSubNavKey] = useQueryParam<SubNavType>('subNavKey', 'allActivity')

  const getSelectedSubNavTab = () => {
    return LITE_TABS.find((subNavTab) => subNavTab.seriesKey === subNavKey) || LITE_TABS[0]
  }

  return (
    <LiteSpotlightGrid
      onSubNavClick={changeSubNavKey}
      activePerson={person}
      personLoading={isLoading}
      renderDetailsTable={getSelectedSubNavTab()?.renderDetailsTable}
      selectedEmail={person?.primaryEmail.address}
      selectedSubNavKey={subNavKey}
    />
  )
}

export default LiteSpotlightContainer
