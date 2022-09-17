import React from 'react'
import ContentLoader from 'react-content-loader'
import DonutChart from 'components/elements/DonutChart'
import { largeNumberDisplay } from 'util/helpers'
import UI_STRINGS from 'util/ui-strings'
import './AppSpotlightGridNav.scss'

interface SubNavTabData {
  value: number
  subTitleText: string
  series: number[]
  serieLabels: string[]
  padding?: number
  valueType: 'risk' | 'download' | 'auth'
}

export interface SubNavTab {
  label: string
  seriesKey: AppSpotlightSubNavType
  value: SubNavTabData
  title: string
  unit: string
  renderDetailsTable: (appId: string, platformId: string, wrapperType: WrapperTypeOptions) => JSX.Element
}

export interface AppSpotlightGridNavProps {
  subNavTab: SubNavTab
  appStats?: any
  loading: boolean
  onSubNavClick: (key: AppSpotlightSubNavType) => void
}

const severity2 = UI_STRINGS.APPSPOTLIGHT.SEVERITY + ' 2 '
export const AppSpotlightGridTab: React.FC<AppSpotlightGridNavProps> = ({
  subNavTab,
  onSubNavClick,
  appStats,
  loading
}) => {
  const handleClick = (key: AppSpotlightSubNavType) => () => {
    onSubNavClick(key)
  }
  const totalEmails = appStats ? appStats.tileInfo.totalEmails : 0
  const totalSensitive = appStats ? appStats.tileInfo.totalSensitive : 0
  const len = appStats ? appStats.series[subNavTab.seriesKey].length : 0

  const chartData = {
    subTitleText: subNavTab.value.subTitleText,
    values: subNavTab.value.series,
    padding: -1,
    valueType: subNavTab.value.valueType,
    valueText: ''
  }

  let currentTotal: number = 0
  let currentPercentage: number = 0
  let roundedCurrentPercentage: number = 0

  switch (subNavTab.value.valueType) {
    case 'auth':
      currentTotal = appStats ? appStats.tileInfo.currentAuthorizedBy : 0
      currentPercentage = totalEmails > 0 ? currentTotal / totalEmails : 0
      roundedCurrentPercentage = Math.min(Math.round(currentPercentage * 100), 100)
      chartData.values = totalEmails > 0 ? [roundedCurrentPercentage] : [1]
      chartData.valueText = totalEmails === 0 ? '>1%' : `${roundedCurrentPercentage}%`
      chartData.padding = 100 - roundedCurrentPercentage
      break
    case 'risk':
      currentTotal = appStats ? appStats.tileInfo.currentRisks : 0
      chartData.values = currentTotal > 0 ? [currentTotal] : [1]
      chartData.valueText = largeNumberDisplay(currentTotal)
      break
    case 'download':
      currentTotal =
        len > 0 ? appStats.series[subNavTab.seriesKey].reduce((total: number, current: number) => total + current) : 0
      chartData.valueText = largeNumberDisplay(currentTotal)
      currentPercentage = totalSensitive > 0 ? totalSensitive / currentTotal : 0
      roundedCurrentPercentage = Math.min(Math.round(currentPercentage * 100), 100)
      chartData.values = totalSensitive > 0 ? [roundedCurrentPercentage] : [1]
      chartData.padding = 100 - roundedCurrentPercentage
      break
    default:
      const _exhasutiveCheck: never = subNavTab.value.valueType
      throw new Error(`Attempted to render an unexpected App Spotlight Nav Tab type: ${_exhasutiveCheck}`)
  }

  const detailElement = () => {
    if (loading) {
      return <TabContentLoading />
    }
    switch (subNavTab.value.valueType) {
      case 'auth':
        return UI_STRINGS.APPSPOTLIGHT.OF_TOTAL_USERS(largeNumberDisplay(totalEmails))
      case 'risk':
        return (
          <ul>
            <li className='Severe2'>
              {severity2}
              <span>
                {currentTotal} {currentTotal === 1 ? 'risk' : 'risks'}
              </span>
            </li>
            {/* {subNavTab.value.serieLabels.map((label, index) => (
              <li key={index} className={cx('Severe' + (5 - index))}>
                {label} {subNavTab.value.series[index]} {subNavTab.value.series[index] > 1 ? 'risks' : 'risk'}
              </li>
            ))} */}
          </ul>
        )
      default:
        return UI_STRINGS.APPSPOTLIGHT.TOTAL_SENSITIVE_FILES(totalSensitive)
    }
  }

  return (
    <div key={subNavTab.seriesKey} className='AppSpotlightGridTabItem' onClick={handleClick(subNavTab.seriesKey)}>
      <div className='AppSpotlightGridTabItem--title'>{subNavTab.label}</div>
      <div className={`AppSpotlightGridTabItem--content`}>
        <div className='AppSpotlightGridTabItem--details'>{detailElement()}</div>
        <div className='AppSpotlightGridTabItem--chart'>
          <DonutChart data={chartData} loading={loading} />
        </div>
      </div>
    </div>
  )
}

const TabContentLoading = () => (
  <div className='TabContentLoading'>
    <ContentLoader
      backgroundColor='#F0F0F0'
      foregroundColor='#F7F7F7'
      height={29}
      width={79}
      uniqueKey='TabContentLoading'>
      <rect x={0} y={0} width={79} height={29} rx={4} ry={4} />
    </ContentLoader>
  </div>
)

export default AppSpotlightGridTab
