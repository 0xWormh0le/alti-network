import React from 'react'
import Person from 'models/Person'
import SpotlightGrid from '../SpotlightGrid'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import UI_STRINGS from 'util/ui-strings'
import INITIAL_TABS from '../Tabs'
import usePersonApiClient from 'api/clients/personApiClient'
import AnonymousPerson from 'models/AnonymousPerson'
import { useQueryParam } from 'util/hooks'

export interface SpotlightContainerProps {
  personId: string
  wrapperType: WrapperTypeOptions
}

const SpotlightContainer: React.FC<SpotlightContainerProps> = (props) => {
  const { wrapperType, personId } = props

  const [selectedEmail, setSelectedEmail] = useQueryParam<string>('selectedEmail', personId, {
    [wrapperType === 'page' ? 'page' : 'modalPage']: 1
  })
  const [selectedSubNavKey, setSelectedSubNavKey] = useQueryParam<SubNavType>(
    'selectedSubNavKey',
    INITIAL_TABS[0].seriesKey,
    {
      [wrapperType === 'page' ? 'page' : 'modalPage']: 1
    }
  )

  const { useGetPerson, useGetPersonStats } = usePersonApiClient()
  const [activePerson, activePersonErr, isLoadingActivePerson, getPerson] = useGetPerson({
    requestDetails: { personId }
  })
  const [stats] = useGetPersonStats({
    requestDetails: { personId: selectedEmail }
  })

  const getSelectedSubNavTab = () => {
    return INITIAL_TABS.find((subNavTab) => subNavTab.seriesKey === selectedSubNavKey) || INITIAL_TABS[0]
  }

  const chartData = stats
    ? {
        labels: stats.labels.sort(),
        series: stats.series[selectedSubNavKey]
      }
    : undefined

  if (activePersonErr) {
    return (
      <Typography variant={TypographyVariant.H3} className='Spotlight__no-results'>
        {UI_STRINGS.SPOTLIGHT.NO_RESULT_FOUND}
      </Typography>
    )
  }

  const selectedSubNavTab = getSelectedSubNavTab()

  return (
    <SpotlightGrid
      isLitePlatform={false}
      personLoading={isLoadingActivePerson}
      subNavLoaded={Boolean(stats)}
      subNavTabs={INITIAL_TABS}
      selectedSubNavKey={selectedSubNavKey}
      onSubNavClick={(navKey) => setSelectedSubNavKey(navKey)}
      chartData={chartData}
      activePerson={activePerson ? new Person(activePerson) : new AnonymousPerson()}
      renderDetailsTable={selectedSubNavTab.renderDetailsTable}
      selectedEmail={selectedEmail}
      onSelectedContactCardClick={(email) => setSelectedEmail(email)}
      getData={() => getPerson.call({ personId: selectedEmail })}
    />
  )
}

export default SpotlightContainer
