import React, { useEffect, useState } from 'react'
import { Tabs, Tab, TabList } from '@altitudenetworks/component-library'
import AppSpotlightHeader from '../AppSpotlightHeader'
import AppSpotlightGridTab, { SubNavTab } from '../AppSpotlightGridNav'
import LineChart from 'components/elements/LineChart'
import PreviewChart from 'components/elements/PreviewChart'
import ContentLoader from 'react-content-loader'
import './AppSpotlightGrid.scss'

export interface AppSpotlightGridProps {
  wrapperType: WrapperTypeOptions
  navTabs: SubNavTab[]
  selectedTab: AppSpotlightSubNavType
  appId: string
  platformId: string
  app: Maybe<Application>
  stats?: any
  loading: boolean
  statsLoading: boolean
  onSubNavClick: (key: AppSpotlightSubNavType) => void
}

export const AppSpotlightGrid: React.FC<AppSpotlightGridProps> = ({
  wrapperType,
  navTabs,
  appId,
  platformId,
  app,
  selectedTab,
  onSubNavClick,
  stats,
  loading,
  statsLoading
}) => {
  const handleSubNavClick = (subNavKey: AppSpotlightSubNavType) => {
    onSubNavClick(subNavKey)
    setChartVisible(false)
  }

  const tabIndex = navTabs.findIndex((value) => value.seriesKey === selectedTab)
  const [labels, setLabels] = useState([])
  const [chartVisible, setChartVisible] = useState(false)

  useEffect(() => {
    if (stats) {
      setLabels(stats.labels)
    }
  }, [stats])

  const renderChart = () => {
    if (statsLoading) {
      return (
        <div className='ChartLoading'>
          <ContentLoader
            backgroundColor='#f0f0f0'
            foregroundColor='#f7f7f7'
            width={240}
            height={260}
            className='ChartLoading'
            uniqueKey='ChartLoading'>
            <rect x='0' y='0' width='280' height='260' />
          </ContentLoader>
        </div>
      )
    } else if (labels.length > 0 && stats.series[selectedTab].length > 0) {
      return <LineChart key={selectedTab} data={{ labels, series: [stats.series[selectedTab]] }} />
    } else {
      return ''
    }
  }

  const clickHandler = (disabled: boolean) => {
    setChartVisible(disabled)
  }

  const renderPreviewChart = (unit: string) => {
    if (statsLoading) {
      return (
        <div className='PrevChartLoading'>
          <ContentLoader
            backgroundColor='#f0f0f0'
            foregroundColor='#f7f7f7'
            width={200}
            height={45}
            uniqueKey='PrevChartLoading'
            className='PrevChartLoading'>
            <rect x='0' y='5' width='200' height='45' />
          </ContentLoader>
        </div>
      )
    } else if (labels.length > 0 && stats.series[selectedTab].length > 0) {
      return (
        <PreviewChart
          key={selectedTab}
          data={{ labels, series: [stats.series[selectedTab]] }}
          unit={unit}
          onClick={clickHandler}
        />
      )
    } else {
      return ''
    }
  }

  return (
    <div className='AppSpotlightGrid'>
      <AppSpotlightHeader loading={loading} app={app} />
      <div className='AppSpotlightGrid__wrapper'>
        <Tabs className='AppSpotlighGrid__Tabs' width={720} defaultActiveTab={tabIndex}>
          <TabList className='AppSpotlightGrid__TabList'>
            {navTabs.map((navTab, key) => (
              <Tab key={`AppSpotlight_Tab_${key}`} className='AppSpotlightGrid__Tab'>
                <AppSpotlightGridTab
                  subNavTab={navTab}
                  onSubNavClick={handleSubNavClick}
                  loading={statsLoading}
                  appStats={stats}
                />
              </Tab>
            ))}
          </TabList>
        </Tabs>
        <div className='AppSpotlightGrid__content'>
          <div className='AppSpotlightGrid__content--details'>
            <div className='AppSpotlightGrid__content--header'>
              <div className='title'>{navTabs[tabIndex].title}</div>
              <div className='prev-chart'>{renderPreviewChart(navTabs[tabIndex].unit)}</div>
            </div>
            {chartVisible ? <div className='AppSpotlightGrid__content--chart'>{renderChart()}</div> : <div />}
            {navTabs[tabIndex].renderDetailsTable(appId, platformId, wrapperType)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppSpotlightGrid
