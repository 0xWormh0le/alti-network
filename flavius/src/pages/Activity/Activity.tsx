import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Tabs, Tab, TabList, TabPanel } from '@altitudenetworks/component-library'
import PageTitle from 'components/elements/PageTitle'
import Typography, { TypographyVariant } from 'components/elements/Typography'
import FileActivity from './FileActivity'
import { platformImages } from 'config'
import { getPlatformBasicData, useIsSubscribedToPlatform } from 'util/platforms'
import UI_STRINGS from 'util/ui-strings'
import ContentLoader from 'react-content-loader'
import './Activity.scss'

export interface ActivityParams {
  platformId: string
}
interface TabLink {
  id: string
  label: string
}

const tabLinks: TabLink[] = [{ id: 'file', label: UI_STRINGS.ACVITITY.TAB_LABELS.FILE_ACTIVITY }]

const Risks = () => {
  const { platformId } = useParams<ActivityParams>()
  const [defaultActiveTab, setDefaultActiveTab] = useState<number>(0)
  const [isLoadingPlatforms, isPlatformConnected] = useIsSubscribedToPlatform(platformId)
  const currentPlatform = getPlatformBasicData(platformId)

  const onSwitchTab = (newTabIndex: number) => {
    setDefaultActiveTab(newTabIndex)
  }

  return (
    <div className='Activity'>
      <PageTitle
        title={
          <div className='Activity__title'>
            {UI_STRINGS.ACVITITY.TITLE}
            <img src={platformImages[platformId].Icon} alt={platformId} />
          </div>
        }
      />

      <div className='Activity__main'>
        {isLoadingPlatforms ? (
          <PlatformsLoading />
        ) : isPlatformConnected ? (
          defaultActiveTab !== undefined && (
            <Tabs defaultActiveTab={defaultActiveTab}>
              <TabList>
                {tabLinks.map((tabLink, index) => (
                  <Tab key={tabLink.id} onClick={() => onSwitchTab(index)}>
                    {tabLink.label}
                  </Tab>
                ))}
              </TabList>
              <TabPanel>
                <Typography variant={TypographyVariant.LABEL} weight={'normal'}>
                  {UI_STRINGS.ACVITITY.FILE.DESCRIPTION_CONNECTED(currentPlatform.platformName)}
                </Typography>
                <FileActivity />
              </TabPanel>
            </Tabs>
          )
        ) : (
          <Typography variant={TypographyVariant.H3}>
            {UI_STRINGS.ACVITITY.FILE.DESCRIPTION_NOT_CONNECTED(currentPlatform.platformName)}
          </Typography>
        )}
      </div>
    </div>
  )
}

const PlatformsLoading = () => (
  <ContentLoader
    backgroundColor='#f0f0f0'
    foregroundColor='#f7f7f7'
    preserveAspectRatio='none'
    width={'100%'}
    height={300}
    uniqueKey='platforms-loading'>
    <rect x={0} y={0} width='100%' height={52} />
    <rect x={0} y={62} width='100%' height={52} />
    <rect x={0} y={124} width='100%' height={52} />
    <rect x={0} y={186} width='100%' height={52} />
    <rect x={0} y={248} width='100%' height={52} />
  </ContentLoader>
)

export default Risks
